const express =  require("express");
const router = express.Router();

// For Post Specific

// index Post route
router.get("/", (req, res) =>{
    res.send("Hii i am index route");
});

// Show Post route
router.get("/:id", (req, res) =>{
    res.send("Hii i am show route");
});

// POST Post route
router.post("/", (req, res) =>{
    res.send("Hii i am post route");
});

// DELETE Post route
router.delete("//:id", (req, res) =>{
    res.send("Hii i am delete route");
});

module.exports = router;