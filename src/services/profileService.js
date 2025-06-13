const Post = require('../models/post');
const aqp = require('api-query-params');
const likeServicev3 = require('./likeServicev3');
const Like = require('../models/likev2');

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

const getUserPostsServicev2 = async (authorId, userId, query) => {
    const page = parseInt(query.page) || 1;

    const { limit = 10, population } = aqp(query);
    const offset = (page - 1) * limit;

    const posts = await Post.find({ author: authorId })
        .populate(population || "author")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

    // Gán likeCount cho từng post
    for (let post of posts) {
        post.likeCount = (await likeServicev3.countLikesService(post._id, 'post')).likes;
    }

    if (userId == null || userId == undefined) return posts;

    const likedPostIds = await Like.find({
        user: userId,
        target: { $in: posts.map(p => p._id) },
        onModel: 'post'
    }).distinct('target');

    const likedPostIdStrings = likedPostIds.map(id => id.toString());

    // Gắn isLiked vào từng bài viết
    const postsWithLikeStatus = posts.map(post => ({
        ...post,
        isLiked: likedPostIdStrings.includes(post._id.toString())
    }));

    return postsWithLikeStatus;
};

module.exports = { getUserPostsService, getUserPostsServicev2 };
