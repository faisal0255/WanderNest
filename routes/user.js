const express = require("express");
const router =  express.Router();
const User = require("../models/user.js")

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
});

router.post("/signup", async(req,res) => {
   try {
        let { username, email, password } = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register({email, username}, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to WanderNest");
        res.redirect("/listings");
   } catch(e) {
    req.flash("error", e.message);
    res.redirect("/signup");
   }
})

module.exports = router;