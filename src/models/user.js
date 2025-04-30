const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const profileSchema = new Schema({
    bio: String,
    website: String,
    avatar: String, // ảnh đại diện
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' }
});

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    phone: String,

    profile: profileSchema,

    followers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'user' }],

    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },

    postCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const User = mongoose.model('user', userSchema);
module.exports = User;
