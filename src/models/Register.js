const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

// token generation
regSchema.methods.generateToken = async function (){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token;
    } catch (error) {
        res.send("token error" + error)
        console.log("token error" + error)
    }
}

// password middleware
regSchema.pre("save",async function(next){
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
        this.cPassword = await bcrypt.hash(this.password,salt);
    }
        next()
})

// create collection
const Register = new mongoose.model("Register",regSchema)

module.exports = Register