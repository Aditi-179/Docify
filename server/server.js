// server/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- 1. Import new packages ---
const multer = require('multer');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// --- 2. Configure Multer for in-memory file storage ---
// We'll process the file immediately, so no need to save it to disk.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 3. Update the route to use the Multer middleware ---
// upload.single('templateFile') tells Multer to expect one file named 'templateFile'.
app.post('/generate-doc', upload.single('templateFile'), async (req, res) => {
    console.log('\n--- [SERVER] New Request Received ---'); 
    
    // Text data now comes from req.body.topics
    const { topics } = req.body;
    const topicsArray = topics.split(',').filter(t => t.trim() !== ''); // Client will send a comma-separated string
    
    // The uploaded file is available in req.file
    const templateFile = req.file;

    console.log(`[SERVER] Topics received:`, topicsArray);
    if (templateFile) {
        console.log(`[SERVER] Template file received: ${templateFile.originalname}`);
    }

    if (!topicsArray || topicsArray.length === 0) {
        return res.status(400).send({ error: 'A non-empty array of topics is required' });
    }

    try {
        let templateContent = "";

        // --- 4. Extract content if a template file was uploaded ---
        if (templateFile) {
            console.log(`[SERVER] Processing template file...`);
            if (templateFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // It's a .docx file
                const result = await mammoth.extractRawText({ buffer: templateFile.buffer });
                templateContent = result.value;
                console.log('[SERVER] Extracted text from DOCX.');
            } else if (templateFile.mimetype === 'application/pdf') {
                // It's a .pdf file
                const data = await pdfParse(templateFile.buffer);
                templateContent = data.text;
                console.log('[SERVER] Extracted text from PDF.');
            }
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // --- 5. Dynamic Prompt Engineering ---
        const prompt = `
        You are an expert technical writer and a JSON formatting machine.
        Your task is to generate a well-structured document for EACH of the topics provided below.
        The content for each document MUST use basic HTML for all formatting (<h1>, <h2>, <p>, <ul>, <li>, <strong>).
        Do NOT include <html>, <head>, or <body> tags in the HTML content.

        ${templateContent ? `
        --- IMPORTANT INSTRUCTION ---
        You MUST follow the structure, tone, and formatting style of the following template document.
        Analyze its use of headings, bullet points, and paragraph length, and apply that same style to the new documents you generate.
        
        TEMPLATE:
        """
        ${templateContent}
        """
        --- END TEMPLATE ---
        ` : ''}

        You MUST respond with a single, valid JSON array. Each object in the array must have two keys: "topic" and "content".
        The "topic" key's value should be the original topic string.
        The "content" key's value should be the generated HTML document string.
        Do NOT add any introductory text, explanations, or markdown fences like \`\`\`json around your response. Your entire output must be only the raw JSON array string itself.

        Generate documents for the following topics: ${topicsArray.join(', ')}
        `;

        console.log('[SERVER] Sending combined prompt to Gemini...');
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('[SERVER] Received response from Gemini. Attempting to parse JSON...');
        
        let documents;
        try {
            documents = JSON.parse(text);
        } catch (parseError) {
            console.warn('[SERVER] Direct JSON parsing failed. Attempting to extract JSON from text...');
            const jsonMatch = text.match(/\[.*\]/s); 
            if (jsonMatch && jsonMatch[0]) {
                documents = JSON.parse(jsonMatch[0]);
                console.log('[SERVER] Successfully extracted and parsed JSON.');
            } else {
                console.error('[SERVER] CRITICAL: Could not find a valid JSON array in the model response.');
                console.error('--- Model Response Start ---\n' + text + '\n--- Model Response End ---');
                throw new Error("Failed to parse a valid JSON array from the model's response.");
            }
        }
        
        console.log('[SERVER] All documents parsed successfully.');
        res.send({ documents: documents });

    } catch (error) {
        console.error('--- [SERVER] ERROR during Google AI API call or parsing ---');
        console.error(error); 
        res.status(500).send({ error: "Failed to generate document(s). Check server logs for details." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});