const EventVenueReservation = require("../models/eventVenueReservationModel");
const mongoose = require("mongoose");

// GET all eventVenueReservations
const getEventVenueReservations = async (req, res) => {
  const eventVenueReservations = await EventVenueReservation.find({}).sort({
    createdAt: -1,
  }); //descending order
  res.status(200).json(eventVenueReservations);
};

// GET eventVenueReservation
const getEventVenueReservation = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No eventVenueReservation found" });
  }

  const eventVenueReservation = await EventVenueReservation.findById(id);

  if (!eventVenueReservation) {
    return res.status(404).json({ error: "No eventVenueReservation found" });
  } else {
    return res.status(200).json(eventVenueReservation);
  }
};

// POST eventVenueReservation
const addEventVenueReservation = async (req, res) => {
  const {
    type,
    checkIn,
    checkOut,
    guest,
    package,
    guestCount,
    eventVenues,
    extras,
    paymentDetails,
    status,
    total,
  } = req.body;

  let emptyFields = [];

  if (!type) {
    emptyFields.push("type");
  }
  if (!checkIn) {
    emptyFields.push("checkIn");
  }
  if (!checkOut) {
    emptyFields.push("checkOut");
  }
  if (!guest) {
    emptyFields.push("guest");
  }
  if (!eventVenues) {
    emptyFields.push("eventVenues");
  }
  if (!extras) {
    emptyFields.push("extras");
  }
  if (!paymentDetails) {
    emptyFields.push("paymentDetails");
  }
  if (!status) {
    emptyFields.push("status");
  }
  if (!total) {
    emptyFields.push("total");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  //   add doc to db
  try {
    const eventVenueReservation = await EventVenueReservation.create({
      type,
      checkIn,
      checkOut,
      guest,
      package,
      guestCount,
      eventVenues,
      extras,
      paymentDetails,
      status,
      total,
    });
    res.status(200).json(eventVenueReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE eventVenueReservation
const deleteEventVenueReservation = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No eventVenueReservation found" });
  }

  const eventVenueReservation = await EventVenueReservation.findOneAndDelete(
    { _id: id },
    { new: true }
  );

  if (!eventVenueReservation) {
    return res.status(404).json({ error: "No eventVenueReservation found" });
  } else {
    return res.status(200).json(eventVenueReservation);
  }
};

// UPDATE eventVenueReservation
const updateEventVenueReservation = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No eventVenueReservation found" });
  }

  const eventVenueReservation = await EventVenueReservation.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!eventVenueReservation) {
    return res.status(404).json({ error: "No eventVenueReservation found" });
  } else {
    return res.status(200).json(eventVenueReservation);
  }
};

module.exports = {
  getEventVenueReservations,
  getEventVenueReservation,
  addEventVenueReservation,
  deleteEventVenueReservation,
  updateEventVenueReservation,
};
