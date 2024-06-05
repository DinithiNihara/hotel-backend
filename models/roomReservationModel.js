const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentDetailsSchema = new mongoose.Schema({
  payment: String,
  cost: Number,
  type: String,
  date: Date,
});

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
    rooms: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Room",
      },
    ],
    extras: [
      {
        extraId: Number,
        name: String,
        cost: Number,
        costText: String,
      },
    ],
    paymentDetails: [paymentDetailsSchema],
    status: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomReservation", roomReservationSchema);
