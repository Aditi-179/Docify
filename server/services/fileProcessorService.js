// server/services/fileProcessorService.js
const mammoth = require('mammoth');
const pdf = require('pdf-parse');
const PDFParser = require('pdf2json');

// --- FIX: This function was missing or incorrectly defined. ---
const extractRawText = async (file) => {
    if (!file) {
        throw new Error("No file provided to extract text from.");
    }
    
    console.log(`[FileProcessor] Extracting raw text from: ${file.originalname}`);

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        console.log('[FileProcessor] Extracted text from DOCX.');
        return result.value;
    } 
    
    if (file.mimetype === 'application/pdf') {
        const data = await pdf(file.buffer);
        console.log('[FileProcessor] Extracted text from PDF.');
        return data.text;
    }

    if (file.mimetype === 'text/plain' || file.mimetype === 'text/markdown') {
        console.log('[FileProcessor] Extracted text from plain text file.');
        return file.buffer.toString('utf8');
    }

    throw new Error(`Unsupported file type for raw text extraction: ${file.mimetype}`);
};

const getPdfLayoutData = (pdfBuffer) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();
        
        pdfParser.on("pdfParser_dataReady", pdfData => {
            console.log('[FileProcessor] PDF layout data extracted via pdf2json.');
            resolve(pdfData);
        });

        pdfParser.on("pdfParser_dataError", errData => {
            console.error('[FileProcessor] Error parsing PDF with pdf2json:', errData);
            reject(new Error("Failed to parse PDF for layout analysis."));
        });

        pdfParser.parseBuffer(pdfBuffer);
    });
};

module.exports = { extractRawText, getPdfLayoutData };