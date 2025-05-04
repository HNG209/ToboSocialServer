const {
    getCommentsByPostService,
    getLikesByPostService,
    getFollowersService,
    getFollowingService,
    getStoriesByUserService,
    getCommentsByPostServicev2
} = require('../services/getByTargetService');

module.exports = {
    getCommentsByPost: async (req, res) => {
        const comments = await getCommentsByPostService(req.params.postId, req.query);
        res.status(200).json({ errorCode: 0, result: comments });
    },

    getCommentsByPostv2: async (req, res) => {
        const { userId } = req.body;
        const { postId } = req.params;

        const comments = await getCommentsByPostServicev2(postId, userId, req.query);
        res.status(200).json({ errorCode: 0, result: comments });
    },

    getLikesByPost: async (req, res) => {
        const likes = await getLikesByPostService(req.params.postId, req.query);
        res.status(200).json({ errorCode: 0, result: likes });
    },

    getFollowers: async (req, res) => {
        const followers = await getFollowersService(req.params.id, req.query);
        res.status(200).json({ errorCode: 0, result: followers });
    },

    getFollowing: async (req, res) => {
        const following = await getFollowingService(req.params.id, req.query);
        res.status(200).json({ errorCode: 0, result: following });
    },

    getStoriesByUser: async (req, res) => {
        const stories = await getStoriesByUserService(req.params.id, req.query);
        res.status(200).json({ errorCode: 0, result: stories });
    }
};
