const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Report = require('../models/report');
const mongoose = require('mongoose');
const Notification = require('../models/notification');

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
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getAllPosts = async (query) => {
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;
    const username = query.filter?.username || ''; // Lấy username từ query.filter
    const deleted = query.filter?.deleted;
    const reported = query.filter?.reported;
    const startDate = query.filter?.dateRange?.startDate;
    const endDate = query.filter?.dateRange?.endDate;

    console.log('Raw Query:', query);
    console.log('Parsed Params:', { limit, skip, username, deleted, reported, startDate, endDate });

    let actualFilter = {};

    if (username) {
        const escapedUsername = escapeRegExp(username);
        const users = await User.find({
            username: new RegExp(escapedUsername, 'i')
        }).select('_id');

        if (users.length > 0) {
            actualFilter.author = { $in: users.map(u => u._id) };
        }
    }

    if (startDate || endDate) {
        actualFilter.createdAt = {};
        if (startDate) actualFilter.createdAt.$gte = new Date(startDate);
        if (endDate) actualFilter.createdAt.$lte = new Date(endDate);
    }

    if (deleted === 'true') {
        actualFilter.deleted = true;
    } else if (deleted === 'false') {
        actualFilter.deleted = false;
    }

    let postQuery;
    let countQuery;

    if (reported === 'true') {
        const reportedPosts = await Report.find({ status: 'pending' }).distinct('post');
        if (reportedPosts.length === 0) {
            return { errorCode: 0, result: { posts: [], total: 0 } };
        }
        actualFilter._id = { $in: reportedPosts };
        postQuery = Post.find(actualFilter);
        countQuery = Post.countDocuments(actualFilter);
    } else {
        postQuery = (deleted === 'true' || deleted === undefined)
            ? Post.findWithDeleted(actualFilter)
            : Post.find(actualFilter);
        countQuery = (deleted === 'true' || deleted === undefined)
            ? Post.countDocumentsWithDeleted(actualFilter)
            : Post.countDocuments(actualFilter);
    }

    console.log('MongoDB Filter:', actualFilter);

    const [posts, total] = await Promise.all([
        postQuery
            .populate('author')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        countQuery
    ]);

    console.log('Posts found:', posts.length, 'Total:', total);

    return {
        errorCode: 0,
        result: { posts, total }
    };
};

const deletePost = async (postId) => {
    console.log('Deleting post:', postId);
    try {
        // Xóa bài viết (soft delete)
        await Post.deleteById({ _id: postId });

        // Cập nhật trạng thái các báo cáo liên quan
        const updatedReports = await Report.updateMany(
            { post: postId, status: 'pending' },
            { status: 'reviewed' }
        );
        console.log(`Updated ${updatedReports.nModified} reports for post ${postId} to reviewed`);
    } catch (error) {
        console.error('Error deleting post or updating reports:', error);
        throw error;
    }
};

const restorePost = async (postId) => {
    console.log('Restoring post with ID:', postId, 'Type:', typeof postId);
    try {
        // Chuẩn hóa postId
        const id = postId.toString().trim();
        if (!mongoose.isValidObjectId(id)) {
            throw new Error('ID bài viết không hợp lệ');
        }

        // Tìm bài viết với findOneWithDeleted, không populate
        const post = await Post.findOneWithDeleted({ _id: id }).lean();
        if (!post) {
            throw new Error('Bài viết không tồn tại');
        }
        if (!post.deleted) {
            throw new Error('Bài viết chưa bị xóa, không cần khôi phục');
        }

        // Khôi phục bài viết
        await Post.restore({ _id: id });
        console.log('Post restored:', id);
        return { success: true, message: 'Khôi phục bài viết thành công' };
    } catch (error) {
        console.error('Error restoring post:', error.message, error.stack);
        throw error;
    }
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
    const filter = query.filter || {};

    const status = filter.status || 'all';
    const reporterUsername = filter.reporter?.username || '';
    const postCaption = filter.post?.caption || '';
    const reason = filter.reason || '';

    console.log('Raw Query:', query);
    console.log('Parsed Params:', { limit, skip, status, reporterUsername, postCaption, reason });

    let actualFilter = {};

    if (status !== 'all') {
        actualFilter.status = status;
    }

    if (reporterUsername) {
        const users = await User.find({
            username: new RegExp(reporterUsername, 'i')
        }).select('_id');
        if (users.length > 0) {
            actualFilter.reporter = { $in: users.map(u => u._id) };
        } else {
            return { reports: [], total: 0 };
        }
    }

    if (postCaption) {
        const posts = await Post.find({
            caption: new RegExp(postCaption, 'i')
        }).select('_id');
        if (posts.length > 0) {
            actualFilter.post = { $in: posts.map(p => p._id) };
        } else {
            return { reports: [], total: 0 };
        }
    }

    if (reason) {
        actualFilter.reason = new RegExp(reason, 'i');
    }

    console.log('MongoDB Filter:', actualFilter);

    const [reports, total] = await Promise.all([
        Report.find(actualFilter)
            .populate({
                path: 'reporter',
                select: 'username profile.avatar'
            })
            .populate({
                path: 'post',
                select: 'caption mediaFiles author',
                populate: { path: 'author', select: 'username' }
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Report.countDocuments(actualFilter)
    ]);

    console.log('Reports found:', reports.length, 'Total:', total);
    return { reports, total };
};
const getPostReportCount = async (postId) => {
    const count = await Report.countDocuments({ post: postId });
    return count;
};

const markReportReviewed = async (reportId) => {
    console.log('Marking report reviewed:', reportId);
    return Report.updateOne({ _id: reportId }, { status: 'reviewed' });
};

const createWarningNotification = async (recipientId, message, relatedEntityId = null, relatedEntityModel = null) => {
    console.log('Creating warning notification for user:', recipientId);
    const notification = new Notification({
        recipient: recipientId,
        sender: null, // Có thể thêm admin ID nếu có hệ thống xác thực admin
        type: 'warning',
        title: 'Cảnh báo từ quản trị viên',
        message,
        relatedEntity: relatedEntityId,
        relatedEntityModel,
    });
    return notification.save();
};

const warnUser = async (userId, warningMessage, relatedPostId = null) => {
    console.log('Warning user:', userId);
    // Tạo thông báo cảnh báo
    await createWarningNotification(userId, warningMessage, relatedPostId, 'post');
    // Có thể thêm logic khác như ghi log hoặc gửi email nếu cần
};

// Lấy danh sách thông báo của người dùng
const getUserNotifications = async (userId, query) => {
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;

    console.log('Fetching notifications for user:', userId, 'Params:', { limit, skip });

    const [notifications, total] = await Promise.all([
        Notification.find({ recipient: userId })
            .populate({
                path: 'relatedEntity',
                select: 'caption mediaFiles',
                match: { relatedEntityModel: 'post' },
                populate: { path: 'author', select: 'username' }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Notification.countDocuments({ recipient: userId })
    ]);

    console.log('Notifications found:', notifications.length, 'Total:', total);
    return { notifications, total };
};
// Đánh dấu một thông báo là đã xem
const markNotificationAsRead = async (notificationId) => {
    console.log('Marking notification as read:', notificationId);
    return Notification.updateOne({ _id: notificationId }, { isRead: true });
};

// Đánh dấu tất cả thông báo của người dùng là đã xem
const markAllNotificationsAsRead = async (userId) => {
    console.log('Marking all notifications as read for user:', userId);
    return Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
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
    restorePost,
    getComments,
    deleteComment,
    getReports,
    getPostReportCount,
    markReportReviewed,
    warnUser,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};