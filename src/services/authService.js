const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Đảm bảo bạn có User model
const TokenModel = require('../models/token'); // Để lưu refresh token
require('dotenv').config();

const registerUser = async ({ username, password }) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('user already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        fullName: username, // Giả sử fullName là username, đăng nhập để thay đổi sau
        password: hashedPassword
    });

    await newUser.save();

    return { message: 'Registration successful' };
};

const loginUser = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Login failed, invalid password');
    }

    const token = await generateTokens(user);

    return { message: 'Login successful', user, ...token };
};

const logoutUser = async (userId) => {
    await TokenModel.findOneAndDelete({ userId });
};

const changePasswordService = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    // const isMatch = oldPassword === user.password;
    if (!isMatch) {
        throw new Error('Old password is incorrect');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return { message: 'Password changed successfully' };
};

const refreshAccessToken = async (refreshToken) => {
    const tokenDoc = await TokenModel.findOne({ refreshToken });
    if (!tokenDoc) throw new Error('Invalid refresh token');

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { id: payload.id, email: payload.email, username: payload.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return { accessToken: newAccessToken };
    } catch (err) {
        throw new Error('Refresh token expired');
    }
};

/**
 * Tạo cả accessToken và refreshToken cho người dùng
 * @param {Object} user - user document từ MongoDB (đã login thành công)
 * @returns { accessToken, refreshToken }
 */
const generateTokens = async (user) => {
    const payload = {
        id: user._id,
        username: user.username,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: '7d'
    });

    // 👉 Lưu refreshToken vào DB
    await TokenModel.findOneAndUpdate(
        { userId: user._id },
        { refreshToken },
        { upsert: true, new: true }
    );

    return { accessToken, refreshToken };
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePasswordService,
};
