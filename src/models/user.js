const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    city: String
})
const user = mongoose.model("user", userSchema);
// const cat = new Kitten({ name: 'Silence' });
// cat.save();

module.exports = user;