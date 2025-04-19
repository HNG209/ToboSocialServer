const { createProject, getProject, deleteProjectService, putUpdateProjectAPIService } = require("../services/productService");

module.exports = {
    postCreateProject: async (req, res) => {
        let rs = await createProject(req.body)

        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    getAllProject: async (req, res) => {
        let rs = await getProject(req.query)

        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    postProjectAPI: async (req, res) => {
        const { id, name, endDate, description } = req.body
        console.log({ id, name, endDate, description });

        let rs = await putUpdateProjectAPIService({ id, name, endDate, description })

        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    deleteProjectAPI: async (req, res) => {
        // res.send("aaa")
        let id = req.body.id

        let rs = await deleteProjectService(id)
        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },
}