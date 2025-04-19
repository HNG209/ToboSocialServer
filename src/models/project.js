const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: String,
    phone: String,
    email: String,
})

const userSchema = new Schema({
    name: String,
    email: String,
})

const projectSchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    description: String,
    customerInfor: customerSchema,
    usersInfor: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    leader: userSchema,
    tasks: [{ type: Schema.Types.ObjectId, ref: 'task' }]
});

const Project = mongoose.model('project', projectSchema);
module.exports = Project;
