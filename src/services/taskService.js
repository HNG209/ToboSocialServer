const aqp = require('api-query-params')
const Task = require("../models/task")


module.exports = {
    createTask: async (data) => {
        if (data.type === "EMPTY-TASK") {
            let rs = await Task.create(data)
            return rs
        }
    },

    getTask: async (queryString) => {
        const page = queryString.page
        const { filter, limit, population } = aqp(queryString)
        delete filter.page

        const offset = (page - 1) * limit
        let rs = await Task.find(filter)
            .populate(population)
            .skip(offset)
            .limit(limit)
            .exec();

        return rs
    },

    deleteTaskService: async (id) => {
        try {
            let rs = await Task.deleteById(id)
            return rs
        } catch (error) {
            console.log(error);

        }
    },

    putUpdateTaskAPIService: async (data) => {
        try {
            let rs = await Task.updateOne({ _id: data.id }, { ...data })
            return rs
        } catch (error) {
            console.log(error);

        }
    },
}