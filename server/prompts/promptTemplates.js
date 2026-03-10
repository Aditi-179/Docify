// server/prompts/promptTemplates.js

// This file contains architected prompts designed for maximum reliability and strict JSON adherence.

// ====================================================================================
// PROMPTS FOR SIMPLE WORKFLOW (Prompt-to-Doc, Text-to-Doc, Doc-to-Doc)
// ====================================================================================

const HTML_IN_JSON_INSTRUCTIONS = `
You are a headless API service that converts raw text into structured HTML content.
Your ONLY output format is a single, valid JSON array.
Each object in the array MUST have two keys: "topic" (a string) and "content" (a string of basic HTML).
You MUST NOT include <html>, <head>, <body> tags, or markdown fences like \`\`\`json.
You MUST NOT add any explanatory text, comments, or apologies. Your entire response must be the raw JSON array.`;

const prompts = {
    'Prompt-to-Doc': ({ textInput }) => `
        ${HTML_IN_JSON_INSTRUCTIONS}
        Generate a separate document for EACH of the topics provided below, which are separated by newlines.
        Topics:
        ${textInput}`,

    'Text-to-Doc': ({ textInput }) => `
        ${HTML_IN_JSON_INSTRUCTIONS}
        Transform the following messy text into a single, coherent document in basic HTML. Create a suitable topic title.
        Text to transform:
        """
        ${textInput}
        """`,

    'Doc-to-Doc': ({ fileContent, fileName }) => `
        ${HTML_IN_JSON_INSTRUCTIONS}
        Analyze the following document content and create a single, structured summary of its key insights in basic HTML. Use the provided filename as the topic.
        Filename: "${fileName}"
        Content to analyze:
        """
        ${fileContent}
        """`,

// ====================================================================================
// PROMPTS FOR ADVANCED REFORMATTER WORKFLOW
// ====================================================================================

    'analyze-layout': (pdfLayoutJsonString) => `
        You are a document layout analysis API. Your function is to receive a JSON object representing a PDF's raw layout and convert it into a semantic JSON structure describing the cover page.
        
        RULES:
        1. Your output MUST be a single, valid JSON object.
        2. Identify key elements: 'universityName', 'mainTitle', 'subtitle', and tables for author/student information.
        3. If you cannot identify an element, omit its key.
        4. Your entire response MUST be the raw JSON object. Do not include any other text.

        EXAMPLE:
        Input: A JSON string with text and coordinates.
        Output: { "hasCoverPage": true, "coverPageElements": [ { "element": "mainTitle", "placeholder": "The Main Title" }, { "element": "authorTable", "columns": ["Name", "ID"] } ] }

        Analyze the following PDF data and produce the semantic layout JSON:
        ${pdfLayoutJsonString}
    `,

    'generate-from-layout': (layoutDescriptionJsonString, sourceContent) => `
        You are a data structuring API. Your function is to populate a predefined JSON layout with information extracted from a new source text.

        **CRITICAL RULES:**
        1. Your entire output MUST be a single, valid, and complete JSON object.
        2. When inserting text from the source content into a JSON string value, you MUST escape all special characters. Specifically, backslashes become \\\\, double quotes become \\", and newlines become \\n.
        3. Populate all fields defined in the 'Layout Description'. If you cannot find information for a field in the 'New Source Content', you MUST use an empty string "" as its value. DO NOT omit the key.
        4. Structure the remaining body of the source content into a 'sections' array, where each object has a 'heading' and an array of 'paragraphs'.
        5. Your response MUST be ONLY the raw, final JSON object. No explanations, no markdown.

        **Layout Description (The structure you must populate):**
        ${layoutDescriptionJsonString}

        **New Source Content (The data you must use):**
        """
        ${sourceContent}
        """

        Now, execute your function and generate the final data JSON object.
    `
};

const getPrompt = (mode, ...args) => {
    if (!prompts[mode]) {
        throw new Error(`Invalid generation mode provided: ${mode}`);
    }
    console.log(`[Prompts] Generating prompt for mode: ${mode}`);
    return prompts[mode](...args);
};

module.exports = { getPrompt };