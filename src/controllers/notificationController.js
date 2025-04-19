const {
    createNotificationService,
    getNotificationService,
    updateNotificationService,
    deleteNotificationService
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
    }
};
