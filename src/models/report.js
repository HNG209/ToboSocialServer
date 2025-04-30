const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reporter: { type: Schema.Types.ObjectId, ref: 'user', required: true },   // người gửi báo cáo
    post: { type: Schema.Types.ObjectId, ref: 'post', required: true },       // bài viết bị báo cáo
    reason: { type: String, required: true },                                 // lý do: spam, bạo lực...
    description: { type: String },                                            // mô tả chi tiết
    status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' }, // trạng thái xử lý
}, {
    timestamps: true
});

const Report = mongoose.model('report', reportSchema);
module.exports = Report;
