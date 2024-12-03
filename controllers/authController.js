import { User } from '../models/User.js';
import { generateToken } from '../config/jwt.js';

import { googleClient } from '../config/oauth2.js';

// Register a new user
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(user),
            user,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            token: generateToken(user),
            user,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};


// Google login
export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, googleId: payload.sub });
        }

        res.status(200).json({
            message: 'Google login successful',
            token: generateToken(user),
            user,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};