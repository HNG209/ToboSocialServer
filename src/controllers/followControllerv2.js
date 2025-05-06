const FollowerService = require('../services/followServicev2');

class FollowerControllerv2 {
    // static async countFollowers(req, res) {
    //     try {
    //         const { userId } = req.params;

    //         if (!userId) {
    //             return res.status(400).json({ message: 'userId là bắt buộc.' });
    //         }

    //         const count = await FollowerService.countFollowers(userId);
    //         return res.status(200).json({ userId, followerCount: count });
    //     } catch (err) {
    //         console.error("Lỗi khi đếm follower:", err);
    //         return res.status(500).json({ message: 'Lỗi server.' });
    //     }
    // }
    // GET /is-following?subjectId=...&followingId=...
    static async isFollowing(req, res) {
        try {
            const { subjectId, followingId } = req.query;
            const result = await FollowerService.isFollowing(subjectId, followingId);
            res.status(200).json({ isFollowing: result });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // POST /follow
    static async follow(req, res) {
        try {
            const { subjectId, followingId } = req.body;
            const result = await FollowerService.followUser(subjectId, followingId);
            res.status(200).json({ errorCode: 0, result });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // DELETE /unfollow
    static async unfollow(req, res) {
        try {
            const { subjectId, followingId } = req.body;
            const result = await FollowerService.unfollowUser(subjectId, followingId);
            res.status(200).json({ errorCode: 0, result });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // GET /:userId/following
    static async getFollowing(req, res) {
        try {
            const userId = req.params.userId;
            const result = await FollowerService.getFollowingUsers(userId);
            res.status(200).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // GET /:userId/followers
    static async getFollowers(req, res) {
        try {
            const userId = req.params.userId;
            const result = await FollowerService.getFollowers(userId);
            res.status(200).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = FollowerControllerv2;
