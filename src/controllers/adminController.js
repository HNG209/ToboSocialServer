const adminService = require('../services/adminService');

// === DASHBOARD ===
const getDashboard = async (req, res) => {
    try {
        const timeFilter = req.query.timeFilter || 'all'; // Mặc định là 'all'
        const stats = await adminService.getDashboardStats(timeFilter);
        res.status(200).json({ errorCode: 0, result: stats });
    } catch (err) {
        res.status(500).json({ errorCode: 1, message: err.message });
    }
};

// === USER ===
const getUsers = async (req, res) => {
    const users = await adminService.getAllUsers(req.query);
    res.status(200).json({ errorCode: 0, result: users });
};

const banUser = async (req, res) => {
    await adminService.lockUser(req.params.id);
    res.status(200).json({ errorCode: 0, message: 'User đã bị khóa' });
};

const deleteUser = async (req, res) => {
    await adminService.deleteUserAndRelated(req.params.id);
    res.status(200).json({ errorCode: 0, message: 'Đã xóa user và dữ liệu liên quan' });
};

// === POST ===
const getPosts = async (req, res) => {
    console.log('--- getPosts controller reached');
    try {
        const response = await adminService.getAllPosts(req.query);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ errorCode: 1, message: err.message });
    }
};

const removePost = async (req, res) => {
    await adminService.deletePost(req.params.id);
    res.status(200).json({ errorCode: 0, message: 'Đã xóa bài viết' });
};

// === COMMENT ===
const getAllComment = async (req, res) => {
    const comments = await adminService.getComments(req.query);
    res.status(200).json({ errorCode: 0, result: comments });
};

const removeComment = async (req, res) => {
    await adminService.deleteComment(req.params.id);
    res.status(200).json({ errorCode: 0, message: 'Đã xóa bình luận' });
};

// === REPORT ===
const getAllReports = async (req, res) => {
    const reports = await adminService.getReports(req.query);
    res.status(200).json({ errorCode: 0, result: reports });
};

const markReportDone = async (req, res) => {
    await adminService.markReportReviewed(req.params.id);
    res.status(200).json({ errorCode: 0, message: 'Đã đánh dấu đã xử lý' });
};

module.exports = {
    getDashboard,
    getUsers,
    banUser,
    deleteUser,
    getPosts,
    removePost,
    getAllComment,
    removeComment,
    getAllReports,
    markReportDone
};
