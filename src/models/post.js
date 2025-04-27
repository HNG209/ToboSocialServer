const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const mediaSchema = new Schema({
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    public_id: String // nếu dùng cloudinary
});

const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    caption: String,
    mediaFiles: [mediaSchema],
    likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
}, {
    timestamps: true
});

postSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Post = mongoose.model('post', postSchema);
module.exports = Post;
