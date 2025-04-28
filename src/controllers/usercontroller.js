const {
    createUser,
    getUser,
    updateUserService,
    deleteUserService,
    loginUserService,
    logoutUserService,
    forgotPasswordService,
    registerUserService
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
    },
    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await loginUserService(email, password);
            res.status(200).json({ errorCode: 0, result: user });
        } catch (error) {
            res.status(400).json({ errorCode: 1, message: error.message });
        }
    },

    postLogout: async (req, res) => {
        try {
            await logoutUserService(); // nếu không dùng session thì trả về luôn
            res.status(200).json({ errorCode: 0, message: 'Logout thành công' });
        } catch (error) {
            res.status(400).json({ errorCode: 1, message: error.message });
        }
    },

    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const newPassword = await forgotPasswordService(email);
            res.status(200).json({ errorCode: 0, message: 'Mật khẩu mới đã được gửi email', newPassword });
        } catch (error) {
            res.status(400).json({ errorCode: 1, message: error.message });
        }
    },
    postRegister: async (req, res) => {
        try {
            const newUser = await registerUserService(req.body);
            res.status(200).json({ errorCode: 0, result: newUser });
        } catch (error) {
            res.status(400).json({ errorCode: 1, message: error.message });
        }
    }
};
