const express =require("express")
const app = express()
const session = require("express-session")
const { router } = require("./router")
const nocache = require("nocache")
const bodyParser =reqiure("body-parser")
const { v4: uuidv4} = require("uuid")
const port = 3000;
