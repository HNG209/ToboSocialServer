const {
    followUserService,
    unfollowUserService
} = require('../services/followService');

// Theo dõi người dùng
const followUser = async (req, res) => {
    const targetId = req.params.id;
    const { userId } = req.body;

    const result = await followUserService(userId, targetId);
    return res.status(result.status).json(result.error ? { error: result.error } : { message: result.message });
};

// Bỏ theo dõi người dùng
const unfollowUser = async (req, res) => {
    const targetId = req.params.id;
    const { userId } = req.body;

    const result = await unfollowUserService(userId, targetId);
    return res.status(result.status).json(result.error ? { error: result.error } : { message: result.message });
};

module.exports = { followUser, unfollowUser };
