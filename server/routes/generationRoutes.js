// server/routes/generationRoutes.js
const express = require('express');
const multer = require('multer');
const { generatePromptToDoc, generateTextToDoc, generateDocToDoc, generateReformattedDocument } = require('../controllers/generationController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fixed: Separate specific endpoints for all 4 features
router.post('/prompt-to-doc', upload.none(), generatePromptToDoc);

router.post('/text-to-doc', upload.none(), generateTextToDoc);

router.post('/doc-to-doc', upload.single('contentFile'), generateDocToDoc);

router.post('/reformatter',
    upload.fields([
        { name: 'themeFile', maxCount: 1 },
        { name: 'contentFile', maxCount: 1 }
    ]),
    generateReformattedDocument
);

module.exports = router;