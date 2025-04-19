const {
    likePostService,
    unlikePostService
} = require('../services/likeService');

const likePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    const result = await likePostService(userId, postId);
    return res.status(result.status).json(result.error ? { error: result.error } : { message: result.message });
};

const unlikePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    const result = await unlikePostService(userId, postId);
    return res.status(result.status).json(result.error ? { error: result.error } : { message: result.message });
};

module.exports = { likePost, unlikePost };
