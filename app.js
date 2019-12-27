//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// require moongose 
const mongoose = require("mongoose");
// require mongoose encryption
const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// connect to the mongoDB server and create or use the database

mongoose.connect("mongodb://localhost:27017/secretsUserDB");

//user schema created with the mongoose schema
const userSchema = new mongoose.Schema({
    email:String ,
    password: String
});

 //**** encrypt shema first ****//

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});
 //**** encrypt shema first ****//

const userColModel = new mongoose.model("User",userSchema);

app.get("/",function(req, res){
    
    res.render("home");
})
app.get("/login",function(req, res){
    
    res.render("login");
})
app.get("/register",function(req, res){
    
    res.render("register");
})

app.post("/register", function(req, res){
    
    const newUser = new userColModel({
        email: req.body.username,
        password : req.body.password
    });
    
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else {
            res.render("secrets");
        }
    });
});



app.post("/login",function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    
    userColModel.findOne({email:username},function(err, foundUser){
        if (err){
            console.log(err);
        }else {
            if (foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});






















app.listen(3000, function () {
    console.log("Server started on port 3000");
});