import Router from 'express';

const router = Router();

import User from '../Model/User.js';


// Get all users
router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Create a new user
router.post('/api/users', async (req, res) => {
    try {

        let { username, password, email } = req.body;

        const user = new User({
            username,
            password,
            email
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;