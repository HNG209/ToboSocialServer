const {
    createPost,
    getPost,
    updatePostService,
    deletePostService
} = require('../services/postService');

module.exports = {
    postCreatePost: async (req, res) => {
        const rs = await createPost(req.body);
        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    getAllPost: async (req, res) => {
        const rs = await getPost(req.query);
        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    postUpdatePost: async (req, res) => {
        const rs = await updatePostService(req.body);
        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    deletePostAPI: async (req, res) => {
        const id = req.body.id;
        const rs = await deletePostService(id);
        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    }
};
