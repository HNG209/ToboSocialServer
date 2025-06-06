const Like = require('../models/likev2');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const { on } = require('nodemailer/lib/xoauth2');

module.exports = {
    likeService: async (userId, targetId, onModel) => {
        if (!['post', 'comment'].includes(onModel)) {
            return { status: 400, error: 'Loại đối tượng không hợp lệ.' };
        }

        const targetModel = onModel === 'post' ? Post : Comment;
        const [target, user] = await Promise.all([
            targetModel.findById(targetId),
            User.findById(userId)
        ]);

        if (!target || !user) {
            return { status: 404, error: `${onModel} hoặc người dùng không tồn tại.` };
        }

        const alreadyLiked = await Like.findOne({ user: userId, target: targetId, onModel });
        if (alreadyLiked) {
            return { status: 400, error: 'Bạn đã like rồi.' };
        }

        // tăng số lượng like cho bài viết hoặc bình luận
        if (onModel === 'post') {
            await Post.findByIdAndUpdate(targetId, { $inc: { likeCount: 1 } });
        } else if (onModel === 'comment') {
            await Comment.findByIdAndUpdate(targetId, { $inc: { likeCount: 1 } });
        }

        await Like.create({ user: userId, target: targetId, onModel });

        return { targetId, onModel, status: 200, isLiked: true, message: 'Like thành công!' };
    },

    unlikeService: async (userId, targetId, onModel) => {
        if (!['post', 'comment'].includes(onModel)) {
            return { status: 400, error: 'Loại đối tượng không hợp lệ.' };
        }

        const like = await Like.findOne({ user: userId, target: targetId, onModel });
        if (!like) {
            return { status: 400, error: 'Bạn chưa like đối tượng này.' };
        }

        // giảm số lượng like cho bài viết hoặc bình luận
        if (onModel === 'post') {
            await Post.findByIdAndUpdate(targetId, { $inc: { likeCount: -1 } });
        } else if (onModel === 'comment') {
            await Comment.findByIdAndUpdate(targetId, { $inc: { likeCount: -1 } });
        }

        await Like.deleteOne({ _id: like._id });

        return { targetId, onModel, status: 200, isLiked: false, message: 'Unlike thành công!' };
    },

    isLikedService: async (userId, targetId, onModel) => {
        const liked = await Like.exists({ user: userId, target: targetId, onModel });

        // nếu là bình luận
        if (onModel === 'comment') {
            // kiểm tra xem bình luận có rootComment không
            const comment = await Comment.findById(targetId);
            if (comment && comment.rootComment) {
                //trả về trạng thái đã like và id của bình luận gốc
                return { status: 200, isLiked: !!liked, rootCommentId: comment.rootComment };
            }
        }

        return { status: 200, isLiked: !!liked };
    },

    countLikesService: async (targetId, onModel) => {
        const count = await Like.countDocuments({ target: targetId, onModel });
        return { status: 200, likes: count };
    },

    getLikersService: async (targetId, onModel) => {
        const likers = await Like.find({ target: targetId, onModel }).populate('user', 'fullName profile.avatar');
        return { status: 200, users: likers.map(l => l.user) };
    }
};
