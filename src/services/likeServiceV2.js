const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');

module.exports = {
    isPostLikedService: async (userId, postId) => {
        const liked = await Like.exists({ user: userId, post: postId });
        return { status: 200, isLiked: !!liked };
    },

    likePostService: async (userId, postId) => {
        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!post || !user) {
            return { status: 404, error: 'Bài viết hoặc người dùng không tồn tại.' };
        }

        const alreadyLiked = await Like.findOne({ post: postId, user: userId });
        if (alreadyLiked) {
            return { status: 400, error: 'Bạn đã like bài viết này rồi.' };
        }

        await Like.create({ post: postId, user: userId });

        return { status: 200, isLiked: true, message: 'Like bài viết thành công!' };
    },

    unlikePostService: async (userId, postId) => {
        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!post || !user) {
            return { status: 404, error: 'Bài viết hoặc người dùng không tồn tại.' };
        }

        const like = await Like.findOne({ post: postId, user: userId });
        if (!like) {
            return { status: 400, error: 'Bạn chưa like bài viết này.' };
        }

        await Like.deleteOne({ _id: like._id });

        return { status: 200, isLiked: false, message: 'Unlike bài viết thành công!' };
    },

    countPostLikesService: async (postId) => {
        const count = await Like.countDocuments({ post: postId });
        return { status: 200, likes: count };
    },

    getPostLikersService: async (postId) => {
        const likers = await Like.find({ post: postId }).populate('user', 'fullName profile.avatar');
        return { status: 200, users: likers.map(l => l.user) };
    }
};
