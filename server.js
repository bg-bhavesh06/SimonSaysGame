require("dotenv").config();

//require the Express..
const express = require("express");
const app = express();

//require the mongoose
const mongoose = require("mongoose");

//Express-Session
const session = require("express-session");

//Ports From the .env files
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

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

//Express Session-Store
const MongoStore = require("connect-mongo").default;

//Cache middleware
function noCache(req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
    },
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }),
);

//validateUser
function validateUser(req, res, next) {
  if (!req.body.listing) {
    return next(new ExpressError(400, "User data missing"));
  }
  next();
}

//mongoose connection code
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
  if (req.session.isLoggedIn) {
    return res.redirect("/home");
  }
  res.render("how_Play.ejs", { isLoggedIn: req.session.isLoggedIn || false });
});

//This will be show that how to play...
app.get("/how-to-play", (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.render("how_Play.ejs", { isLoggedIn: false });
  }
  res.render("how_Play.ejs", { isLoggedIn: true });
});

// this Privlients the direct assing to home Route;
function isAuthenticated(req, res, next) {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
}

app.get("/home", isAuthenticated, noCache, (req, res) => {
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
    req.session.isLoggedIn = true; // for the back to game route
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
app.get("/signup", (req, res) => {
  res.render("singup.ejs", { error: null });
});

// for the singup B2....
app.post(
  "/signup",
  validateUser,
  WrapAsync(async (req, res, next) => {
    try {
      const { gmail } = req.body.listing;
      let user = await games.findOne({ gmail });
      if (user) {
        return res.render("singup.ejs", {
          error: "Email Exist Try to ",
        });
      }
      let Newuser = new games({ ...req.body.listing });
      let ans = await Newuser.save();
      req.session.username = ans.FullName;
      req.session.isLoggedIn = true; // for back to game route
      res.render("index.ejs", {
        message: "SingUp Successful",
        name: req.session.username,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        if (error.errors.password) {
          return res.render("singup.ejs", {
            error: error.errors.password.message,
          });
        }
      }
      next(error);
    }
  }),
);

//Logout-route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

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
