// server/services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getPrompt } = require('../prompts/promptTemplates');
const fileProcessor = require('./fileProcessorService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using a reliable, standard model. Change if needed.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });



// This function makes the actual API call
// server/services/geminiService.js

// ... (keep the other functions and imports as they are) ...

const callGeminiAndParse = async (prompt, expectedFormat = 'json-array') => {
    console.log('[GeminiService] Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text();

    try {
        // --- FIX: More robust JSON extraction ---
        // 1. Remove markdown fences if they exist
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        // 2. Find the start and end of the main JSON structure
        const startIndex = expectedFormat === 'json-array' ? rawText.indexOf('[') : rawText.indexOf('{');
        const endIndex = expectedFormat === 'json-array' ? rawText.lastIndexOf(']') : rawText.lastIndexOf('}');

        if (startIndex === -1 || endIndex === -1) {
            throw new Error(`Could not find start/end of a JSON ${expectedFormat === 'json-array' ? 'array' : 'object'}.`);
        }

        const jsonString = rawText.substring(startIndex, endIndex + 1);
        
        // 3. Parse the extracted string
        return JSON.parse(jsonString);

    } catch (e) {
        console.error(`[GeminiService] CRITICAL: JSON Parsing failed for ${expectedFormat}.`, e);
        console.error("--- Model Response Start ---\n" + rawText + "\n--- Model Response End ---");
        throw new Error("The AI response was not in the expected JSON format.");
    }
};

// ... (The rest of the file: generateSimple, generateWithLayoutReplication) remains the same.
// FIX: A service function for the 3 SIMPLE modes.
const generateSimple = async (mode, textInput, file) => {
    let promptData = { textInput };
    if (mode === 'Doc-to-Doc') {
        if (!file) throw new Error("A file is required for Doc-to-Doc mode.");
        promptData.fileContent = await fileProcessor.extractRawText(file);
        promptData.fileName = file.originalname;
    }
    const prompt = getPrompt(mode, promptData);
    // It expects a JSON array for the Tiptap editor
    return await callGeminiAndParse(prompt, 'json-array');
};

// FIX: The service function for the COMPLEX Reformatter mode.
const generateWithLayoutReplication = async (themeFile, contentFile) => {
    // Stage 1: Analyze
    const layoutData = await fileProcessor.getPdfLayoutData(themeFile.buffer);
    const analysisPrompt = getPrompt('analyze-layout', JSON.stringify(layoutData));
    const layoutDescriptionJson = await callGeminiAndParse(analysisPrompt, 'json-object');
    
    // Stage 2: Generate
    const sourceContent = await fileProcessor.extractRawText(contentFile);
    const generationPrompt = getPrompt('generate-from-layout', JSON.stringify(layoutDescriptionJson), sourceContent);
    // It expects a JSON object for the docxtemplater
    const finalDataJson = await callGeminiAndParse(generationPrompt, 'json-object');

    return finalDataJson;
};

module.exports = { generateSimple, generateWithLayoutReplication };