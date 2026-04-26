const express =  require("express");
const app = express();
const users = require("./routes-2/user.js");
const posts = require("./routes-2/post.js");
const session = require("express-session");

app.get("/", () =>{
        res.send("Hii i am root route");
});

app.use(session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
}));

app.use("/users", users);
app.use("/posts", posts);



app.get("/test", (req, res) => {
    res.send("Test successful");
})


app.listen(3000, () => {
    console.log("server is listening to port 3000")
})