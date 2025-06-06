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
    getUserByIdAPI,
    getSearchUser,
    getUserByUsername,
    getPostsByUserId,
    getUserByIdAPIv2
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
const { postCreateNotification, postUpdateNotification, deleteNotificationAPI, markNotificationAsRead, getAllNotifications } = require('../controllers/notificationController');
const { postCreateStory, deleteStoryAPI, getAllStories } = require('../controllers/storyController');
const { getCommentsByPost, getCommentsByPostv2, getLikesByPost, getFollowers, getFollowing, getStoriesByUser, getRepliedComments } = require('../controllers/getByTargetController');
const { getUserPosts } = require('../controllers/profileController');
const likeControllerv3 = require('../controllers/likeControllerv3');
const { createReport } = require('../controllers/reportController');
const { getDashboard, getUsers, banUser, deleteUser, getPosts, removePost, getAllComment, removeComment, getAllReports, markReportDone, banMultipleUsers, deleteMultipleUsers, exportUsers, unbanUser, restorePost, getPostReportCount, warnUser, markAllNotificationsAsRead } = require('../controllers/adminController');
const { getCurrentUser, updateUserProfile, updateUserPassword } = require('../controllers/adminUserController');
const FollowerControllerv2 = require('../controllers/followControllerv2');

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

// routerAPI.get('/posts/:postId/comments', getCommentsByPost);
routerAPI.post('/posts/:postId/comments', getCommentsByPostv2); //v2: có trả về trạng thái đã like bình luận của người dùng
routerAPI.get('/posts/:postId/likes', getLikesByPost);
routerAPI.post('/comments/:commentId/replies', getRepliedComments); // lấy bình luận trả lời của bình luận gốc
routerAPI.get('/users/:id/followers', getFollowers);
routerAPI.get('/users/:id/following', getFollowing);
routerAPI.get('/users/:id/stories', getStoriesByUser);
routerAPI.get('/users/:id/posts', getUserPosts);

routerAPI.post('/posts/:id/like', likePost);
routerAPI.post('/posts/:id/unlike', unlikePost);

routerAPI.post('/like-comment', postLikeComment); // thích bình luận
routerAPI.post('/unlike-comment', postUnlikeComment); // bỏ thích bình luận
routerAPI.get('/posts/:id', getPostDetailAPI); // lấy chi tiết bài viết
// routerAPI.get('/users/:id/posts', getUserPostsAPI); // lấy bài viết của người dùng

routerAPI.post('/users/login', postLogin);
routerAPI.post('/users/logout', postLogout);
routerAPI.post('/users/forgot-password', postForgotPassword);
routerAPI.get('/users/:id', getUserByIdAPIv2); // lấy thông tin người dùng theo id
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

// Follow người dùng
routerAPI.post('/follow', FollowerControllerv2.follow);

// Unfollow người dùng
routerAPI.post('/unfollow', FollowerControllerv2.unfollow);

// Lấy danh sách người đang được user follow
routerAPI.get('/:userId/following', FollowerControllerv2.getFollowing);

// Lấy danh sách người đang follow user
routerAPI.get('/:userId/followers', FollowerControllerv2.getFollowers);

// Kiểm tra subjectId đã follow followingId chưa
routerAPI.get('/is-following', FollowerControllerv2.isFollowing);


routerAPI.get('/:postId/author', getPostAuthor);
//search
routerAPI.get('/search', getSearchUser);
routerAPI.get('/by-username/:username', getUserByUsername);

//report
routerAPI.post('/reports', createReport);

// DASHBOARD + ADMIN
routerAPI.get('/admin/dashboard', getDashboard);
routerAPI.get('/admin/users', getUsers);
routerAPI.get('/admin/users/export', exportUsers);
routerAPI.post('/ban/:id', banUser);
routerAPI.post('/unban/:id', unbanUser);
routerAPI.delete('/admin/users/:id', deleteUser);
routerAPI.patch('/admin/users/ban-multiple', banMultipleUsers);
routerAPI.delete('/admin/users/delete-multiple', deleteMultipleUsers);

routerAPI.get('/admin/posts', getPosts);
routerAPI.delete('/admin/posts/:id', removePost);
routerAPI.patch('/admin/posts/:id/restore', restorePost);

routerAPI.get('/admin/comments', getAllComment);
routerAPI.delete('/admin/comments/:id', removeComment);

routerAPI.get('/admin/reports', getAllReports);
routerAPI.get('/admin/reports/post/:id/count', getPostReportCount);
routerAPI.patch('/admin/reports/:id/reviewed', markReportDone);
routerAPI.post('/users/:userId/warn', warnUser);

routerAPI.get('/notifications', getAllNotifications);
routerAPI.patch('/notifications/:id/read', markNotificationAsRead);
routerAPI.patch('/notifications/read-all', markAllNotificationsAsRead);

routerAPI.get('/admin/account', getCurrentUser);
routerAPI.put('/admin/account/profile', updateUserProfile);
routerAPI.put('/admin/account/password', updateUserPassword);

routerAPI.get('/:id/posts', getPostsByUserId);


module.exports = routerAPI