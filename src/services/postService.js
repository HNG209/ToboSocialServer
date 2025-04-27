const aqp = require('api-query-params');
const Post = require('../models/post');

module.exports = {
    createPost: async (data) => {
        if (data.type === "EMPTY-POST") {
            const rs = await Post.create(data);
            return rs;
        }
    },

    getPost: async (queryString) => {
        const page = queryString.page || 1;
        const { filter, limit = 10, population } = aqp(queryString);
        delete filter.page;

        const offset = (page - 1) * limit;
        const rs = await Post.find(filter)
            .populate('author')
            .populate('likes')
            .populate('comments')
            .skip(offset)
            .limit(limit)
            .exec();

        return rs;
    },

    updatePostService: async (data) => {
        try {
            const rs = await Post.updateOne({ _id: data.id }, { ...data });
            return rs;
        } catch (error) {
            console.log(error);
        }
    },

    deletePostService: async (id) => {
        try {
            const rs = await Post.deleteById(id);
            return rs;
        } catch (error) {
            console.log(error);
        }
    },
    likePostService: async (postId, userId) => {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        return post;
    },

    unlikePostService: async (postId, userId) => {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        post.likes = post.likes.filter(likeId => likeId.toString() !== userId);
        await post.save();

        return post;
    }

};
