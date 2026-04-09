const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

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

    // Root Route
app.get ("/", (req, res) => {
    res.send("Hii This is Home route")
});


// Testing route for inserting a Data
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing ({
//         title: "My New Bunglow",
//         description: " Neat the Madison Squire Garden",
//         price: 7000,
//         location: " Chapra, Saran",
//         country: "India",
//     })

//    await sampleListing.save();
//    console.log("Sample is saved");
//    res.send("sample Listing is saved")
// })

// Index Route

app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    // res.render("/listings/index.ejs", {allListings});
    res.render("listings/index", { allListings });

}));

// NEw Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

// Show Route
app.get("/listings/:id",wrapAsync (async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing })
}))

//Create Route
app.post("/listings",wrapAsync (
     async (req,res, next) => {
        if(!req.body.Listing) {
            throw new ExpressError(400, "Send valid Data")
        }
    
    // let { title, description, price, image, location, country } = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}
));

// Edit Route
app.get("/listings/:id/edit",wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))

// Update Route
app.put("/listings/:id",wrapAsync (async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect("/listings")

}))

// Delete Route
app.delete("/listings/:id", wrapAsync (async(req, res) => {
    let { id } = req.params;
    let deletedLisitng = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log("Listing is Deleted Successfully")
}))



// handling all invalid route

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

// Custom error handler

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong" } = err;
    res.render("error.ejs", {err});
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("app is listening")
})