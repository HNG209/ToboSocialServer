const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // liên kết với bảng User
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // tạo createdAt, updatedAt
  }
);

module.exports = mongoose.model('Token', tokenSchema);
