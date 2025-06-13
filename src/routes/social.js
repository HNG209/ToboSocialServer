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
    getUserByIdAPIv2,
    getUserProfile
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
const { register, login, registerv2, loginv2, refresh, changePassword } = require('../controllers/authController');
const { followUser, unfollowUser } = require('../controllers/followController');
const { postCreateComment, getAllComments, postUpdateComment, deleteCommentAPI, postLikeComment, postUnlikeComment } = require('../controllers/commentController');
const { postCreateNotification, postUpdateNotification, deleteNotificationAPI, markNotificationAsRead, getAllNotifications } = require('../controllers/notificationController');
const { postCreateStory, deleteStoryAPI, getAllStories } = require('../controllers/storyController');
const { getCommentsByPost, getCommentsByPostv2, getLikesByPost, getFollowers, getFollowing, getStoriesByUser, getRepliedComments } = require('../controllers/getByTargetController');
const { getUserPosts, getProfilePost } = require('../controllers/profileController');
const likeControllerv3 = require('../controllers/likeControllerv3');
const { createReport } = require('../controllers/reportController');
const { getDashboard, getUsers, banUser, deleteUser, getPosts, removePost, getAllComment, removeComment, getAllReports, markReportDone, banMultipleUsers, deleteMultipleUsers, exportUsers, unbanUser, restorePost, getPostReportCount, warnUser, markAllNotificationsAsRead } = require('../controllers/adminController');
const { getCurrentUser, updateUserProfile, updateUserPassword } = require('../controllers/adminUserController');
const FollowerControllerv2 = require('../controllers/followControllerv2');
const { validateToken } = require('../services/tokenService');
const { checkToken } = require('../controllers/tokenController');
const authenticateToken = require('../middlewares/authMiddleware');

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

// revert
// routerAPI.post('/register', register);
// routerAPI.post('/login', login);

// v2
routerAPI.post('/register', registerv2);
routerAPI.post('/login', loginv2);
routerAPI.get('/validate', checkToken);
routerAPI.post('/refresh', refresh);
routerAPI.put('/password', changePassword); // đổi mật khẩu

routerAPI.post('/users/:id/follow', followUser);
routerAPI.post('/users/:id/unfollow', unfollowUser);

routerAPI.post('/posts/:id/like', likePost);
routerAPI.post('/posts/:id/unlike', unlikePost);

routerAPI.post('/comments', authenticateToken, postCreateComment);
routerAPI.get('/comments', authenticateToken, getAllComments);
routerAPI.put('/comments', authenticateToken, postUpdateComment);
routerAPI.delete('/comments', authenticateToken, deleteCommentAPI);
routerAPI.get('/posts/:postId/comments', authenticateToken, getCommentsByPostv2); //v2: có trả về trạng thái đã like bình luận của người dùng
routerAPI.post('/comments/:commentId/replies', authenticateToken, getRepliedComments); // lấy bình luận trả lời của bình luận gốc

routerAPI.post('/notifications', postCreateNotification);
routerAPI.get('/notifications', getAllNotifications);
routerAPI.put('/notifications', postUpdateNotification);
routerAPI.delete('/notifications', deleteNotificationAPI);

routerAPI.post('/stories', postCreateStory);
routerAPI.get('/stories', getAllStories);
routerAPI.delete('/stories', deleteStoryAPI);

// routerAPI.get('/posts/:postId/comments', getCommentsByPost);
routerAPI.get('/posts/:postId/likes', getLikesByPost);
routerAPI.get('/users/:id/followers', getFollowers);
routerAPI.get('/users/:id/following', getFollowing);
routerAPI.get('/users/:id/stories', getStoriesByUser);

routerAPI.post('/posts/:id/like', likePost);
routerAPI.post('/posts/:id/unlike', unlikePost);

routerAPI.post('/like-comment', postLikeComment); // thích bình luận
routerAPI.post('/unlike-comment', postUnlikeComment); // bỏ thích bình luận
routerAPI.get('/posts/:id', authenticateToken, getPostDetailAPI); // lấy chi tiết bài viết
// routerAPI.get('/users/:id/posts', getUserPostsAPI); // lấy bài viết của người dùng

routerAPI.post('/users/login', postLogin);
routerAPI.post('/users/logout', postLogout);
routerAPI.post('/users/forgot-password', postForgotPassword);
routerAPI.get('/users/:id', getUserByIdAPIv2); // lấy thông tin người dùng theo id
routerAPI.post('/users/register', postRegister);
routerAPI.get('/user/profile', authenticateToken, getUserProfile);
routerAPI.get('/user/profile/posts', authenticateToken, getProfilePost);
routerAPI.get('/user/:id/posts', authenticateToken, getUserPosts);

// routerAPI.post('/like/:postId', likeControllerV2.likePost);
// routerAPI.post('/unlike/:postId', likeControllerV2.unlikePost);
// routerAPI.post('/:postId/status', likeControllerV2.isPostLiked);
// routerAPI.get('/:postId/count', likeControllerV2.countPostLikes);
// routerAPI.get('/:postId/users', likeControllerV2.getPostLikers);

//v3
routerAPI.post('/like/:targetId', authenticateToken, likeControllerv3.like);
routerAPI.post('/unlike/:targetId', authenticateToken, likeControllerv3.unlike);
routerAPI.get('/is-liked/:onModel/:targetId', authenticateToken, likeControllerv3.isLiked);
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


routerAPI.get('/:postId/author', authenticateToken, getPostAuthor);
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