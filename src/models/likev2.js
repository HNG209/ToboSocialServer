const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const likeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },

  // Tham chiếu động: có thể là post hoặc comment
  target: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },

  // Tên model được tham chiếu: 'post' hoặc 'comment'
  onModel: {
    type: String,
    required: true,
    enum: ['post', 'comment']
  },
}, {
  timestamps: true
});

// Xoá mềm
likeSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

// Một user chỉ được like 1 lần cho 1 đối tượng
likeSchema.index({ user: 1, target: 1, onModel: 1 }, { unique: true });

const Like = mongoose.model('like', likeSchema);

module.exports = Like;
