const likeService = require('../services/likeServiceV2');

module.exports = {
    likePost: async (req, res) => {
        try {
            const { postId } = req.params;
            const { userId } = req.body;

            const result = await likeService.likePostService(userId, postId);
            return res.status(result.status).json({
                errorCode: 0,
                result
            });
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi server.' });
        }
    },

    unlikePost: async (req, res) => {
        try {
            const { postId } = req.params;
            const { userId } = req.body;

            console.log('unlike post', postId, userId)
            const result = await likeService.unlikePostService(userId, postId);
            return res.status(result.status).json({
                errorCode: 0,
                result
            });
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi server.' });
        }
    },

    isPostLiked: async (req, res) => {
        try {
            const { postId } = req.params;
            const { userId } = req.body;

            console.log(req.body)

            const rs = await likeService.isPostLikedService(userId, postId);
            return res.status(rs.status).json({
                errorCode: 0,
                result: rs
            });
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi server.' });
        }
    },

    countPostLikes: async (req, res) => {
        try {
            const { postId } = req.params;
            const result = await likeService.countPostLikesService(postId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi server.' });
        }
    },

    getPostLikers: async (req, res) => {
        try {
            const { postId } = req.params;
            const rs = await likeService.getPostLikersService(postId);
            res.status(200).json({
                errorCode: 0,
                result: rs
            });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server.' });
        }
    }
};
