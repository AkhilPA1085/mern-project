const mongoose = require("mongoose")

const regSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cPassword:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    }
})

// create collection
const Register = new mongoose.model("Register",regSchema)

module.exports = Register