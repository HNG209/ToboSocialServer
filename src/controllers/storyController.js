const {
    createStoryService,
    getStoryService,
    deleteStoryService
} = require('../services/storyService');

module.exports = {
    postCreateStory: async (req, res) => {
        const rs = await createStoryService(req.body);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    getAllStories: async (req, res) => {
        const userId = req.query.userId;
        const rs = await getStoryService(userId);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    deleteStoryAPI: async (req, res) => {
        const rs = await deleteStoryService(req.body.id);
        res.status(200).json({ errorCode: 0, result: rs });
    }
};
