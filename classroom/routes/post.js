const exprees = require('express');
const router = exprees.Router();

router.get("/", (req, res) => {
    res.send("GETPost route");
});

router.get("/:id", (req, res) => {
    res.send("GETPost route with id:");
});

router.post("/", (req, res) => {
    res.send("POSTPost route");
});

router.delete("/:id", (req, res) => {
    res.send("DELETEPost route with id:");
});

module.exports = router;