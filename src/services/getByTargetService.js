const aqp = require('api-query-params');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Story = require('../models/story');

module.exports = {
    getCommentsByPostService: async (postId, query) => {
        const page = parseInt(query.page) || 1;
        const { limit = 10, population } = aqp(query);
        const offset = (page - 1) * limit;

        const comments = await Comment.find({ post: postId })
            .populate(population || 'user')
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 });

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
