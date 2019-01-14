var mongoose = require('mongoose')
var Schema = mongoose.Schema

var TweetSchema = new Schema(
    {
        autor: {type: String, required: true},
        hash: {type: String, required: true},
        texto: {type: String, required: true},
        gostos: {type: Number, required: false}
    }
)

//model called MyApp will follow userSchema and save to the users collection

module.exports = mongoose.model('MyTwitter', TweetSchema, 'tweets')