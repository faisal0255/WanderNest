const express =  require("express");
const router = express.Router();

// For Users Specific

// index route
router.get("/", (req, res) =>{
    res.send("Hii i am index route");
});

// Show route
router.get("/:id", (req, res) =>{
    res.send("Hii i am show route");
});

// POST route
router.post("/", (req, res) =>{
    res.send("Hii i am post route");
});

// DELETE route
router.delete("/:id", (req, res) =>{
    res.send("Hii i am delete route");
});

module.exports = router;