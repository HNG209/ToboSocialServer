
const User = require("../models/user")
const { uploadSingleFile, uploadMultipleFiles } = require("../services/fileService")

const getUserAPI = async (req, res) => {
    let results = await User.find({})

    return res.status(200).json({
        errorCode: 0,
        data: results
    })
}

const postCreateUser = async (req, res) => {
    let { email, name, city } = req.body;

    let user = await User.create({
        email, name, city
    })

    return res.status(200).json({
        errorCode: 0,
        data: user
    })
}

const putUpdateUserAPI = async (req, res) => {
    let { userId, email, name, city } = req.body;

    let user = await User.updateOne({ _id: userId }, { name, email, city })

    return res.status(200).json({
        errorCode: 0,
        data: user
    })
}


const deleteUserAPI = async (req, res) => {
    const { userId } = req.body;

    let rs = await User.deleteOne({ _id: userId })

    return res.status(200).json({
        errorCode: 0,
        data: rs
    })
}

const postUploadSingleFileAPI = async (req, res) => {
    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No file')
    }

    let rs = await uploadSingleFile(req.files.image)

    return res.status(200).json({
        errorCode: 0,
        rs: rs
    })
}

const postUploadMultipleFileAPI = async (req, res) => {
    if (!req.files || !req.files.images) {
        return res.status(400).send("No files uploaded");
    }

    const result = await uploadMultipleFiles(req.files.images);

    return res.status(200).json({
        errorCode: 0,
        result: result
    });
};


module.exports = {
    getUserAPI, postCreateUser, putUpdateUserAPI, deleteUserAPI, postUploadSingleFileAPI, postUploadMultipleFileAPI
}