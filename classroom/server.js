const express =  require("express");
const app = express();
const users = require("./routes-2/user.js");
const posts = require("./routes-2/post.js");
const session = require("express-session");
const flash =  require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
};

app.get("/", () =>{
        res.send("Hii i am root route");
});

app.use(session(sessionOptions));
app.use(flash());

app.use("/users", users);
app.use("/posts", posts);

app.get("/register", (req, res) => {
    let { name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success", "User registered succesfully")
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {

    res.render("page.ejs", {name: req.session.name, msg: req.flash("success")});
})

app.get("/reqcount", (req, res) => {
    if(req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1
    }
    res.send(`You send a request ${req.session.count} times`);
})

app.get("/test", (req, res) => {
    res.send("Test successful");
})


app.listen(3000, () => {
    console.log("server is listening to port 3000")
})