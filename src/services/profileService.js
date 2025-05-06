const Post = require('../models/post');
const aqp = require('api-query-params');
const likeServicev3 = require('./likeServicev3');

const getUserPostsService = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const { limit = 10, population } = aqp(query);
    const offset = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
        .populate(population || "author")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

    // Gán likeCount cho từng post
    for (let post of posts) {
        post.likeCount = (await likeServicev3.countLikesService(post._id, 'post')).likes;
    }

    return posts;
};

module.exports = { getUserPostsService };
