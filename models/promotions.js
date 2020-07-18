const mongoose = require('mongoose')
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency

const promotionsSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : ''
    },
    label : {
        type : String,
        default : ''
    },
    price : {
        type : Currency,
        required : true
    },
    description : {
        type : String,
        default : ''
    },
    featured : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})

var Promos =  mongoose.model('Promo', promotionsSchema)

module.exports = Promos