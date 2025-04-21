const Story = require('../models/story');
const User = require('../models/user');

module.exports = {
    createStoryService: async (data) => {
        // Tự tính thời điểm hết hạn
        data.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const rs = await Story.create(data);
        return rs;
    },

    getStoryService: async (userId) => {
        const user = await User.findById(userId).populate('following');
        const idsToFetch = [userId, ...user.following.map(u => u._id)];

        const now = new Date();
        const stories = await Story.find({
            user: { $in: idsToFetch },
            expiresAt: { $gt: now }
        }).populate('user', 'username profile.avatar');

        return stories;
    },

    deleteStoryService: async (id) => {
        const rs = await Story.deleteById(id);
        return rs;
    }
};
