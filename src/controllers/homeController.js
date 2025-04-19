const connection = require('../config/database')
const { getAllUsers, getUserById, updateUserByID, deleteUserByID } = require('../services/CRUDService')

const User = require("../models/user")

const getHomepage = async (req, res) => {
    let results = await User.find({})
    return res.render('home', { listUsers: results })
}

const getABC = (req, res) => {
    res.send('Hello World!')
}

const getHoidanit = (req, res) => {
    res.render('sample')
}

const postCreateUser = async (req, res) => {
    let { email, name, city } = req.body;

    await User.create({
        email, name, city
    })


    res.redirect('/')


}

const getCreatePage = (req, res) => {
    res.render('create.ejs')
}

const getUpdatePage = async (req, res) => {
    const userId = req.params.id

    let user = await User.findById(userId).exec()


    res.render('edit', { userEdit: user })
}

const postUpdateUser = async (req, res) => {
    let { userId, email, name, city } = req.body;

    await User.updateOne({ _id: userId }, { name, email, city })

    // res.send("Update success")
    res.redirect('/')
}

const postDeleteUser = async (req, res) => {
    const userId = req.params.id

    let user = await User.findById(userId).exec()

    res.render('delete', { userEdit: user })
}

const postHandleRemoveUser = async (req, res) => {

    const { userId } = req.body;

    await User.deleteOne({ _id: userId })

    res.redirect('/')
}

module.exports = {
    getHomepage, getABC, getHoidanit, postCreateUser, getCreatePage, getUpdatePage, postUpdateUser, postDeleteUser, postHandleRemoveUser
}