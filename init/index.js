const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")
// console.log('image schema type:', Listing.schema.path('image').instance);

const Mongo_url = "mongodb://127.0.0.1:27017/wanderNest";

main()
    .then( () => {
        console.log("main is connected to DB")
    })
    .catch ((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect(Mongo_url)
}


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data is initialized in DB")
}

initDB();