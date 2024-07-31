const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentDetailsSchema = new mongoose.Schema({
  payment: String,
  cost: Number,
  type: String,
  date: Date,
});

const eventVenueReservationSchema = new Schema(
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
    eventVenues: [
      {
        type: mongoose.Types.ObjectId,
        ref: "EventVenue",
      },
    ],
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
    bookingNo: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to set the booking number
eventVenueReservationSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    try {
      // Find the highest booking number in the collection
      const lastReservation = await mongoose
        .model("EventVenueReservation")
        .findOne({}, { bookingNo: 1 })
        .sort({ bookingNo: -1 });

      // Increment the highest booking number by 1
      doc.bookingNo = lastReservation ? lastReservation.bookingNo + 1 : 1;

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});
module.exports = mongoose.model("EventVenueReservation", eventVenueReservationSchema);
