const aqp = require('api-query-params');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = {
    createPost: async (data) => {
        if (data.type === "EMPTY-POST") {
            const rs = await Post.create(data);

            // Tăng postCount
            await User.findByIdAndUpdate(data.author, { $inc: { postCount: 1 } });

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
            const post = await Post.findById(id);

            if (!post) throw new Error("Post not found");

            const rs = await Post.deleteById(id);

            // Giảm postCount
            await User.findByIdAndUpdate(post.author, { $inc: { postCount: -1 } });

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
    },

    getPostDetailService: async (id) => {
        const post = await Post.findById(id)
            .populate({
                path: 'author',
                select: 'username profile.avatar fullName' // lấy đủ username + avatar + full name
            })
            .populate({
                path: 'likes',
                select: 'username profile.avatar' // chỉ cần username + avatar khi hiện người like
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username profile.avatar'
                }
            });

        if (!post) {
            throw new Error('Post not found');
        }

        return post;
    }


};
