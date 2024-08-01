const express = require("express");
const {
  getEventVenues,
  getAvailableVenues,
  getEventVenue,
  addEventVenue,
  deleteEventVenue,
  updateEventVenue,
} = require("../controllers/eventVenueController");

const router = express.Router();

const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

const upload = multer({ storage: storage });

// GET all eventVenues
router.get("/", getEventVenues);

// GET all available venues
router.get("/available", getAvailableVenues);

// GET eventVenue
router.get("/:id", getEventVenue);

// POST eventVenue
router.post("/", upload.single("image"), addEventVenue);

// DELETE eventVenue
router.delete("/:id", deleteEventVenue);

// UPDATE eventVenue
router.patch("/:id", upload.single("image"), updateEventVenue);

module.exports = router;
