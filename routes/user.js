const express = require("express");
const router =  express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl } = require("../middleware.js")

// Sign Up the user

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
});

router.post("/signup", async(req,res) => {
   try {
        let { username, email, password } = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register({email, username}, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
                req.flash("success", "Welcome to WanderNest");
                res.redirect("/listings");
        })
       
   } catch(e) {
    req.flash("error", e.message);
    res.redirect("/signup");
   }
});

// login the Users

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", 
    {failureRedirect: "/login",
    failureFlash: true}), async(req,res) =>{
    req.flash("success", "Welcome Back to the World of WonderNest");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

// Logout The use

router.get("/logout", (req, res, next) => {
   req.logout((err) =>{
    if(err) {
        return next(err);
    }
    req.flash("success", "You are loggedOut");
    res.redirect("/listings")
   });
});

module.exports = router;