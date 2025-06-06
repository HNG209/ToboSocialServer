const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const commentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],
    likeCount: { type: Number, default: 0 }, // Số lượng like của bình luận
    replyTo: { type: Schema.Types.ObjectId, ref: 'comment', default: null }, // dùng để xác định bình luận trả lời
    rootComment: { type: Schema.Types.ObjectId, ref: 'comment', default: null }, // Bình luận gốc nếu là bình luận trả lời
    isEdited: { type: Boolean, default: false }, // Trạng thái đã chỉnh sửa
    countReply: { type: Number, default: 0 },
}, {
    timestamps: true
});

commentSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;
