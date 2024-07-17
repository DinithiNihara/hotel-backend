const express = require("express");
const {
  getRooms,
  searchRoom,
  getAvailableRooms,
  getRoom,
  addRoom,
  deleteRoom,
  updateRoom,
} = require("../controllers/roomController");

const router = express.Router();

// GET all rooms
router.get("/", getRooms);

router.get("/search", searchRoom);

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
