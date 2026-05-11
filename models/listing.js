const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  // image: {
  //   type: String,
  //   default: "https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc",
  //   set: (v) =>
  //     v === " "
  //       ? "https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc"
  //       : v,
  // },

image: {
    filename: String,
    url : String
  },

  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type : Schema.Types.ObjectId,
    ref: "User"
  }
});

listingSchema.post("findOneAndDelete", async(listing)=> {
  if (listing) {
    await Review.deleteMany({_id: {$in: listing.reviews }});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


