const {
    createUser,
    getUser,
    updateUserService,
    deleteUserService
} = require("../services/userService");

module.exports = {
    postCreateUser: async (req, res) => {
        const rs = await createUser(req.body);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    getAllUser: async (req, res) => {
        const rs = await getUser(req.query);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    postUpdateUser: async (req, res) => {
        const rs = await updateUserService(req.body);
        res.status(200).json({ errorCode: 0, result: rs });
    },

    deleteUserAPI: async (req, res) => {
        const id = req.body.id;
        const rs = await deleteUserService(id);
        res.status(200).json({ errorCode: 0, result: rs });
    }
};
