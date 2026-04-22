const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otpCode = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        user = new User({
            fullName,
            email,
            password,
            otp: {
                code: otpCode,
                expiresAt: otpExpiry
            }
        });

        await user.save();

        // Send OTP Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your OTP Code',
                message: `Your OTP is ${otpCode}. It expires in 5 minutes.`,
                otp: otpCode
            });

            res.status(201).json({
                message: 'Signup successful. Please verify your email with the OTP sent.',
                email: user.email
            });
        } catch (err) {
            console.error('Email error:', err);
            res.status(201).json({
                message: 'User created but failed to send email. Please try resending OTP.',
                email: user.email
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account already verified' });
        }

        // Check OTP
        if (user.otp.code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Update user
        user.isVerified = true;
        user.otp.code = undefined;
        user.otp.expiresAt = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otpCode = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = {
            code: otpCode,
            expiresAt: otpExpiry
        };

        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Your New OTP Code',
            message: `Your new OTP is ${otpCode}. It expires in 5 minutes.`,
            otp: otpCode
        });

        res.status(200).json({ message: 'New OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
