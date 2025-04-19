const express = require('express')
const {
    postCreateUser,
    getAllUser,
    postUpdateUser,
    deleteUserAPI
} = require('../controllers/usercontroller');
const {
    postCreatePost,
    getAllPost,
    postUpdatePost,
    deletePostAPI
} = require('../controllers/postController');
const { register, login } = require('../controllers/authController');
const { followUser, unfollowUser } = require('../controllers/followController');
const { likePost, unlikePost } = require('../controllers/likeController');
const { postCreateComment, getAllComments, postUpdateComment, deleteCommentAPI } = require('../controllers/commentController');
const { postCreateNotification, getAllNotifications, postUpdateNotification, deleteNotificationAPI } = require('../controllers/notificationController');

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

module.exports = routerAPI