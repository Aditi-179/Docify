// server/services/documentGeneratorService.js
const fs = require('fs');
const path = require('path');
const Docxtemplater = require('docxtemplater');
// --- FIX: Import PizZip instead of JSZip ---
const PizZip = require('pizzip');

const generateDocx = (jsonData, templateBuffer) => { // This can be synchronous again
    console.log('[DocGen] Assembling DOCX from template...');
    
    // --- FIX: Use PizZip constructor, which works like the old JSZip ---
    const zip = new PizZip(templateBuffer);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    
    doc.setData(jsonData);

    try {
        doc.render();
    } catch (error) {
        console.error('Error rendering DOCX template:', error.message);
        // This helps debug placeholder issues
        if (error.properties && error.properties.errors) {
            console.error('Template Errors:', error.properties.errors);
            const newError = new Error("Template rendering failed. Mismatched placeholders.");
            newError.properties = error.properties;
            throw newError;
        }
        throw error;
    }

    const buffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });

    console.log('[DocGen] DOCX assembly complete.');
    return buffer;
};

module.exports = { generateDocx };