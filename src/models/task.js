const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete')

const projectSchema = new Schema({
    name: String,
    startDate: String,
    endDate: String,
    description: String,
})

const userSchema = new Schema({
    name: String,
    email: String,
    city: String
})

const taskSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: String,
        usersInfo: userSchema,
        projectInfo: projectSchema,
        status: String,
        startDate: String,
        endDate: String
    },
    {
        timestamps: true
    }
);

taskSchema.plugin(mongoose_delete, { overrideMethods: 'all' })

const Task = mongoose.model('task', taskSchema);
module.exports = Task;
