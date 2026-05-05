// I am using Express Router for restructuring my code 

const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController  = require("../controllers/listings.js");


// Index Route

router.get("/", wrapAsync(listingController.index));

// NEw Route
router.get("/new",isLoggedIn, listingController.renderNewForm)

// Show Route
router.get("/:id",wrapAsync (listingController.showListings))

//Create Route
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync (listingController.createListings));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync (listingController.renderEditForm));

// Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync (listingController.updateListing))

// Delete Route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync (listingController.destroyListing));

module.exports = router;