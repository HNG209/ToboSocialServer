const Project = require("../models/project")
const aqp = require('api-query-params')


module.exports = {
    createProject: async (data) => {
        if (data.type === "EMPTY-PROJECT") {
            let rs = await Project.create(data)
            return rs
        }
        if (data.type === "ADD-USERS") {
            let myProject = await Project.findById(data.projectId).exec()

            myProject.usersInfor.push(...data.usersInfor);

            let newRs = await myProject.save()

            return newRs
        }
        if (data.type === "REMOVE-USER") {
            const myProject = await Project.findById(data.projectId).exec();

            myProject.usersInfor.pull(...data.usersInfor);

            const newRs = await myProject.save();
            return newRs;
        }

        if (data.type === "ADD-TASKS") {
            const myProject = await Project.findById(data.projectId).exec();

            myProject.tasks.push(...data.taskArr);

            const newRs = await myProject.save();
            return newRs;
        }
    },

    getProject: async (queryString) => {
        const page = queryString.page
        const { filter, limit, population } = aqp(queryString)
        delete filter.page

        const offset = (page - 1) * limit
        let rs = await Project.find(filter)
            .populate(population)
            .skip(offset)
            .limit(limit)
            .exec();

        return rs
    },

    deleteProjectService: async (id) => {
        try {
            let rs = await Project.findByIdAndDelete(id)
            return rs
        } catch (error) {
            console.log(error);

        }
    },

    putUpdateProjectAPIService: async ({ id, name, endDate, description }) => {
        try {
            let rs = await Project.updateOne({ _id: id }, { name, endDate, description })
            return rs
        } catch (error) {
            console.log(error);

        }
    },
}