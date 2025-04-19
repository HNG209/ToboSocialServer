const User = require("../models/user");

module.exports = {
    followUserService: async (userId, targetId) => {
        if (userId === targetId) {
            return { status: 400, error: "Không thể tự theo dõi chính mình." };
        }

        const user = await User.findById(targetId);
        const currentUser = await User.findById(userId);
        if (!user || !currentUser) {
            return { status: 404, error: "Người dùng không tồn tại." };
        }

        if (!user.followers.includes(userId)) {
            await user.updateOne({ $push: { followers: userId } });
            await currentUser.updateOne({ $push: { following: targetId } });
            return { status: 200, message: "Theo dõi thành công!" };
        } else {
            return { status: 400, error: "Đã theo dõi người này rồi." };
        }
    },

    unfollowUserService: async (userId, targetId) => {
        if (userId === targetId) {
            return { status: 400, error: "Không thể bỏ theo dõi chính mình." };
        }

        const user = await User.findById(targetId);
        const currentUser = await User.findById(userId);
        if (!user || !currentUser) {
            return { status: 404, error: "Người dùng không tồn tại." };
        }

        if (user.followers.includes(userId)) {
            await user.updateOne({ $pull: { followers: userId } });
            await currentUser.updateOne({ $pull: { following: targetId } });
            return { status: 200, message: "Bỏ theo dõi thành công!" };
        } else {
            return { status: 400, error: "Bạn chưa theo dõi người này." };
        }
    }
};
