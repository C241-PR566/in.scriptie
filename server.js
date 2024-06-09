import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import InputError from './exceptions/InputError.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use('/translations', homeRoutes); 
app.use('/', userRoutes);
app.use('/', homeRoutes);

app.use((err, req, res, next) => {
    if (err instanceof InputError) {
        return res.status(err.statusCode).json({ status: 'fail', message: err.message });
    }
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
});
