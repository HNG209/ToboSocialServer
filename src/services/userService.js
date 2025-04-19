const aqp = require('api-query-params');
const User = require('../models/user');

module.exports = {
    createUser: async (data) => {
        const rs = await User.create(data);
        return rs;
    },

    getUser: async (queryString) => {
        const page = queryString.page || 1;
        const { filter, limit = 10, population } = aqp(queryString);
        delete filter.page;

        const offset = (page - 1) * limit;
        const rs = await User.find(filter)
            .populate(population || '')
            .skip(offset)
            .limit(limit)
            .exec();
        return rs;
    },

    updateUserService: async (data) => {
        const rs = await User.updateOne({ _id: data.id }, { ...data });
        return rs;
    },

    deleteUserService: async (id) => {
        const rs = await User.deleteById(id);
        return rs;
    }
};
