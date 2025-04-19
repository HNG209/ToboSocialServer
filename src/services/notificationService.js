const Notification = require('../models/notification');
const aqp = require('api-query-params');

module.exports = {
    createNotificationService: async (data) => {
        const rs = await Notification.create(data);
        return rs;
    },

    getNotificationService: async (queryString) => {
        const page = queryString.page || 1;
        const { filter, limit = 10, population } = aqp(queryString);
        delete filter.page;

        const offset = (page - 1) * limit;
        const rs = await Notification.find(filter)
            .populate(population || ['sender', 'post'])
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .exec();
        return rs;
    },

    updateNotificationService: async (data) => {
        const rs = await Notification.updateOne({ _id: data.id }, { ...data });
        return rs;
    },

    deleteNotificationService: async (id) => {
        const rs = await Notification.deleteById(id);
        return rs;
    }
};
