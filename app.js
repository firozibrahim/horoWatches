const express =require("express")
const app = express()
const session = require("express-session")
const adminrouter= require("./router/adminrouter")
const  userrouter = require("./router/userrouter")
const nocache = require("nocache")
const { v4: uuidv4} = require("uuid")
const mongoose = require("mongoose")
const connectDB = require("./config/connection.js")
require("dotenv").config();
const port = 3001;

app.use(require('cors')())
app.use(nocache())
app.use(express.urlencoded({ extended:true }));
app.use(express.json())
app.set("view engine","ejs")

app.use(express.static("public"))
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true,
}));    

app.use("/",userrouter);
app.use("/admin",adminrouter);

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
});