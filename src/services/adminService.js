const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Report = require('../models/report');
const aqp = require('api-query-params');

// === DASHBOARD ===
const getDashboardStats = async (timeFilter = 'all') => {
    const now = new Date();
    let dateFilter = {};

    // Xử lý bộ lọc thời gian
    if (timeFilter === '7days') {
        dateFilter = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
    } else if (timeFilter === 'month') {
        dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    } else if (timeFilter === 'quarter') {
        dateFilter = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
    }

    // Tổng số liệu hiện tại
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Tính biến động (so với tháng trước)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthStats = {
        userCount: await User.countDocuments({ createdAt: { $lte: lastMonthEnd } }),
        postCount: await Post.countDocuments({ createdAt: { $lte: lastMonthEnd } }),
        commentCount: await Comment.countDocuments({ createdAt: { $lte: lastMonthEnd } }),
        pendingReports: await Report.countDocuments({ status: 'pending', createdAt: { $lte: lastMonthEnd } }),
    };

    const variations = {
        userVariation: userCount > 0 ? ((userCount - lastMonthStats.userCount) / lastMonthStats.userCount * 100).toFixed(1) : 0,
        postVariation: postCount > 0 ? ((postCount - lastMonthStats.postCount) / lastMonthStats.postCount * 100).toFixed(1) : 0,
        commentVariation: commentCount > 0 ? ((commentCount - lastMonthStats.commentCount) / lastMonthStats.commentCount * 100).toFixed(1) : 0,
        reportVariation: pendingReports - lastMonthStats.pendingReports, // Số tuyệt đối cho báo cáo
    };

    // Biểu đồ bài viết theo thời gian
    const postStats = await Post.aggregate([
        { $match: dateFilter.createdAt ? { createdAt: dateFilter } : {} },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Danh sách bài viết bị báo cáo nhiều nhất
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
        { $unwind: "$post" },
        {
            $lookup: {
                from: 'users',
                localField: 'post.author',
                foreignField: '_id',
                as: 'post.author'
            }
        },
        { $unwind: "$post.author" }
    ]);

    return {
        userCount,
        postCount,
        commentCount,
        pendingReports,
        variations,
        postStats,
        mostReportedPosts
    };
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
