const User = require("../models/user");
const {
    createUser,
    getUser,
    updateUserService,
    deleteUserService,
    loginUserService,
    logoutUserService,
    forgotPasswordService,
    registerUserService,
    searchUserService,
    getUserPostsByUserId
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
    },

    getSearchUser: async (req, res) => {
        try {
            const query = req.query.q;
            if (!query) return res.status(400).json({ errorCode: 1, message: 'Thiếu từ khóa tìm kiếm' });

            const users = await searchUserService(query);
            res.status(200).json({ errorCode: 0, result: users });
        } catch (error) {
            res.status(500).json({ errorCode: 1, message: error.message });
        }
    },

    getUserByUsername: async (req, res) => {
        const username = req.params.username;
        const user = await User.findOne({ username }).select("-password");
        if (!user) return res.status(404).json({ errorCode: 1, message: "Không tìm thấy người dùng" });

        res.status(200).json({ errorCode: 0, result: user });
    },
    getPostsByUserId: async (req, res) => {
        try {
            const userId = req.params.id;
            const posts = await getUserPostsByUserId(userId, req.query);

            res.status(200).json({
                errorCode: 0,
                result: posts
            });
        } catch (error) {
            res.status(400).json({
                errorCode: 1,
                message: error.message
            });
        }
    }
};
