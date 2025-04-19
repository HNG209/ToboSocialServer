const {
    createCommentService,
    getCommentService,
    updateCommentService,
    deleteCommentService
} = require('../services/commentService');

module.exports = {
    postCreateComment: async (req, res) => {
        const rs = await createCommentService(req.body);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    getAllComments: async (req, res) => {
        const rs = await getCommentService(req.query);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    postUpdateComment: async (req, res) => {
        const rs = await updateCommentService(req.body);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    deleteCommentAPI: async (req, res) => {
        const rs = await deleteCommentService(req.body.id);
        res.status(200).json({ errorCode: 0, result: rs });
    }
};
