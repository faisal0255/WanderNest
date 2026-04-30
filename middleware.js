module.exports.isLoggedIn = (req, res, next) => {
     if(!req.isAuthenticated()) {
        req.flash("error", "You must be loggedin for creating a Listing");
        return res.redirect("/login");
    }
    next();
}