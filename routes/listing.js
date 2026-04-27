// I am using Express Router for restructuring my code 

const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");


// Validating listing converted in middleware

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);  
    if(error) {
        let errMsg = error.details.map((el) => el.message ).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

// Index Route

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    // res.render("/listings/index.ejs", {allListings});
    res.render("listings/index", { allListings });

}));

// NEw Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

// Show Route
router.get("/:id",wrapAsync (async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}))

//Create Route
router.post("/",
    validateListing,
    wrapAsync (
     async (req,res, next) => {
   
    // let { title, description, price, image, location, country } = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Added")
    res.redirect("/listings");
}
));

// Edit Route
router.get("/:id/edit",wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })
}))

// Update Route
router.put("/:id",
    validateListing,
    wrapAsync (async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    req.flash("success", "Listing Updated Successfully")
    res.redirect(`/listings/${id}`)

}))

// Delete Route
router.delete("/:id", wrapAsync (async(req, res) => {
    let { id } = req.params;
    let deletedLisitng = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully")
    res.redirect("/listings");
    console.log("Listing is Deleted Successfully")
   
}));

module.exports = router;