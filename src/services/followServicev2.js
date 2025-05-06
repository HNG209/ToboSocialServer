const Follower = require('../models/follower'); // Cập nhật đường dẫn theo dự án của bạn

class FollowerService {
    // Kiểm tra subjectId đã follow followingId hay chưa
    static async isFollowing(subjectId, followingId) {
        const follow = await Follower.findOne({ subject: subjectId, following: followingId });
        return !!follow; // true nếu đã follow, false nếu chưa
    }

    // Người dùng subject follow người dùng following
    static async followUser(subjectId, followingId) {
        if (subjectId === followingId) {
            throw new Error("Không thể tự follow chính mình.");
        }

        // Kiểm tra đã follow chưa
        const existing = await Follower.findOne({ subject: subjectId, following: followingId });
        if (existing) {
            return { isFollowing: false, message: 'Đã follow người dùng này.' };
        }

        const newFollow = new Follower({ subject: subjectId, following: followingId });
        await newFollow.save();
        return { isFollowing: true, message: 'Follow thành công.' };
    }

    // Bỏ theo dõi
    static async unfollowUser(subjectId, followingId) {
        const deleted = await Follower.findOneAndDelete({ subject: subjectId, following: followingId });
        if (!deleted) {
            return { message: 'Không tìm thấy mối quan hệ follow để hủy.' };
        }
        return { isFollowing: false, message: 'Unfollow thành công.' };
    }

    // Lấy danh sách người mà user đang follow
    static async getFollowingUsers(subjectId) {
        return await Follower.find({ subject: subjectId }).populate('following', '-password');
    }

    // Lấy danh sách người đang follow user
    static async getFollowers(userId) {
        return await Follower.find({ following: userId }).populate('subject', '-password');
    }
}

module.exports = FollowerService;
