const exprees = require('express');
const router = exprees.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');
const Listing = require('../models/listing.js');




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
router.get("/", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// New Route
router.get("/new", (req, res) => { 
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "This listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
    })
);

// Create Route
router.post("/", validateListing,wrapAsync(async (req, res) =>{
    // let result = listingSchema.validate(req.body);
    // if(result.error) {
    //     throw new ExpressError(400, "Invalid Listing Data");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    })
);

//Edit route--------------------------------
router.get("/:id/edit", validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Edit Listings!");
    res.render("listings/edit.ejs", {listing});

}));

//Update route -------------------------------
router.put("/:id", validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Update Listings!");
    res.redirect(`/listings/${id}`);
}));

//delete route----------------------
router.delete("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Delete Listings!");
    res.redirect("/listings");
}));


module.exports = router;