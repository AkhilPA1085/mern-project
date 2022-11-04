const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 5000
const hbs = require("hbs")
require("./db/connection")
const {json} = require("express")

const Register = require("./models/Register")

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../template/views")
const partials_path = path.join(__dirname, "../template/partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path)


app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

// user registration
app.post("/register",async (req,res)=>{
    try {
        const password = req.body.password
        const confirmPassword = req.body.cPassword
        console.log(password,confirmPassword);
        if(password === confirmPassword){

            const newUser = new Register({
                username:req.body.username,
                email:req.body.email,
                phone:req.body.phone,
                password:password,
                cPassword:confirmPassword,
            })

            await newUser.save()
            res.status(201).render("login")
        }
        else{
            res.send("Invalid credentials")
        }
    } catch (error) {
        res.status(500).send("Invalid credentials")
    }
})

// user login
app.post("/login",async(req,res)=>{
    try{
        const email = req.body.email
        const password = req.body.password

        const registeredEmail = await Register.findOne({email:email})
        // res.send(registeredEmail.password)
        if(registeredEmail.password === password){
            res.status(200).render("index")
        }else{
            res.send("Invalid credentials")
        }
    }catch(error){
        res.status(500).send("Invalid credentials")
    }
})








app.listen(port,()=>{console.log(`port ${port} is running`)})