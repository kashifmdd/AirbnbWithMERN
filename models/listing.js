// Initialize databace

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default:"https://unsplash.com/photos/autumn-trees-arching-over-a-tranquil-canal-reflecting-colors-c659bBmJpw0",
        set: (v) => v ===""?"https://unsplash.com/photos/autumn-trees-arching-over-a-tranquil-canal-reflecting-colors-c659bBmJpw0": v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;