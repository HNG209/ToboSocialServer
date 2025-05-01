const adminService = require('../services/adminService');

// === DASHBOARD ===
const getDashboard = async (req, res) => {
    try {
        const timeFilter = req.query.timeFilter || 'all';
        console.log('getDashboard query:', req.query);
        const stats = await adminService.getDashboardStats(timeFilter);
        res.status(200).json({ errorCode: 0, result: stats });
    } catch (err) {
        console.error('Error in getDashboard:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

// === USER ===
const getUsers = async (req, res) => {
    try {
        console.log('getUsers query:', req.query);
        const response = await adminService.getAllUsers(req.query);
        res.status(200).json({ errorCode: 0, result: response });
    } catch (err) {
        console.error('Error in getUsers:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const exportUsers = async (req, res) => {
    try {
        const { search, status } = req.query;
        console.log('exportUsers query:', { search, status });
        const users = await adminService.getAllUsersForExport(search, status);
        res.status(200).json({ errorCode: 0, result: users });
    } catch (err) {
        console.error('Error in exportUsers:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const banMultipleUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        console.log('banMultipleUsers body:', { userIds });
        await adminService.banMultipleUsers(userIds);
        res.status(200).json({ errorCode: 0, message: 'Khóa nhiều người dùng thành công' });
    } catch (err) {
        console.error('Error in banMultipleUsers:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const deleteMultipleUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        console.log('deleteMultipleUsers body:', { userIds });
        await adminService.deleteMultipleUsers(userIds);
        res.status(200).json({ errorCode: 0, message: 'Xóa nhiều người dùng thành công' });
    } catch (err) {
        console.error('Error in deleteMultipleUsers:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const banUser = async (req, res) => {
    try {
        console.log('banUser params:', req.params);
        await adminService.lockUser(req.params.id);
        res.status(200).json({ errorCode: 0, message: 'User đã bị khóa' });
    } catch (err) {
        console.error('Error in banUser:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const unbanUser = async (req, res) => {
    try {
        console.log('unbanUser params:', req.params);
        await adminService.unlockUser(req.params.id);
        res.status(200).json({ errorCode: 0, message: 'User đã được mở khóa' });
    } catch (err) {
        console.error('Error in unbanUser:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        console.log('deleteUser params:', req.params);
        await adminService.deleteUserAndRelated(req.params.id);
        res.status(200).json({ errorCode: 0, message: 'Đã xóa user và dữ liệu liên quan' });
    } catch (err) {
        console.error('Error in deleteUser:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

// === POST ===
const getPosts = async (req, res) => {
    try {
        console.log('getPosts query:', req.query);
        const response = await adminService.getAllPosts(req.query);
        res.status(200).json(response);
    } catch (err) {
        console.error('Error in getPosts:', err);
        res.status(400).json({ errorCode: 1, message: err.message });
    }
};

const removePost = async (req, res) => {
    try {
        console.log('removePost params:', req.params);
        await adminService.deletePost(req.params.id);
        res.status(200).json({ errorCode: 0, message: 'Đã xóa bài viết' });
    } catch (err) {
        console.error('Error in removePost:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

// === COMMENT ===
const getAllComment = async (req, res) => {
    try {
        console.log('getAllComment query:', req.query);
        const comments = await adminService.getComments(req.query);
        res.status(200).json({ errorCode: 0, result: comments });
    } catch (err) {
        console.error('Error in getAllComment:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const removeComment = async (req, res) => {
    try {
        console.log('removeComment params:', req.params);
        await adminService.deleteComment(req.params.id);
        res.status(200).json({ errorCode: 0, message: 'Đã xóa bình luận' });
    } catch (err) {
        console.error('Error in removeComment:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

// === REPORT ===
const getAllReports = async (req, res) => {
    try {
        console.log('getAllReports query:', req.query);
        const reports = await adminService.getReports(req.query);
        res.status(200).json({ errorCode: 0, result: reports });
    } catch (err) {
        console.error('Error in getAllReports:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

const markReportDone = async (req, res) => {
    try {
        console.log('markReportDone params:', req.params);
        await adminService.markReportReviewed(req.params.id);
        res.status(200).json({ errorCode: 0, message: 'Đã đánh dấu đã xử lý' });
    } catch (err) {
        console.error('Error in markReportDone:', err);
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    exportUsers,
    banUser,
    unbanUser, // Thêm endpoint mới
    deleteUser,
    banMultipleUsers,
    deleteMultipleUsers,
    getPosts,
    removePost,
    getAllComment,
    removeComment,
    getAllReports,
    markReportDone
};