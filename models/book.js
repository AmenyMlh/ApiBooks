const mongoose = require("mongoose")

const bookSchema = mongoose.Schema({
    title : {type : String, required : true},
    ISBN: {type : Number, required : true},
    author : {type : String, required : false},
    price : {type : Number, required : true},
})

module.exports = mongoose.model("books",bookSchema)