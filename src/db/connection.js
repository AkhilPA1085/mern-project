const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://akhil:akhil@cluster0.mmxwgnj.mongodb.net/userAuth?retryWrites=true&w=majority"
).then(()=>{
    console.log("db connected")
}).catch((err)=>{
    console.log(err);
});
