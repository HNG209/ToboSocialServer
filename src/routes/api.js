const express = require('express')
const { getUserAPI, postCreateUser, putUpdateUserAPI, deleteUserAPI, postUploadSingleFileAPI, postUploadMultipleFileAPI } = require('../controllers/apiController')
const { postCustomerAPI, postManyCustomer, getAllCustomers, putUpdateCustomerAPI, deleteCustomerAPI, deleteArrayCustomerAPI } = require('../controllers/customerController')
const { postCreateProject, getAllProject, postProjectAPI, deleteProjectAPI } = require('../controllers/projectController')
const { postCreateTask, getAllTask, postTaskAPI, deleteTaskAPI } = require('../controllers/taskController')

const routerAPI = express.Router()

routerAPI.get('/', (req, res) => {
    res.send('hello')
})


routerAPI.get('/abc', (req, res) => {
    res.status(200).json({
        data: 'hello'
    })
})

routerAPI.get('/users', getUserAPI)
routerAPI.post('/users', postCreateUser)
routerAPI.put('/users', putUpdateUserAPI)
routerAPI.delete('/users', deleteUserAPI)

routerAPI.post('/file', postUploadSingleFileAPI)
routerAPI.post('/files', postUploadMultipleFileAPI)

routerAPI.post('/customers', postCustomerAPI)
routerAPI.post('/customers-many', postManyCustomer)
routerAPI.get('/customers', getAllCustomers)
routerAPI.put('/customers', putUpdateCustomerAPI)
routerAPI.delete('/customers', deleteCustomerAPI)
routerAPI.delete('/customers-many', deleteArrayCustomerAPI)
routerAPI.get('/info', (req, res) => {
    return res.status(200).json({
        data: req.query
    })
})

routerAPI.get('/info/:name/:address', (req, res) => {
    return res.status(200).json({
        data: req.params
    })
})


routerAPI.post('/projects', postCreateProject)
routerAPI.get('/projects', getAllProject)
routerAPI.put('/projects', postProjectAPI)
routerAPI.delete('/projects', deleteProjectAPI)

routerAPI.post('/tasks', postCreateTask)
routerAPI.get('/tasks', getAllTask)
routerAPI.put('/tasks', postTaskAPI)
routerAPI.delete('/tasks', deleteTaskAPI)

module.exports = routerAPI