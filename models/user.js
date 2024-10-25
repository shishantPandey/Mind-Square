const mongooes= require('mongoose');
mongooes.connect("mongodb+srv://shishantpandeyofficial:o0MnTa8HfmwtrZvi@mycluster.7tjuw.mongodb.net/")
const userSchema = mongooes.Schema({
    username: String,
    email: String,
    password: String,
})
module.exports = mongooes.model('user',userSchema);