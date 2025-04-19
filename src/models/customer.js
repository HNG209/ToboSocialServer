const { default: mongoose } = require("mongoose");
const mongoose_delete = require('mongoose-delete')

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: String,
        city: String,
        address: String,
        image: String,
        description: String,


    },
    {
        timestamps: true,
        statics: {
            // findByPhuong(name) {
            //     return this.find({ name: new RegExp(name, 'i') })
            // }
        }

    }
)

customerSchema.plugin(mongoose_delete, { overrideMethods: 'all' })

const customer = mongoose.model("customer", customerSchema);


module.exports = customer;