const mongoose = require("mongoose");
const moment = require("moment");
const Room = require("../models/roomModel");
const RoomReservation = require("../models/roomReservationModel");

// GET all rooms
const getRooms = async (req, res) => {
  const rooms = await Room.find({}).sort({ createdAt: -1 }); //descending order
  res.status(200).json(rooms);
};

// GET available rooms
const getAvailableRooms = async (req, res) => {
  const { checkIn, checkOut } = req.query;

  // Parse dates using moment.js
  const checkInDate = moment(checkIn, "YYYY-MM-DD").format("YYYY-MM-DD");
  const checkOutDate = moment(checkOut, "YYYY-MM-DD").format("YYYY-MM-DD");

  try {
    // Get all room reservations
    const allRoomReservations = await RoomReservation.find({});

    let rooms;

    if (allRoomReservations.length === 0) {
      // If there are no room reservations, return all rooms
      rooms = await Room.find({});
    } else {
      // Find reservations that overlap with the given dates
      const overlappingReservations = await RoomReservation.find({
        $or: [
          // checkInDate is in between reservation dates
          {
            checkIn: { $lte: checkInDate },
            checkOut: { $gte: checkInDate },
          },
          // checkOutDate is in between reservation dates
          {
            checkIn: { $lte: checkOutDate },
            checkOut: { $gte: checkOutDate },
          },
          // checkInDate & checkOutDate are in between reservation dates
          {
            checkIn: { $lte: checkInDate },
            checkOut: { $gte: checkOutDate },
          },
          // reservation dates are in between checkInDate & checkOutDate
          {
            checkIn: { $gte: checkInDate },
            checkOut: { $lte: checkOutDate },
          },
        ],
      }).select("rooms");

      // Extract room IDs from overlapping reservations
      const reservedRoomIds = overlappingReservations.flatMap(
        (reservation) => reservation.rooms
      );

      // Find available rooms by excluding reserved rooms
      rooms = await Room.find({
        _id: { $nin: reservedRoomIds },
      });
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
};

// GET a room
const getRoom = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No room found" });
  }

  const room = await Room.findById(id);

  if (!room) {
    return res.status(404).json({ error: "No room found" });
  } else {
    return res.status(200).json(room);
  }
};

// POST a room
const addRoom = async (req, res) => {
  const {
    type,
    roomNo,
    beds,
    extraBed,
    occupancy,
    bathrooms,
    groundSpace,
    cost,
    description,
  } = req.body;

  let emptyFields = [];

  if (!type) {
    emptyFields.push("type");
  }
  if (!roomNo) {
    emptyFields.push("roomNo");
  }
  if (!beds) {
    emptyFields.push("beds");
  }
  if (!extraBed) {
    emptyFields.push("extraBed");
  }
  if (!occupancy) {
    emptyFields.push("occupancy");
  }
  if (!bathrooms) {
    emptyFields.push("bathrooms");
  }
  if (!groundSpace) {
    emptyFields.push("groundSpace");
  }
  if (!cost) {
    emptyFields.push("cost");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  //   add doc to db
  try {
    const room = await Room.create({
      type,
      roomNo,
      beds,
      extraBed,
      occupancy,
      bathrooms,
      groundSpace,
      cost,
      description,
    });
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a room
const deleteRoom = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No room found" });
  }

  const room = await Room.findOneAndDelete({ _id: id }, { new: true });

  if (!room) {
    return res.status(404).json({ error: "No room found" });
  } else {
    return res.status(200).json(room);
  }
};

// UPDATE a room
const updateRoom = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No room found" });
  }

  const room = await Room.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!room) {
    return res.status(404).json({ error: "No room found" });
  } else {
    return res.status(200).json(room);
  }
};

module.exports = {
  getRooms,
  getAvailableRooms,
  getRoom,
  addRoom,
  deleteRoom,
  updateRoom,
};
