const Customer = require("../models/customer");
const aqp = require('api-query-params')

module.exports = {
    createCustomerService: async ({ name, address, phone, email, description, image }) => {
        try {
            let rs = await Customer.create({ name, address, phone, email, description, image })
            return rs
        } catch (error) {
            console.log(error);
            return null
        }
    },

    createArrayCustomerService: async (arr) => {
        try {
            let rs = await Customer.insertMany(arr)
            return rs
        } catch (error) {
            console.log(error);

        }
    },

    getAllCustomerService: async (limit, page, name, queryString) => {
        try {
            let rs;
            if (limit && page) {
                limit = parseInt(limit);
                page = parseInt(page);
                let offset = (page - 1) * limit;

                const { filter, skip } = aqp(queryString);
                delete filter.page

                rs = await Customer.find(filter).skip(offset).limit(limit).exec();

            } else {
                rs = await Customer.find({});
            }
            return rs;
        } catch (error) {
            console.error("getAllCustomerService error:", error);
            throw error;
        }
    },


    putUpdateCustomerAPIService: async ({ cusId, name, address, email }) => {
        try {
            let rs = await Customer.updateOne({ _id: cusId }, { name, address, email })
            return rs
        } catch (error) {
            console.log(error);

        }
    },

    deleteCustomerService: async (id) => {
        try {
            let rs = await Customer.deleteById(id)
            return rs
        } catch (error) {
            console.log(error);

        }
    },
    deleteArrayCustomerAPIService: async (arr) => {
        try {
            let rs = await Customer.deleteMany({ _id: { $in: arr } })
            return rs
        } catch (error) {
            console.log(error);

        }
    },
}