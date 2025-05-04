const Post = require('../models/post');
const User = require('../models/user');
const getCurrentUserService = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');

    const postCount = await Post.countDocuments({ author: userId });

    return {
        ...user.toObject(),
        postCount,
        profile: user.profile || {
            bio: '',
            website: '',
            avatar: '',
            gender: 'other'
        }
    };
};

const updateUserProfileService = async (data) => {
    const user = await User.findById(data._id);
    if (!user) throw new Error('User not found');

    user.username = data.username;
    user.email = data.email;
    user.fullName = data.fullName;
    user.phone = data.phone;
    user.profile = {
        bio: data.profile.bio,
        website: data.profile.website,
        avatar: data.profile.avatar,
        gender: data.profile.gender
    };

    await user.save();
    return user;
};

const updateUserPasswordService = async (data) => {
    const user = await User.findById(data._id);
    if (!user) throw new Error('User not found');

    if (user.password !== data.currentPassword) {
        throw new Error('Current password is incorrect');
    }

    user.password = data.newPassword;
    await user.save();
    return true;
};

module.exports = {
    getCurrentUserService,
    updateUserProfileService,
    updateUserPasswordService
};
