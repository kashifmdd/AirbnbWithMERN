const mongoose = require('mongoose');
const data = require('./data.js');
const Listing = require('../models/listing.js');

main().then(() => {
    console.log("Database seeded successfully");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/bnbdatabase');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data was initialized");
};

initDB();