const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const followerSchema = new Schema({
    subject: { type: Schema.Types.ObjectId, ref: 'user' },
    following: { type: Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true })

followerSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Follower = mongoose.model('follower', followerSchema);
module.exports = Follower;