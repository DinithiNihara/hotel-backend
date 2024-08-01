const express = require("express");
const {
  getTodayRoomReservations,
  getTodayVenueReservations,
  getRoomReservationsYearlyData,
  getVenueReservationsYearlyData
} = require("../controllers/reportController");

const router = express.Router();

// GET roomReservations - for today
router.get("/roomsStatus", getTodayRoomReservations);

// GET roomReservations - for today
router.get("/venuesStatus", getTodayVenueReservations);

// GET roomReservations - YearlyData
router.get("/reservations/:year", getRoomReservationsYearlyData);

router.get("/venueReservations/:year", getVenueReservationsYearlyData);

module.exports = router;
