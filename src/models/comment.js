const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const commentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true }
}, {
    timestamps: true
});

commentSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;
