const {
    getCurrentUserService,
    updateUserProfileService,
    updateUserPasswordService
} = require('../services/adminUserService');

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        const user = await getCurrentUserService(userId);
        res.status(200).json({ errorCode: 0, result: user });
    } catch (err) {
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await updateUserProfileService(req.body);
        res.status(200).json({ errorCode: 0, result: updatedUser });
    } catch (err) {
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        await updateUserPasswordService(req.body);
        res.status(200).json({ errorCode: 0, message: 'Password updated successfully' });
    } catch (err) {
        res.status(400).json({ errorCode: 1, message: err.message });
    }
};

module.exports = {
    getCurrentUser,
    updateUserProfile,
    updateUserPassword
};
