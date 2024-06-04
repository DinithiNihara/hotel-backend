const RoomReservation = require("../models/roomReservationModel");
const mongoose = require("mongoose");

// GET all roomReservations
const getRoomReservations = async (req, res) => {
  const roomReservations = await RoomReservation.find({}).sort({
    createdAt: -1,
  }); //descending order
  res.status(200).json(roomReservations);
};

// GET roomReservation
const getRoomReservation = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No roomReservation found" });
  }

  const roomReservation = await RoomReservation.findById(id);

  if (!roomReservation) {
    return res.status(404).json({ error: "No roomReservation found" });
  } else {
    return res.status(200).json(roomReservation);
  }
};

// POST roomReservation
const addRoomReservation = async (req, res) => {
  const {
    type,
    checkIn,
    checkOut,
    guest,
    rooms,
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
  if (!rooms) {
    emptyFields.push("rooms");
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
    const roomReservation = await RoomReservation.create({
      type,
      checkIn,
      checkOut,
      guest,
      rooms,
      extras,
      paymentDetails,
      status,
      total,
    });
    res.status(200).json(roomReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE roomReservation
const deleteRoomReservation = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No roomReservation found" });
  }

  const roomReservation = await RoomReservation.findOneAndDelete(
    { _id: id },
    { new: true }
  );

  if (!roomReservation) {
    return res.status(404).json({ error: "No roomReservation found" });
  } else {
    return res.status(200).json(roomReservation);
  }
};

// UPDATE roomReservation
const updateRoomReservation = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No roomReservation found" });
  }

  const roomReservation = await RoomReservation.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!roomReservation) {
    return res.status(404).json({ error: "No roomReservation found" });
  } else {
    return res.status(200).json(roomReservation);
  }
};

module.exports = {
  getRoomReservations,
  getRoomReservation,
  addRoomReservation,
  deleteRoomReservation,
  updateRoomReservation,
};
