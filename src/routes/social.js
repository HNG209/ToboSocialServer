const express = require('express')
const {
    postCreateUser,
    getAllUser,
    postUpdateUser,
    deleteUserAPI,
    postLogin,
    postLogout,
    postForgotPassword,
    postRegister,
    getUserByIdAPI
} = require('../controllers/usercontroller');
const {
    postCreatePost,
    getAllPost,
    postUpdatePost,
    deletePostAPI,
    likePost,
    unlikePost,
    getUserPostsAPI,
    getPostDetailAPI,
    getPostAuthor
} = require('../controllers/postController');
const { register, login } = require('../controllers/authController');
const { followUser, unfollowUser } = require('../controllers/followController');
const { postCreateComment, getAllComments, postUpdateComment, deleteCommentAPI, postLikeComment, postUnlikeComment } = require('../controllers/commentController');
const { postCreateNotification, getAllNotifications, postUpdateNotification, deleteNotificationAPI } = require('../controllers/notificationController');
const { postCreateStory, deleteStoryAPI, getAllStories } = require('../controllers/storyController');
const { getCommentsByPost, getLikesByPost, getFollowers, getFollowing, getStoriesByUser } = require('../controllers/getByTargetController');
const { getUserPosts } = require('../controllers/profileController');
const likeControllerv3 = require('../controllers/likeControllerv3');

const routerAPI = express.Router()

routerAPI.get('/', (req, res) => {
    res.send('hello')
})


routerAPI.get('/abc', (req, res) => {
    res.status(200).json({
        data: 'hello'
    })
})

routerAPI.post('/users', postCreateUser);
routerAPI.get('/users', getAllUser);
routerAPI.put('/users', postUpdateUser);
routerAPI.delete('/users', deleteUserAPI);

routerAPI.post('/posts', postCreatePost);
routerAPI.get('/posts', getAllPost);
routerAPI.put('/posts', postUpdatePost);
routerAPI.delete('/posts', deletePostAPI);

routerAPI.post('/register', register);
routerAPI.post('/login', login);

routerAPI.post('/users/:id/follow', followUser);
routerAPI.post('/users/:id/unfollow', unfollowUser);

routerAPI.post('/posts/:id/like', likePost);
routerAPI.post('/posts/:id/unlike', unlikePost);

routerAPI.post('/comments', postCreateComment);
routerAPI.get('/comments', getAllComments);
routerAPI.put('/comments', postUpdateComment);
routerAPI.delete('/comments', deleteCommentAPI);

routerAPI.post('/notifications', postCreateNotification);
routerAPI.get('/notifications', getAllNotifications);
routerAPI.put('/notifications', postUpdateNotification);
routerAPI.delete('/notifications', deleteNotificationAPI);

routerAPI.post('/stories', postCreateStory);
routerAPI.get('/stories', getAllStories);
routerAPI.delete('/stories', deleteStoryAPI);

routerAPI.get('/posts/:postId/comments', getCommentsByPost);
routerAPI.get('/posts/:postId/likes', getLikesByPost);
routerAPI.get('/users/:id/followers', getFollowers);
routerAPI.get('/users/:id/following', getFollowing);
routerAPI.get('/users/:id/stories', getStoriesByUser);
routerAPI.get('/users/:id/posts', getUserPosts);

routerAPI.post('/posts/:id/like', likePost);
routerAPI.post('/posts/:id/unlike', unlikePost);

routerAPI.post('/like-comment', postLikeComment); // thích bình luận
routerAPI.post('/unlike-comment', postUnlikeComment); // bỏ thích bình luận
routerAPI.get('/posts/:id', getPostDetailAPI); // lấy chi tiết bài viết
routerAPI.get('/users/:id/posts', getUserPostsAPI); // lấy bài viết của người dùng

routerAPI.post('/users/login', postLogin);
routerAPI.post('/users/logout', postLogout);
routerAPI.post('/users/forgot-password', postForgotPassword);
routerAPI.get('/users/:id', getUserByIdAPI); // lấy thông tin người dùng theo id
routerAPI.post('/users/register', postRegister);

// routerAPI.post('/like/:postId', likeControllerV2.likePost);
// routerAPI.post('/unlike/:postId', likeControllerV2.unlikePost);
// routerAPI.post('/:postId/status', likeControllerV2.isPostLiked);
// routerAPI.get('/:postId/count', likeControllerV2.countPostLikes);
// routerAPI.get('/:postId/users', likeControllerV2.getPostLikers);

//v3
routerAPI.post('/like/:targetId', likeControllerv3.like);
routerAPI.post('/unlike/:targetId', likeControllerv3.unlike);
routerAPI.post('/is-liked/:targetId', likeControllerv3.isLiked);
routerAPI.post('/like/count/:targetId', likeControllerv3.countLikes);
routerAPI.post('/likers/:targetId', likeControllerv3.getLikers);

routerAPI.get('/:postId/author', getPostAuthor);

module.exports = routerAPI