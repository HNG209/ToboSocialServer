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

module.exports = routerAPI