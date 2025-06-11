const Comment = require('../models/comment');
const aqp = require('api-query-params');
const Notification = require('../models/notification');
const Post = require('../models/post');

module.exports = {
    createCommentService: async (data) => {
        // Tạo và lưu bình luận mới
        const newComment = await new Comment(data).save();

        // Populate thông tin người dùng cho phản hồi
        const populatedComment = await newComment.populate({
            path: 'user',
            select: 'username profile.avatar'
        });

        //kiểm tra xem bình luận có root hay không
        if (data.rootComment) {
            // Tăng countReply của bình luận gốc nếu có rootComment
            await Comment.findByIdAndUpdate(data.rootComment, { $inc: { countReply: 1 } });
        }

        // Lấy thông tin bài viết và chủ bài viết
        const post = await Post.findById(newComment.post).populate('author');

        // Tạo thông báo nếu người bình luận không phải chủ bài viết
        if (post && post.author && post.author._id.toString() !== data.user.toString()) {
            await Notification.create({
                recipient: post.author._id, // Chủ bài viết
                sender: data.user, // Người bình luận
                type: 'comment',
                title: 'Bình luận mới trên bài viết của bạn',
                message: `${populatedComment.user.username} đã bình luận trên bài viết của bạn.`,
                relatedEntity: newComment._id, // ID của bình luận
                relatedEntityModel: 'comment',
                isRead: false
            });
        }

        return populatedComment;
    },

    getCommentService: async (queryString) => {
        const page = queryString.page || 1;
        const { filter, limit = 10, population } = aqp(queryString);
        delete filter.page;

        const offset = (page - 1) * limit;
        const rs = await Comment.find(filter)
            .populate(population || [
                { path: 'user', select: 'username' },
                { path: 'post' },
                { path: 'likes', select: '_id' }, // Populate mảng likes
            ])
            .skip(offset)
            .limit(limit)
            .exec();
        return rs;
    },

    updateCommentService: async (data) => {
        const rs = await Comment.updateOne({ _id: data.id }, { ...data });
        return rs;
    },

    deleteCommentService: async (id) => {
        const rs = await Comment.deleteById(id);
        return rs;
    },

    likeCommentService: async (commentId, userId) => {
        const rs = await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { likes: userId } },
            { new: true }
        ).populate('likes', '_id'); // Populate likes trong response
        return rs;
    },

    unlikeCommentService: async (commentId, userId) => {
        const rs = await Comment.findByIdAndUpdate(
            commentId,
            { $pull: { likes: userId } },
            { new: true }
        ).populate('likes', '_id'); // Populate likes trong response
        return rs;
    },
};