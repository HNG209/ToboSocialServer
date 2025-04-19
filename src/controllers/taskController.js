const { createTask, getTask, putUpdateTaskAPIService, deleteTaskService } = require("../services/taskService");


module.exports = {
    postCreateTask: async (req, res) => {
        let rs = await createTask(req.body)


        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    getAllTask: async (req, res) => {
        let rs = await getTask(req.query)

        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    postTaskAPI: async (req, res) => {

        let rs = await putUpdateTaskAPIService(req.body)

        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    deleteTaskAPI: async (req, res) => {
        // res.send("aaa")
        let id = req.body.id

        let rs = await deleteTaskService(id)
        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },
}