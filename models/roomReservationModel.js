const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomReservationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guest: {
      type: mongoose.Types.ObjectId,
      ref: "Guest",
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomReservation", roomReservationSchema);
