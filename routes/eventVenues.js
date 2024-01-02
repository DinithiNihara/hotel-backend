const express = require("express");
const {
  getEventVenues,
  getEventVenue,
  addEventVenue,
  deleteEventVenue,
  updateEventVenue,
} = require("../controllers/eventVenueController");

const router = express.Router();

// GET all eventVenues
router.get("/", getEventVenues);

// GET eventVenue
router.get("/:id", getEventVenue);

// POST eventVenue
router.post("/", addEventVenue);

// DELETE eventVenue
router.delete("/:id", deleteEventVenue);

// UPDATE eventVenue
router.patch("/:id", updateEventVenue);

module.exports = router;
