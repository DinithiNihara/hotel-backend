const express = require("express");
const {
  getRoomReservations,
  getRoomReservation,
  filterRoomReservations,
  addRoomReservation,
  deleteRoomReservation,
  updateRoomReservation,
} = require("../controllers/roomReservationController");

const router = express.Router();

// GET all roomReservations
router.get("/", getRoomReservations);

// Filter roomReservations
router.get("/filterReservations", filterRoomReservations);

// GET roomReservation
router.get("/:id", getRoomReservation);

// POST roomReservation
router.post("/", addRoomReservation);

// DELETE roomReservation
router.delete("/:id", deleteRoomReservation);

// UPDATE roomReservation
router.patch("/:id", updateRoomReservation);

module.exports = router;
