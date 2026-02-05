//Dependencies:
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares:
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

//Routes:
const signup_Route = require("./routes/signup.js");

//Paths:
app.use("/signup", signup_Route);


//Connecting to Database & Starting App:
mongoose.connect(process.env.MONGODB)
    .then(() =>
    {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log("Cafe Backend running at PORT:", PORT));
    });