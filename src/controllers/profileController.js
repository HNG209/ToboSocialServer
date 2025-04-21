const { getUserPostsService } = require('../services/profileService');

const getUserPosts = async (req, res) => {
    const userId = req.params.id;
    const posts = await getUserPostsService(userId, req.query);

    res.status(200).json({
        errorCode: 0,
        result: posts
    });
};

module.exports = { getUserPosts };
