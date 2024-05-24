const express = require("express");
const {
  getRooms,
  getAvailableRooms,
  getRoom,
  addRoom,
  deleteRoom,
  updateRoom,
} = require("../controllers/roomController");

const router = express.Router();

// GET all rooms
router.get("/", getRooms);

// GET all available rooms
router.get("/available", getAvailableRooms);

// GET room
router.get("/:id", getRoom);

// POST room
router.post("/", addRoom);

// DELETE room
router.delete("/:id", deleteRoom);

// UPDATE room
router.patch("/:id", updateRoom);

module.exports = router;
