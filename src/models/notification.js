const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const notificationSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true
});

notificationSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
