'use strict'

//modelo de la tabla o de la consulta
const mongoose  = require('mongoose')
const Shema = mongoose.Schema

const ProductShema = Shema({
    name : String,
    picture:String,
    price:{type:Number,default:0},
    category:{type:String,enum:['computers','phones','accesories']},
    description:String

})

module.exports = mongoose.model('Product',ProductShema)