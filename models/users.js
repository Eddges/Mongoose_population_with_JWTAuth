var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new Schema({
    firstname : {
        type : String,
        default : ''
    },
    lastname : {
        type : 'String',
        default : ''
    },  
    facebookId : 'String',
    isAdmin : {
        type : Boolean,
        default : false
    }
})

userSchema.plugin(passportLocalMongoose)

var User = mongoose.model('User', userSchema)
module.exports = User;
