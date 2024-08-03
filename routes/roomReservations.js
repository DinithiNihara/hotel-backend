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

// GET roomReservation
router.get("/:id", getRoomReservation);

router.get("/filterReservations", filterRoomReservations);

// POST roomReservation
router.post("/", addRoomReservation);

// DELETE roomReservation
router.delete("/:id", deleteRoomReservation);

// UPDATE roomReservation
router.patch("/:id", updateRoomReservation);

module.exports = router;
