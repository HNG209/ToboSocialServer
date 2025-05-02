// notification.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'user' },
    type: { type: String, enum: ['warning', 'info', 'post', 'comment'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedEntity: {
        type: Schema.Types.ObjectId,
        refPath: 'relatedEntityModel'
    },
    relatedEntityModel: {
        type: String,
        enum: ['post', 'comment', 'report', null]
    },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true
});

notificationSchema.set('strictPopulate', false);


const Notification = mongoose.model('notification', notificationSchema);
module.exports = Notification;