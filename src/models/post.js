const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const mediaSchema = new Schema({
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    public_id: String // nếu dùng cloudinary
});

const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption: String,
    mediaFiles: [mediaSchema],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {
    timestamps: true
});

postSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
