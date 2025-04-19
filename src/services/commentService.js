const Comment = require('../models/comment');
const aqp = require('api-query-params');

module.exports = {
    createCommentService: async (data) => {
        const rs = await Comment.create(data);
        return rs;
    },

    getCommentService: async (queryString) => {
        const page = queryString.page || 1;
        const { filter, limit = 10, population } = aqp(queryString);
        delete filter.page;

        const offset = (page - 1) * limit;
        const rs = await Comment.find(filter)
            .populate(population || ['user', 'post'])
            .skip(offset)
            .limit(limit)
            .exec();
        return rs;
    },

    updateCommentService: async (data) => {
        const rs = await Comment.updateOne({ _id: data.id }, { ...data });
        return rs;
    },

    deleteCommentService: async (id) => {
        const rs = await Comment.deleteById(id);
        return rs;
    }
};
