const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const storySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    public_id: String, // dùng cho cloudinary
    expiresAt: { type: Date, required: true }
}, {
    timestamps: true
});

storySchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
