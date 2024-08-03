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

// Filter room reservations according to date
const filterRoomReservations = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    let filteredRoomReservations = [];

    if (checkIn && checkOut) {
      const checkInDate = moment(checkIn, "YYYY-MM-DD")
        .startOf("day")
        .format("YYYY-MM-DD");
      const checkOutDate = moment(checkOut, "YYYY-MM-DD")
        .endOf("day")
        .format("YYYY-MM-DD");

      // Find reservations that overlap with the given dates
      filteredRoomReservations = await RoomReservation.find({
        $or: [
          {
            checkIn: { $lte: checkInDate },
            checkOut: { $gte: checkInDate },
          },
          {
            checkIn: { $lte: checkOutDate },
            checkOut: { $gte: checkOutDate },
          },
          {
            checkIn: { $lte: checkInDate },
            checkOut: { $gte: checkOutDate },
          },
          {
            checkIn: { $gte: checkInDate },
            checkOut: { $lte: checkOutDate },
          },
        ],
      });
    } else {
      // If no dates are provided,  return all reservations or handle it differently
      filteredRoomReservations = await RoomReservation.find({});
    }

    res.status(200).json(filteredRoomReservations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
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
  // if (!total) {
  //   emptyFields.push("total");
  // }
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
  filterRoomReservations,
  addRoomReservation,
  deleteRoomReservation,
  updateRoomReservation,
};
