const Post = require('../models/post');
const User = require('../models/user');

module.exports = {
    likePostService: async (userId, postId) => {
        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!post || !user) {
            return { status: 404, error: "Bài viết hoặc người dùng không tồn tại." };
        }

        if (post.likes.includes(userId)) {
            return { status: 400, error: "Bạn đã like bài viết này rồi." };
        }

        await post.updateOne({ $push: { likes: userId } });
        return { status: 200, message: "Like bài viết thành công!" };
    },

    unlikePostService: async (userId, postId) => {
        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!post || !user) {
            return { status: 404, error: "Bài viết hoặc người dùng không tồn tại." };
        }

        if (!post.likes.includes(userId)) {
            return { status: 400, error: "Bạn chưa like bài viết này." };
        }

        await post.updateOne({ $pull: { likes: userId } });
        return { status: 200, message: "Unlike bài viết thành công!" };
    }
};
