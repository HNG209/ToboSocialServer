const bcrypt = require('bcrypt');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const { registerUser, loginUser, logoutUser, refreshAccessToken } = require('../services/authService');
const User = require('../models/user');

// Đăng ký
const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Email hoặc username đã được sử dụng.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({
            errorCode: 0,
            message: 'Đăng ký thành công!',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi đăng ký.' });
    }
};

// Đăng nhập
const login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Email không đúng.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Mật khẩu không đúng.' });

        res.status(200).json({
            errorCode: 0,
            message: "Đăng nhập thành công!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi đăng nhập.' });
    }
};

const registerv2 = async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loginv2 = async (req, res) => {
    try {
        const result = await loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { userId } = req.body;
        await logoutUser(userId);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });

        const newToken = await refreshAccessToken(refreshToken);
        res.json(newToken);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};


module.exports = { register, login, registerv2, loginv2, logout, refresh };
