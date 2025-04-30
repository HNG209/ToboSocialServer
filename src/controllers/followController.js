const { followUserService, unfollowUserService } = require("../services/followService");

// userController.js
const followUser = async (req, res) => {
    const targetId = req.params.id;
    const { userId } = req.body;

    const result = await followUserService(userId, targetId);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json({
        errorCode: 0,
        result: {
            message: result.result.message,
            user: result.result.user,
            targetUser: result.result.targetUser
        }
    });
};

const unfollowUser = async (req, res) => {
    const targetId = req.params.id;
    const { userId } = req.body;

    const result = await unfollowUserService(userId, targetId);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json({
        errorCode: 0,
        result: {
            message: result.result.message,
            user: result.result.user,
            targetUser: result.result.targetUser
        }
    });
};

module.exports = { followUser, unfollowUser }