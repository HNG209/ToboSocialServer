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

            const updatedCurrentUser = await User.findById(userId);
            const updatedTargetUser = await User.findById(targetId);

            return {
                status: 200,
                errorCode: 0,
                result: {
                    message: "Theo dõi thành công!",
                    user: updatedCurrentUser,
                    targetUser: updatedTargetUser
                }
            };
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

            const updatedCurrentUser = await User.findById(userId);
            const updatedTargetUser = await User.findById(targetId);

            return {
                status: 200,
                errorCode: 0,
                result: {
                    message: "Bỏ theo dõi thành công!",
                    user: updatedCurrentUser,
                    targetUser: updatedTargetUser
                }
            };
        } else {
            return { status: 400, error: "Bạn chưa theo dõi người này." };
        }
    }
};