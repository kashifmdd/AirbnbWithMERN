const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const Listing = require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const { get } = require('http');
const wrapAsync = require('./utils/wrapAsync.js');
// const ExpressError = require('./utils/ExpressError.js');
// const { listingSchema, reviewSchema } = require('./schema.js');
// const Review = require('./models/review.js');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const session = require("express-session");
const flash = require("connect-flash");


main().then(()=>{
    console.log("Database connected");
}).catch(err => {
    console.error("Database connection error:", err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/bnbdatabase');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    }
};

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(session(sessionOption));
app.use(flash());
// flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// listing routes
app.use("/listings", listingRoutes);

// review routes
app.use("/listings/:id/reviews", reviewRoutes);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // res.render("error.ejs");
    res.status(statusCode).render("error.ejs",{err});
});

// app.get("/testListing", (req, res) => {
//     const sampleListing = new Listing({
//         title: "Cozy Cottage",
//         description: "A charming cottage in the countryside.",
//         price: 12000,
//         location: "Countryside",
//         country: "USA"
//     });
//     sampleListing.save().then(() => {
//         console.log("Sample listing saved");
//         res.send("successfull testing");
//     }).catch(err => {        
//         console.error("Error saving sample listing:", err);
//         res.status(500).send("Error saving sample listing");
//     });
// });

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});