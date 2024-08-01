const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventVenueSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    venueNo: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    image: {
      type: String, 
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventVenue", eventVenueSchema);
