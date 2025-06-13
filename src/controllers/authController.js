const bcrypt = require('bcrypt');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const { registerUser, loginUser, logoutUser, refreshAccessToken, changePasswordService } = require('../services/authService');
const User = require('../models/user');

// Đăng ký
// deprecated: Sử dụng registerv2 thay thế
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
// deprecated: Sử dụng loginv2 thay thế
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
        const { username, password } = req.body;
        const { accessToken, refreshToken, user } = await loginUser({ username, password });

        // Set refreshToken vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,             // Bật khi dùng HTTPS
            sameSite: 'Strict',       // Hoặc 'Lax' nếu FE/BE khác domain
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        // Trả về accessToken và user
        res.status(200).json({
            errorCode: 0,
            message: 'Login successful',
            result: {
                accessToken,
                user
            }
        });
    } catch (error) {
        res.status(400).json({ errorCode: 1, message: error.message });
    }
};

const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        const result = await changePasswordService(userId, oldPassword, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400).json({ errorCode: 1, message: error.message });
    }
}

const logout = async (req, res) => {
    try {
        const { userId } = req.body;
        await logoutUser(userId);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ errorCode: 1, message: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ errorCode: 1, message: 'Missing refresh token' });

        const newToken = await refreshAccessToken(refreshToken);
        res.json(newToken);
    } catch (error) {
        res.status(403).json({ errorCode: 1, message: error.message });
    }
};


module.exports = { register, login, registerv2, loginv2, logout, refresh, changePassword };
