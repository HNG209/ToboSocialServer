const aqp = require('api-query-params');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Story = require('../models/story');
const Like = require('../models/likev2');

module.exports = {
    getCommentsByPostService: async (postId, query) => {
        const page = parseInt(query.page) || 1;
        const { limit = 10 } = aqp(query); // loại bỏ population nếu không cần linh hoạt
        const offset = (page - 1) * limit;

        const comments = await Comment.find({ post: postId })
            .populate({
                path: 'user',
                select: 'username profile.avatar' // chỉ lấy hai trường cụ thể
            })
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 });
        return comments;
    },

    getCommentsByPostServicev2: async (postId, userId, query) => { // trả về comment và trạng thái đã like đối với người dùng hiện tại
        const page = parseInt(query.page) || 1;
        const { limit = 10 } = aqp(query);
        const offset = (page - 1) * limit;

        // replyTo là trường để xác định bình luận trả lời, nếu là null thì là bình luận gốc
        const comments = await Comment.find({ post: postId, replyTo: null })
            .populate({
                path: 'user',
                select: 'username profile.avatar'
            })
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 });

        // lọc các comment mà người dùng không còn tồn tại
        const validComments = comments.filter(comment => comment.user && comment.user._id);
        // xoá các comment trong database mà người dùng không còn tồn tại
        await Comment.deleteMany({ _id: { $in: comments.map(c => c._id) }, user: null });

        // thêm trường replyTo (mặc định là null) vào các comment chưa có trường này, lưu xuống database
        const commentsToUpdate = validComments.filter(comment => !comment.replyTo);
        if (commentsToUpdate.length > 0) {
            await Comment.updateMany(
                { _id: { $in: commentsToUpdate.map(c => c._id) } },
                { $set: { replyTo: null } }
            );
        }

        if (userId) {
            const commentIds = validComments.map(c => c._id);
            const likedComments = await Like.find({
                user: userId,
                target: { $in: commentIds },
                onModel: 'comment'
            }).select('target');

            const likedSet = new Set(likedComments.map(like => like.target.toString()));

            // Gắn thêm trường isLiked vào từng comment
            validComments.forEach(comment => {
                comment._doc.isLiked = likedSet.has(comment._id.toString());
            });
        }

        return validComments;
    },

    getRepliedCommentsService: async (commentId, userId, query) => {
        const page = parseInt(query.page) || 1;
        const { limit = 10 } = aqp(query);
        const offset = (page - 1) * limit;

        const comments = await Comment.find({ rootComment: commentId })
            .populate({
                path: 'user',
                select: 'username profile.avatar'
            })
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (userId) {
            const commentIds = comments.map(c => c._id);
            const likedComments = await Like.find({
                user: userId,
                target: { $in: commentIds },
                onModel: 'comment'
            }).select('target');

            const likedSet = new Set(likedComments.map(like => like.target.toString()));

            // Gắn thêm trường isLiked vào từng comment
            comments.forEach(comment => {
                comment._doc.isLiked = likedSet.has(comment._id.toString());
            });
        }

        return comments;
    },

    getLikesByPostService: async (postId, query) => {
        const page = parseInt(query.page) || 1;
        const { limit = 10 } = aqp(query);
        const offset = (page - 1) * limit;

        const post = await Post.findById(postId).populate({
            path: 'likes',
            select: 'username profile.avatar',
            options: { skip: offset, limit: limit }
        });

        return post?.likes || [];
    },

    getFollowersService: async (userId, query) => {
        const page = parseInt(query.page) || 1;
        const { limit = 10 } = aqp(query);
        const offset = (page - 1) * limit;

        const user = await User.findById(userId).populate({
            path: 'followers',
            select: 'username profile.avatar',
            options: { skip: offset, limit: limit }
        });

        return user?.followers || [];
    },

    getFollowingService: async (userId, query) => {
        const page = parseInt(query.page) || 1;
        const { limit = 10 } = aqp(query);
        const offset = (page - 1) * limit;

        const user = await User.findById(userId).populate({
            path: 'following',
            select: 'username profile.avatar',
            options: { skip: offset, limit: limit }
        });

        return user?.following || [];
    },

    getStoriesByUserService: async (userId, query) => {
        const now = new Date();
        const page = parseInt(query.page) || 1;
        const { limit = 10 } = aqp(query);
        const offset = (page - 1) * limit;

        const stories = await Story.find({
            user: userId,
            expiresAt: { $gt: now }
        })
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 });

        return stories;
    }
};
