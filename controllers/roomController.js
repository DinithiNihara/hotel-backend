const Room = require("../models/roomModel");
const mongoose = require("mongoose");

// GET all rooms
const getRooms = async (req, res) => {
  const rooms = await Room.find({}).sort({ createdAt: -1 }); //descending order
  res.status(200).json(rooms);
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
  getRoom,
  addRoom,
  deleteRoom,
  updateRoom,
};
