require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 5000;
const hbs = require("hbs");
require("./db/connection");
const { json } = require("express");
const bcrypt = require("bcryptjs");

const Register = require("./models/Register");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");

console.log(process.env.SECRET_KEY);
console.log(process.env.MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// user registration
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmPassword = req.body.cPassword;
    if (password === confirmPassword) {
      const newUser = new Register({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: password,
        cPassword: confirmPassword,
      });

      console.log("success part", newUser);

      const token = await newUser.generateToken();
      console.log("token app", token);

      const registeredUser = await newUser.save();
      console.log("registeredUser", registeredUser);
      res.status(201).render("index");
    } else {
      res.send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// user login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const registeredEmail = await Register.findOne({ email: email });

    const token = await registeredEmail.generateToken();
    console.log("token login", token);

    if (registeredEmail) {
      const validatePassword = await bcrypt.compare(
        password,
        registeredEmail.password
      );
      if (validatePassword) {
        res.status(200).render("index");
      } else {
        res.send("incorrect password");
      }
    } else {
      res.send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Invalid credentials");
  }
});

app.listen(port, () => {
  console.log(`port ${port} is running`);
});
