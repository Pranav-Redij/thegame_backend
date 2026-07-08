const express = require('express');
const router = express.Router();

const { generateToken } = require('../jwt.js');
const users = require('../models/users.js');


router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await users.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                error: 'Username already exists'
            });
        }

        const newUser = new users({
            username,
            password
        });

        const savedUser = await newUser.save();

        const payload = {
            id: savedUser._id,
            username: savedUser.username,
        };

        const token = generateToken(payload);

        return res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const fetchedUser = await users.findOne({
            username
        });

        if (
            !fetchedUser ||
            !(await fetchedUser.comparePassword(password))
        ) {
            return res.status(401).json({
                error: 'Invalid username or password'
            });
        }

        const payload = {
            id: fetchedUser._id,
            username: fetchedUser.username,
        };

        const token = generateToken(payload);

        return res.status(200).json({
            token,
            user: {
                id: fetchedUser._id,
                username: fetchedUser.username,
            }
        });

    } catch (error) {
        console.error('Login Error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;