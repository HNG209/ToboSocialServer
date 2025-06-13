const { getUserPostsService, getUserPostsServicev2 } = require('../services/profileService');

const getUserPosts = async (req, res) => {
    const userId = req.user.id; // Lấy từ accessToken
    const authorId = req.id;
    const posts = await getUserPostsServicev2(authorId, userId, req.query);

    res.status(200).json({
        errorCode: 0,
        result: posts
    });
};

const getProfilePost = async (req, res) => {
    const userId = req.user.id; // Lấy từ accessToken
    const posts = await getUserPostsServicev2(userId, userId, req.query);

    res.status(200).json({
        errorCode: 0,
        result: posts
    });
};

module.exports = { getUserPosts, getProfilePost };
