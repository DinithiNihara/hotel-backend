const express = require("express");
const {
  getRoomReservationsYearlyData,
} = require("../controllers/reportController");

const router = express.Router();

// GET roomReservations - YearlyData
router.get("/reservations/:year", getRoomReservationsYearlyData);

module.exports = router;
