import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Firestore } from '@google-cloud/firestore';
import storeData from '../services/storeData.js';
import crypto from 'crypto';

async function registerUser(req, res) {
    const { email, password } = req.body;
    const db = new Firestore();
    const usersCollection = db.collection('users');

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    const userData = {
        id,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
    };

    try {
        await storeData('users', id, userData);
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: `Gagal menyimpan data pengguna: ${error.message}`,
        });
    }

    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: userData,
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const db = new Firestore();
    const usersCollection = db.collection('users');

    const userSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
    if (userSnapshot.empty) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password',
        });
    }

    const user = userSnapshot.docs[0].data();
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password',
        });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        token,
    });
}

export { registerUser, loginUser };
