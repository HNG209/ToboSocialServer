const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const likeSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Nếu bạn muốn hỗ trợ soft delete (xóa mềm)
likeSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Like = mongoose.model('like', likeSchema);

module.exports = Like;
