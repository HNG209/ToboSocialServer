const Post = require('../models/post');
const User = require('../models/user');
const {
    createPost,
    getPost,
    updatePostService,
    deletePostService,
    unlikePostService,
    likePostService,
    getPostDetailService,
    getAuthorByPostIdService
} = require('../services/postService');

module.exports = {
    // postCreatePost: async (req, res) => {
    //     const rs = await createPost(req.body);
    //     res.status(200).json({
    //         errorCode: 0,
    //         result: rs
    //     });
    // },

    postCreatePost: async (req, res) => {
        try {
            const { caption, mediaFiles, author } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!author) {
                return res.status(400).json({ errorCode: 1, message: 'Author is required' });
            }

            // Tạo bài viết
            const post = new Post({
                author,
                caption,
                mediaFiles: mediaFiles || [],
                likes: [],
                comments: [],
            });

            // Lưu bài viết
            await post.save();

            // Tăng postCount của người dùng
            await User.findByIdAndUpdate(author, { $inc: { postCount: 1 } });

            return res.status(201).json({ errorCode: 0, result: post });
        } catch (error) {
            return res.status(500).json({ errorCode: 1, message: error.message || 'Failed to create post' });
        }
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
    },

    likePost: async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const rs = await likePostService(id, userId);
            res.status(200).json({
                errorCode: 0,
                message: 'Thích bài viết thành công',
                likes: rs.likes,
            });
        } catch (error) {
            res.status(400).json({ errorCode: 1, message: error.message });
        }
    },

    unlikePost: async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const rs = await unlikePostService(id, userId);
            res.status(200).json({
                errorCode: 0,
                message: 'Unliked successfully',
                likes: rs.likes
            });
        } catch (error) {
            res.status(400).json({ errorCode: 1, message: error.message });
        }
    },

    getPostDetailAPI: async (req, res) => {
        try {
            const { id } = req.params; // lấy id từ URL params
            const post = await getPostDetailService(id); // gọi service đã viết
            res.status(200).json({
                errorCode: 0,
                result: post
            });
        } catch (error) {
            console.error(error);
            res.status(404).json({
                errorCode: 1,
                message: error.message || 'Post not found'
            });
        }
    },

    getUserPostsAPI: async (req, res) => {
        const { id } = req.params; // lấy id từ URL params
        const rs = await getPost({ filter: { author: id } }); // gọi service đã viết
        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    getPostAuthor: async (req, res) => {
        const { postId } = req.params;
        console.log(postId)
        const rs = await getAuthorByPostIdService(postId)

        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    }
};
