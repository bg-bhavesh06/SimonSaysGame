require("dotenv").config();

//require the Express..
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

//Express-Session
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  }),
);
//require the mongoose
const mongoose = require("mongoose");

//models require Schema
const games = require("./models/Fmodel.js");

//for the views_folders
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//for the public folders
app.use(express.static(path.join(__dirname, "public")));

//for parse the data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//CustomError require
const ExpressError = require("./utils/customError.js");

//WrapAsync Error
const WrapAsync = require("./utils/wrapAsync.js");

//validateUser
function validateUser(req, res, next) {
  if (!req.body.listing) {
    return next(new ExpressError(400, "User data missing"));
  }
  next();
}

//mongoose connection code
const MONGO_URL = process.env.MONGO_URL;
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DataBase Connected...");
  } catch (error) {
    console.error("DataBase Connection Faild : ", error.message);
  }
}
main();

//home route
app.get("/", (req, res) => {
  res.render("how_Play.ejs");
});

app.get("/home", (req, res) => {
  let name = req.session.username;
  res.render("index.ejs", { message: null, name: name || null });
});

//for the login A1
app.get("/login", (req, res) => {
  res.render("login.ejs", { error: null, gmail: "" });
});

async function checkLogin(req, res, next) {
  try {
    let { gmail, password } = req.body.listing;
    let user = await games.findOne({ gmail });
    if (!user) {
      return res.render("login.ejs", {
        error: "Can't Found Email. Try Again",
        gmail,
      });
    }
    if (password !== user.password) {
      return res.render("login.ejs", {
        error: "Incorrect Password",
        gmail,
      });
    }
    req.session.username = user.FullName;

    //if Both is correct then call the next();
    next();
  } catch (err) {
    next(err);
  }
}

//for the logine A2....
app.post("/login", checkLogin, async (req, res) => {
  res.render("index.ejs", {
    message: "Login Successful",
    name: req.session.username,
  });
});

//for the singup B1
app.get("/singup", (req, res) => {
  res.render("singup.ejs", { error: null });
});

// for the singup B2....
app.post(
  "/singup",
  validateUser,
  WrapAsync(async (req, res) => {
    const { gmail } = req.body.listing;
    let user = await games.findOne({ gmail });
    if (user) {
      return res.render("singup.ejs", {
        error: "Email Exist.Try to ",
      });
    }
    let Newuser = new games({ ...req.body.listing });
    let ans = await Newuser.save();
    req.session.username = ans.FullName;
    res.render("index.ejs", {
      message: "SingUp Successful",
      name: req.session.username,
    });
  }),
);

//password forgot route
app.get("/forget", (req, res) => {
  res.render("forgot.ejs");
});

//page not found
app.use((req, res) => {
  res.status(404).render("PageError.ejs");
});

//Error Handling Middlerware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).render("middlewareError.ejs", { message });
});

app.listen(PORT, () => {
  console.log("Server is Start" + PORT);
});
