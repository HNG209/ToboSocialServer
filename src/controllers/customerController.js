const { createCustomerService, createArrayCustomerService, getAllCustomerService, putUpdateCustomerAPIService, deleteCustomerService, deleteArrayCustomerAPIService } = require("../services/CustomerService");
const { uploadSingleFile } = require("../services/fileService");
const Joi = require('joi')

module.exports = {
    postCustomerAPI: async (req, res) => {
        let { name, address, phone, email, description } = req.body

        // const customerSchema = Joi.object({
        //     name: Joi.string().min(2).max(50).required(),
        //     address: Joi.string().allow('', null),
        //     phone: Joi.string().pattern(/^[0-9]{9,11}$/).required(),
        //     email: Joi.string().email().required(),
        //     description: Joi.string().allow('', null)
        // });

        // const {error} = customerSchema.validate(req.body, {abortEarly: false})

        console.log({ name, address, phone, email, description });

        let imgUrl = ""

        if (!req.files || Object.keys(req.files).length === 0) {
            // return res.status(400).send('no file img')
        } else {
            let rs = await uploadSingleFile(req.files.image)
            imgUrl = rs.path
        }

        let customerData = { name, address, phone, email, description, image: imgUrl }

        let customer = await createCustomerService(customerData)

        return res.status(200).json({
            errorCode: 0,
            result: customer
        });
    },

    postManyCustomer: async (req, res) => {

        let customers = await createArrayCustomerService(req.body.customer)

        if (customers) {
            res.status(200).json({
                errorCode: 0,
                result: customers
            });
        } else {
            res.status(200).json({
                errorCode: -1,
                result: customers
            });
        }
    },

    getAllCustomers: async (req, res) => {
        let { page, limit, name } = req.query

        let rs = null
        if (limit && page) {
            rs = await getAllCustomerService(limit, page, name, req.query)
        } else {
            rs = await getAllCustomerService()


        }

        res.status(200).json({
            errorCode: 0,
            result: rs
        });


    },

    putUpdateCustomerAPI: async (req, res) => {
        const { cusId, name, email, address } = req.body
        let customers = await putUpdateCustomerAPIService({ cusId, name, email, address })

        if (customers) {
            res.status(200).json({
                errorCode: 0,
                result: customers
            });
        } else {
            res.status(200).json({
                errorCode: -1,
                result: customers
            });
        }
    },

    deleteCustomerAPI: async (req, res) => {
        // res.send("aaa")
        let id = req.body.id

        let rs = await deleteCustomerService(id)
        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },

    deleteArrayCustomerAPI: async (req, res) => {
        // res.send("aaa")
        let arr = req.body.customerId

        let rs = await deleteArrayCustomerAPIService(arr)

        res.status(200).json({
            errorCode: 0,
            result: rs
        });
    },
}