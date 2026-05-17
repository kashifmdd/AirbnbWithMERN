const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
// const wrapAsync = require('../utils/wrapAsync.js');
// const {userSchema} = require("../schema.js");

// const validateUser = (req, res, next) => {
//     const { error } = userSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400, msg);
//     } else {
//         next();
//     }
// };

router.get("/signup", (async(req, res) => {
    res.render("users/signup.ejs");
}));

router.post("/signup", async(req, res) =>{
    try{
        let { username, email, password } = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to Airbnb!");
    res.redirect("/listings");
    }catch(err){
        req.flash("error", "User already register!");
        res.redirect("/signup");
    }
})


router.get("/login", (async(req, res) => {
    res.render("users/login.ejs");
}));

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),
async(req, res) =>{
    res.send("Welcome to Airbnb")
})

module.exports = router;