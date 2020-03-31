const router = require('express').Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    // Validate data
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if user is already in DB
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) {
        return res.status(400).send('Email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    // Validate data
    const {error} = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).send('Email or password is wrong');
    }

    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send('Email or password is wrong');
    }

    // Create token
    const token = jwt.sign({_id: user._id, admin: user.admin}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;