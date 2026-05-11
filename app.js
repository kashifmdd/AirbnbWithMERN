const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { get } = require('http');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');

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

app.get("/", (req, res) => {
    res.send("Hello World");
});

// define middleware to validate listing data
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// Index Route 
app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// New Route
app.get("/listings/new", (req, res) => { 
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", validateListing, wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
    })
);

// Create Route
app.post("/listings", validateListing,wrapAsync(async (req, res) =>{
    let result = listingSchema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    })
);

//Edit route--------------------------------
app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});

}));

//Update route -------------------------------
app.put("/listings/:id", validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route----------------------
app.delete("/listings/:id", validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render("error.ejs");
    // res.status(statusCode).send(message);
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