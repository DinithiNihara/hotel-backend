const express = require("express");
const {
  getGuests,
  getGuest,
  addGuest,
  deleteGuest,
  updateGuest,
} = require("../controllers/guestController");

const router = express.Router();

// GET all guests
router.get("/", getGuests);

// GET a guest
router.get("/:id", getGuest);

// POST a guest
router.post("/", addGuest);

// DELETE a guest
router.delete("/:id", deleteGuest);

// UPDATE a guest
router.patch("/:id", updateGuest);

module.exports = router;
