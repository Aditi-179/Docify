// server/controllers/generationController.js
const geminiService = require('../services/geminiService');
const docGenerator = require('../services/documentGeneratorService');
const fs = require('fs/promises');
const path = require('path');

const generatePromptToDoc = async (req, res) => {
    try {
        const { textInput } = req.body;
        if (!textInput) return res.status(400).json({ error: 'Text input is required.' });
        const documents = await geminiService.generateSimple('Prompt-to-Doc', textInput, null);
        res.status(200).json({ documents });
    } catch (error) {
        console.error(`[Controller Error] in Prompt-to-Doc mode:`, error);
        res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
};

const generateTextToDoc = async (req, res) => {
    try {
        const { textInput } = req.body;
        if (!textInput) return res.status(400).json({ error: 'Text input is required.' });
        const documents = await geminiService.generateSimple('Text-to-Doc', textInput, null);
        res.status(200).json({ documents });
    } catch (error) {
        console.error(`[Controller Error] in Text-to-Doc mode:`, error);
        res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
};

const generateDocToDoc = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'File is required.' });
        const documents = await geminiService.generateSimple('Doc-to-Doc', null, file);
        res.status(200).json({ documents });
    } catch (error) {
        console.error(`[Controller Error] in Doc-to-Doc mode:`, error);
        res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
};

const generateReformattedDocument = async (req, res) => {
    try {
        const themeFile = req.files?.themeFile?.[0];
        const contentFile = req.files?.contentFile?.[0];

        if (!themeFile || !contentFile) {
            return res.status(400).json({ error: 'Both a theme file and a content file are required.' });
        }

        const jsonData = await geminiService.generateWithLayoutReplication(themeFile, contentFile);

        const baseTemplatePath = path.resolve(__dirname, '../templates/base-template.docx');
        const templateBuffer = await fs.readFile(baseTemplatePath);

        const docxBuffer = await docGenerator.generateDocx(jsonData, templateBuffer);

        res.setHeader('Content-Disposition', 'attachment; filename=Reformatted-Document.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(docxBuffer);

    } catch (error) {
        console.error(`[Controller Error] in Reformatter:`, error);
        res.status(500).json({ error: error.message || "An unexpected error occurred during reformatting." });
    }
};

module.exports = { generatePromptToDoc, generateTextToDoc, generateDocToDoc, generateReformattedDocument };