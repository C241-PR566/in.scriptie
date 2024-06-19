import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import { saveTranslation, getUserTranslations } from '../models/translationModel.js';

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    res.status(200).send(`
        <html>
            <head>
                <title>Home Page</title>
            </head>
            <body>
                <h1>Welcome to IN.SCRIPTIE</h1>
            </body>
        </html>
    `);
});

router.get('/translations', authMiddleware, (req, res) => {
    res.status(200).json({ status: 'beta', message: 'Translation feature is in beta.' });
});

router.post('/translations', authMiddleware, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'fail',
            message: 'No image uploaded'
        });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const userId = req.user.id;

    try {
        const translationData = await saveTranslation(userId, originalname, mimetype, size, buffer);

        res.status(200).json({
            status: 'success',
            message: 'Image received, translation feature is in beta',
            data: translationData
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: `Failed to save translation: ${error.message}`
        });
    }
});

router.get('/translations/histories', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const translations = await getUserTranslations(userId);

        res.status(200).json({
            status: 'success',
            data: translations
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: `Failed to retrieve translation histories: ${error.message}`
        });
    }
});

export default router;
