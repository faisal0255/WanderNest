const express = require("express");
const router =  express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl } = require("../middleware.js")
const userController = require("../controllers/users.js")

// Sign Up the user

router.get("/signup",userController.renderSignUpForm);

router.post("/signup", userController.signUp);

// login the Users

router.get("/login",userController.renderLogInForm);

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", 
    {failureRedirect: "/login",
    failureFlash: true}), userController.logIn);

// Logout The use

router.get("/logout",userController.logOut);

module.exports = router;