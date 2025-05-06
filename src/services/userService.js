const aqp = require('api-query-params');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const { get } = require('mongoose');
const Post = require('../models/post');
const Follower = require('../models/follower');

// 1. Setup transporter gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = {
    // 2. Các hàm User CRUD
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

    getUserById: async (id) => {
        const rs = await User.findById(id).exec();
        return rs;
    },

    getUserByIdv2: async (id, currentUserId) => {
        const user = await User.findById(id).lean();

        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        if(currentUserId == undefined || currentUserId == null){
            return user;
        }


        // Nếu người dùng đang xem trang cá nhân của chính mình
        if (id.toString() === currentUserId.toString()) {
            return user;
        }

        // Kiểm tra currentUser có follow user này không
        const isFollowing = await Follower.exists({
            subject: currentUserId,
            following: id
        });

        return {
            ...user,
            isFollowedByCurrentUser: !!isFollowing
        };
    },

    updateUserService: async (data) => {
        console.log('data', data);
        const rs = await User.updateOne({ _id: data._id }, { ...data });
        return rs;
    },

    deleteUserService: async (id) => {
        const rs = await User.deleteById(id);
        return rs;
    },

    // 3. Login Service
    loginUserService: async (email, password) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email không tồn tại');
        }
        if (user.password !== password) {
            throw new Error('Mật khẩu không đúng');
        }
        return user;
    },

    // 4. Logout Service
    logoutUserService: async () => {
        return true; // Không dùng session thì chỉ trả true
    },

    // 5. Forgot Password + Gửi mail
    forgotPasswordService: async (email) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email không tồn tại');
        }

        // Tạo mật khẩu mới
        const newPassword = Math.random().toString(36).slice(-8);

        // Cập nhật mật khẩu
        user.password = newPassword;
        await user.save();

        // Gửi email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Reset mật khẩu',
            text: `Xin chào ${user.username || ''},\n\nMật khẩu mới của bạn là: ${newPassword}\n\nVui lòng đăng nhập và đổi lại mật khẩu ngay lập tức.`
        };

        await transporter.sendMail(mailOptions);

        return true; // Không trả password về FE vì bảo mật
    },
    registerUserService: async (data) => {
        const { username, email, password, fullName } = data;

        if (!username || !email || !password || !fullName) {
            throw new Error('Vui lòng nhập đầy đủ thông tin (username, email, password, fullName)');
        }

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            throw new Error('Email đã được sử dụng');
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        const newUser = await User.create({
            username,
            email,
            password,
            fullName,
        });

        return newUser;
    },

    searchUserService: async (query) => {
        const regex = new RegExp(query, 'i'); // không phân biệt hoa thường

        const users = await User.find({
            $or: [
                { username: regex },
                { fullName: regex }
            ]
        })
            .limit(10)
            .select('username fullName profile.avatar'); // chỉ trả thông tin cần thiết

        return users;
    },
    getUserPostsByUserId: async (userId, query) => {
        const page = parseInt(query.page) || 1;
        const { limit = 10, population } = aqp(query);
        const offset = (page - 1) * limit;

        const posts = await Post.find({ author: userId })
            .populate(population || 'author')
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean();

        return posts;
    }
};
