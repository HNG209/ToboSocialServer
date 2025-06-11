const likeService = require('../services/likeServicev3');

module.exports = {
    like: async (req, res) => {
        const { targetId } = req.params;
        const { onModel, userId } = req.body;

        const result = await likeService.likeService(userId, targetId, onModel);
        return res.status(result.status).json({
            errorCode: 0,
            result
        });
    },

    unlike: async (req, res) => {
        const { targetId } = req.params;
        const { onModel, userId } = req.body;

        const result = await likeService.unlikeService(userId, targetId, onModel);
        return res.status(result.status).json({
            errorCode: 0,
            result
        });
    },

    isLiked: async (req, res) => {
        const { onModel, targetId } = req.params;

        const userId = req.user.id; // Lấy từ accessToken

        const result = await likeService.isLikedService(userId, targetId, onModel);
        return res.status(result.status).json({
            errorCode: 0,
            result
        });
    },

    countLikes: async (req, res) => {
        const { targetId } = req.params;
        const { onModel } = req.body;

        const result = await likeService.countLikesService(targetId, onModel);
        return res.status(result.status).json({
            errorCode: 0,
            result
        });
    },

    getLikers: async (req, res) => {
        const { targetId } = req.params;
        const { onModel } = req.body;

        const result = await likeService.getLikersService(targetId, onModel);
        return res.status(result.status).json({
            errorCode: 0,
            result
        });
    }
};
