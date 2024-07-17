const express = require("express");
const {
  getEventVenueReservations,
  getEventVenueReservation,
  addEventVenueReservation,
  deleteEventVenueReservation,
  updateEventVenueReservation,
} = require("../controllers/eventVenueReservationController");

const router = express.Router();

// GET all eventVenueReservations
router.get("/", getEventVenueReservations);

// GET eventVenueReservation
router.get("/:id", getEventVenueReservation);

// POST eventVenueReservation
router.post("/", addEventVenueReservation);

// DELETE eventVenueReservation
router.delete("/:id", deleteEventVenueReservation);

// UPDATE eventVenueReservation
router.patch("/:id", updateEventVenueReservation);

module.exports = router;
