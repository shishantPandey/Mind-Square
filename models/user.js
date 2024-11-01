const mongooes= require('mongoose');
mongooes.connect("mongodb+srv://shishantpandeyofficial:o0MnTa8HfmwtrZvi@mycluster.7tjuw.mongodb.net/mindSquare")
const userSchema = mongooes.Schema({
    username: String,
    email: String,
    password: String,
    monthlyFees: {
        January: { type: Number, default: 0 },
        February: { type: Number, default: 0 },
        March: { type: Number, default: 0 },
        April: { type: Number, default: 0 },
        May: { type: Number, default: 0 },
        June: { type: Number, default: 0 },
        July: { type: Number, default: 0 },
        August: { type: Number, default: 0 },
        September: { type: Number, default: 0 },
        October: { type: Number, default: 0 },
        November: { type: Number, default: 0 },
        December: { type: Number, default: 0 },
    },
})
module.exports = mongooes.model('user',userSchema);