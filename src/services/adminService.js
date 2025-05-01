const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Report = require('../models/report');
const aqp = require('api-query-params');

// === DASHBOARD ===
const getDashboardStats = async () => {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const postStats = await Post.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const mostReportedPosts = await Report.aggregate([
        { $group: { _id: "$post", totalReports: { $sum: 1 } } },
        { $sort: { totalReports: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: '_id',
                as: 'post'
            }
        },
        { $unwind: "$post" }
    ]);

    return { userCount, postCount, commentCount, pendingReports, postStats, mostReportedPosts };
};

// === USER MANAGEMENT ===
const getAllUsers = async (query) => {
    const { filter, limit = 10, skip = 0 } = aqp(query);
    const users = await User.find(filter)
        .skip(skip)
        .limit(limit)
        .select('username email fullName profile.avatar followers following');
    return users;
};

const lockUser = async (userId) => {
    return User.updateOne({ _id: userId }, { role: 'banned' });
};

const deleteUserAndRelated = async (userId) => {
    await Comment.deleteMany({ user: userId });
    await Post.deleteMany({ author: userId });
    await User.deleteOne({ _id: userId });
};

// === POST MANAGEMENT ===
const getAllPosts = async (query) => {
    const { filter, limit = 10, skip = 0 } = aqp(query);
    const actualFilter = { ...filter };
    console.log("Received filter from query:", filter);
    console.log("Final filter used:", actualFilter);

    if (actualFilter.username) {
        const users = await User.find({
            username: new RegExp(actualFilter.username, 'i')
        }).select('_id');

        if (users.length === 0) {
            return { errorCode: 0, result: { posts: [], total: 0 } };
        }

        actualFilter.author = { $in: users.map(u => u._id) };
        delete actualFilter.username;
    }

    const [posts, total] = await Promise.all([
        Post.find(actualFilter)
            .populate('author')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Post.countDocuments(actualFilter)
    ]);

    return {
        errorCode: 0,
        result: { posts, total }
    };
};

const deletePost = async (postId) => {
    return Post.deleteOne({ _id: postId });
};

// === COMMENT MANAGEMENT ===
const getComments = async (query) => {
    const { filter, limit = 10, skip = 0 } = aqp(query);
    const comments = await Comment.find(filter)
        .populate('user post')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    return comments;
};

const deleteComment = async (commentId) => {
    return Comment.deleteOne({ _id: commentId });
};

// === REPORT MANAGEMENT ===
const getReports = async (query) => {
    const { filter, limit = 10, skip = 0 } = aqp(query);
    const reports = await Report.find(filter)
        .populate('reporter post')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    return reports;
};

const markReportReviewed = async (reportId) => {
    return Report.updateOne({ _id: reportId }, { status: 'reviewed' });
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    lockUser,
    deleteUserAndRelated,
    getAllPosts,
    deletePost,
    getComments,
    deleteComment,
    getReports,
    markReportReviewed
};
