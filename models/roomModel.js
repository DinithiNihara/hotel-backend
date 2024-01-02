const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
    },
    beds: {
      type: String,
      required: true,
    },
    extraBed: {
      type: String,
      required: true,
    },
    occupancy: {
      type: String,
      required: true,
    },
    bathrooms: {
      type: String,
      required: true,
    },
    groundSpace: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
