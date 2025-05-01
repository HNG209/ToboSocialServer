const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Report = require('../models/report');

// === DASHBOARD ===
const getDashboardStats = async (timeFilter = 'all') => {
    const now = new Date();
    let dateFilter = {};

    if (timeFilter === '7days') {
        dateFilter = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
    } else if (timeFilter === 'month') {
        dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    } else if (timeFilter === 'quarter') {
        dateFilter = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
    }

    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

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
        reportVariation: pendingReports - lastMonthStats.pendingReports,
    };

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
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;
    const search = query.search || '';
    const status = query.status || 'all';

    console.log('Raw Query:', query);
    console.log('Parsed Params:', { limit, skip, search, status });

    let actualFilter = {};

    if (status === 'active') {
        actualFilter.role = { $ne: 'banned' };
    } else if (status === 'banned') {
        actualFilter.role = 'banned';
    }

    if (search) {
        actualFilter = {
            ...actualFilter,
            $or: [
                { username: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ]
        };
    }

    console.log('MongoDB Filter:', actualFilter);

    const [users, total] = await Promise.all([
        User.find(actualFilter)
            .skip(skip)
            .limit(limit)
            .select('username email fullName phone profile createdAt postCount followers following role isVerified'),
        User.countDocuments(actualFilter)
    ]);

    console.log('Users found:', users.length, 'Total:', total);

    return { users, total };
};

const getAllUsersForExport = async (search = '', status = 'all') => {
    console.log('Export Params:', { search, status });

    let actualFilter = {};

    if (status === 'active') {
        actualFilter.role = { $ne: 'banned' };
    } else if (status === 'banned') {
        actualFilter.role = 'banned';
    }

    if (search) {
        actualFilter = {
            ...actualFilter,
            $or: [
                { username: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ]
        };
    }

    console.log('Export MongoDB Filter:', actualFilter);

    const users = await User.find(actualFilter)
        .select('username email fullName phone createdAt postCount followers following role');

    console.log('Exported Users:', users.length);

    return users;
};

const lockUser = async (userId) => {
    console.log('Locking user:', userId);
    return User.updateOne({ _id: userId }, { role: 'banned' });
};

const unlockUser = async (userId) => {
    console.log('Unlocking user:', userId);
    return User.updateOne({ _id: userId }, { role: 'user' }); // Giả định role gốc là 'user'
};

const deleteUserAndRelated = async (userId) => {
    console.log('Deleting user:', userId);
    await Comment.deleteMany({ user: userId });
    await Post.deleteMany({ author: userId });
    await User.deleteOne({ _id: userId });
};

const banMultipleUsers = async (userIds) => {
    console.log('Banning multiple users:', userIds);
    return User.updateMany({ _id: { $in: userIds } }, { role: 'banned' });
};

const deleteMultipleUsers = async (userIds) => {
    console.log('Deleting multiple users:', userIds);
    await Comment.deleteMany({ user: { $in: userIds } });
    await Post.deleteMany({ author: { $in: userIds } });
    return User.deleteMany({ _id: { $in: userIds } });
};

// === POST MANAGEMENT ===
const getAllPosts = async (query) => {
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;
    const username = query.username || '';

    console.log('Raw Query:', query);
    console.log('Parsed Params:', { limit, skip, username });

    let actualFilter = {};

    if (username) {
        const users = await User.find({
            username: new RegExp(username, 'i')
        }).select('_id');

        if (users.length === 0) {
            return { errorCode: 0, result: { posts: [], total: 0 } };
        }

        actualFilter.author = { $in: users.map(u => u._id) };
    }

    console.log('MongoDB Filter:', actualFilter);

    const [posts, total] = await Promise.all([
        Post.find(actualFilter)
            .populate('author')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Post.countDocuments(actualFilter)
    ]);

    console.log('Posts found:', posts.length, 'Total:', total);

    return {
        errorCode: 0,
        result: { posts, total }
    };
};

const deletePost = async (postId) => {
    console.log('Deleting post:', postId);
    return Post.deleteOne({ _id: postId });
};

// === COMMENT MANAGEMENT ===
const getComments = async (query) => {
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;

    console.log('Raw Query:', query);
    console.log('Parsed Params:', { limit, skip });

    const comments = await Comment.find({})
        .populate('user post')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    console.log('Comments found:', comments.length);

    return comments;
};

const deleteComment = async (commentId) => {
    console.log('Deleting comment:', commentId);
    return Comment.deleteOne({ _id: commentId });
};

// === REPORT MANAGEMENT ===
const getReports = async (query) => {
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;

    console.log('Raw Query:', query);
    console.log('Parsed Params:', { limit, skip });

    const reports = await Report.find({})
        .populate('reporter post')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    console.log('Reports found:', reports.length);

    return reports;
};

const markReportReviewed = async (reportId) => {
    console.log('Marking report reviewed:', reportId);
    return Report.updateOne({ _id: reportId }, { status: 'reviewed' });
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllUsersForExport,
    lockUser,
    unlockUser, // Thêm hàm mới
    deleteUserAndRelated,
    banMultipleUsers,
    deleteMultipleUsers,
    getAllPosts,
    deletePost,
    getComments,
    deleteComment,
    getReports,
    markReportReviewed
};