const {
    createNotificationService,
    getNotificationService,
    updateNotificationService,
    deleteNotificationService,
    getUserNotificationsService,
    markNotificationAsReadService,
    markAllNotificationsAsReadService
} = require('../services/notificationService');

module.exports = {
    postCreateNotification: async (req, res) => {
        const rs = await createNotificationService(req.body);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    getAllNotifications: async (req, res) => {
        const rs = await getNotificationService(req.query);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    postUpdateNotification: async (req, res) => {
        const rs = await updateNotificationService(req.body);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    deleteNotificationAPI: async (req, res) => {
        const rs = await deleteNotificationService(req.body.id);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    // Lấy danh sách thông báo
    getAllNotifications: async (req, res) => {
        const userId = req.query.userId || req.user?._id;
        if (!userId) {
            return res.status(400).json({ errorCode: 1, message: 'Thiếu userId' });
        }

        try {
            const result = await getUserNotificationsService(userId, req.query);
            return res.status(200).json({ errorCode: 0, result });
        } catch (err) {
            return res.status(500).json({ errorCode: 1, message: err.message });
        }
    },

    // Đánh dấu 1 thông báo là đã đọc
    markNotificationAsRead: async (req, res) => {
        try {
            await markNotificationAsReadService(req.params.id);
            return res.status(200).json({ errorCode: 0, message: 'Đã đánh dấu là đã đọc' });
        } catch (err) {
            return res.status(500).json({ errorCode: 1, message: err.message });
        }
    },

    // Đánh dấu tất cả là đã đọc
    markAllNotificationsAsRead: async (req, res) => {
        const userId = req.query.userId || req.user?._id;
        if (!userId) {
            return res.status(400).json({ errorCode: 1, message: 'Thiếu userId' });
        }

        try {
            await markAllNotificationsAsReadService(userId);
            return res.status(200).json({ errorCode: 0, message: 'Đã đánh dấu tất cả là đã đọc' });
        } catch (err) {
            return res.status(500).json({ errorCode: 1, message: err.message });
        }
    },
};
