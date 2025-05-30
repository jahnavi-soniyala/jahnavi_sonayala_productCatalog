const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const newUser = await User.create({ username, email, password: hashed });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username });
});

module.exports = router;
