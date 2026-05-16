const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("GETUser route");
});

router.get("/:id", (req, res) => {
    res.send("GETUser route with id:");
});

router.post("/", (req, res) => {
    res.send("POSTUser route");
});

router.delete("/:id", (req, res) => {
    res.send("DELETEUser route with id:");
});

module.exports = router;