const mongooes= require('mongoose');
mongooes.connect("mongodb://127.0.0.1:27017/mindsquare")
const userSchema = mongooes.Schema({
    username: String,
    email: String,
    password: String,
})
module.exports = mongooes.model('user',userSchema);