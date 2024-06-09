import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

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

// Adding /translations endpoint for beta testing
router.get('/translations', authMiddleware, (req, res) => {
    res.status(200).json({ status: 'beta', message: 'Translation feature is in beta.' });
});

export default router;
