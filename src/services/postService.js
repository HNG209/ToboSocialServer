const aqp = require('api-query-params');
const Post = require('../models/post');
const User = require('../models/user');
const { getUserPosts } = require('../controllers/profileController');
const { getUserPostsService } = require('./profileService');
const likeServicev3 = require('./likeServicev3');
const Notification = require('../models/notification');

module.exports = {
    createPost: async (data) => {
        if (data.type === "EMPTY-POST") {
            const rs = await Post.create(data);

            // Tăng postCount
            await User.findByIdAndUpdate(data.author, { $inc: { postCount: 1 } });

            return rs;
        }
    },

    getAuthorByPostIdService: async (postId) => {
        try {
            // Tìm bài viết theo ID và populate trường author
            const post = await Post.findById(postId).populate({
                path: 'author',
                select: 'username email fullName profile.avatar' // chọn các trường cần thiết
            });

            if (!post) {
                throw new Error('Post not found');
            }

            return post.author;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getPost: async (queryString) => {
        const page = queryString.page || 1;
        const { filter, limit = 10, population } = aqp(queryString);
        delete filter.page;
        
        const offset = (page - 1) * limit;
        const posts = await Post.find(filter)
            .populate('author')
            .populate('likes')
            .populate('comments')
            .skip(offset)
            .limit(limit);

        return posts;
    },

    //Hung them vo
    getPostWithLikeChecked: async (queryString, userId) => {
        const page = queryString.page || 1;
        const { filter, limit = 10, population } = aqp(queryString);
        delete filter.page;

        const offset = (page - 1) * limit;
        const posts = await Post.find(filter)
            .populate('author')
            .populate('likes')       // vẫn cần nếu muốn hiển thị danh sách người like
            .populate('comments')
            .skip(offset)
            .limit(limit)
            .lean(); // để có thể thêm trường mới

        // Lấy danh sách các postId mà user đã like
        const likedPostIds = await Like.find({ user: userId, post: { $in: posts.map(p => p._id) } })
            .distinct('post');

        // Gắn isLiked vào từng bài viết
        const postsWithLikeStatus = posts.map(post => ({
            ...post,
            isLiked: likedPostIds.includes(post._id.toString())
        }));

        return postsWithLikeStatus;
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
            throw new Error('Bài viết không tồn tại');
        }

        // Kiểm tra xem người dùng đã thích bài viết chưa
        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();

            // Tạo thông báo nếu người thích không phải là tác giả bài viết
            if (post.author.toString() !== userId.toString()) {
                await Notification.create({
                    recipient: post.author, // Người nhận là tác giả bài viết
                    sender: userId, // Người gửi là người đã thích bài viết
                    type: 'post', // Loại thông báo
                    title: 'Lượt thích mới trên bài viết của bạn',
                    message: `Có người đã thích bài viết của bạn!`,
                    relatedEntity: postId, // Tham chiếu đến bài viết được thích
                    relatedEntityModel: 'post', // Loại mô hình của thực thể liên quan
                    isRead: false, // Mặc định là chưa đọc
                });
            }
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
            .lean()

        if (!post) {
            throw new Error('Post not found');
        }

        post.likeCount = (await likeServicev3.countLikesService(id, 'post')).likes

        return post;
    },

    getUserPostsService: async (userId, queryString) => {
        const page = queryString.page || 1;
        const { filter, limit = 10 } = aqp(queryString);
        delete filter.page;

        const offset = (page - 1) * limit;
        const rs = await Post.find({ author: userId })
            .populate('author')
            .populate('likes')
            .populate('comments')
            .skip(offset)
            .limit(limit)
            .exec();

        return rs;
    }
};
