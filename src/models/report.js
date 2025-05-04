// report.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed'],
        default: 'pending'
    },
}, {
    timestamps: true
});

// Tắt strictPopulate để tránh lỗi nếu cần
reportSchema.set('strictPopulate', false);

const Report = mongoose.model('report', reportSchema);
module.exports = Report;