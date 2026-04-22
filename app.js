const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const cors = require('cors');
// const { listingSchema, reviewSchema  } = require("./schema.js");
// const review = require("./models/review.js");

// Requiring listings code to main app file

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

    // Root Route
app.get ("/", (req, res) => {
    res.send("Hii This is Home route")
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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