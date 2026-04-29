const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require("express-session")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require ("./models/user.js");

app.use(cookieParser("secretcode"));

// Requiring listings code to main app file

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const { log } = require("console");
const { Http2ServerRequest } = require("http2");


// Setting/Connecting the Database

const Mongo_url = "mongodb://127.0.0.1:27017/wanderNest";


async function main() {
    await mongoose.connect(Mongo_url)
}
main()
    .then( () => {
        console.log("main is connected to DB")
    })
    .catch ((err) => {
        console.log(err)
    })
    
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))
app.use(cors());
app.use(express.json());

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie : {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000, // + days * hour/day * min/hour * sec/min * milisec/min 
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
}

    // Root Route
app.get ("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hii This is Home route")
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// using static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/demouser",async (req, res) => {
    let fakeUser = new User( {
        email: "myname@gmail.com",
        username: "local-user"
    });
    let registeredUser = await User.register(fakeUser, "mynameislocal");
    res.send(registeredUser)
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Cookies

app.get("/getcookies", (req,res) => {
    res.cookie("Hello", "cookie");
    res.cookie("name", "Faisal");
    res.send("Hii receive this cookie");
});

// Sending Cookies by terminal

app.get("/greet", (req, res) => {
    let { name = "aunonanemous" } = req.cookies;
    console.dir(`Hi ${name}`);
    res.send(`Hiii ${name}`);
});

// Sending signed cookies

app.get("/getsignedcookies", (req, res) => {
    res.cookie("color", "Red", {signed : true});
    res.send("Signed cookie send");
});

// Verify signed cookies

app.get("/verify", (req, res) =>{
    console.log(req.signedCookies);
    res.send("Cookie Verified..!")
})

// handling all invalid route

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

// Custom error handler

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("app is listening")
})