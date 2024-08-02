const mongoose = require("mongoose");
const RoomReservation = require("../models/roomReservationModel");
const Room = require("../models/roomModel");
const EventVenueReservation = require("../models/eventVenueReservationModel");
const EventVenue = require("../models/eventVenueModel");

// GET today's room reservations
const getTodayRoomReservations = async (req, res) => {
  try {
    // Get today's start and end date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find all rooms
    const totalRoomsCount = await Room.countDocuments({});

    // Find today's room reservations
    const todayReservations = await RoomReservation.find({
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: { $ne: "Cancelled" },
    });

    const todayRoomReservationsCount = todayReservations.length;
    const todayAvailableRoomsCount =
      totalRoomsCount - todayRoomReservationsCount;

    res.status(200).json({
      todayAvailableRoomsCount,
      todayRoomReservationsCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET today's venue reservations
const getTodayVenueReservations = async (req, res) => {
  try {
    // Get today's start and end date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find all venues
    const totalVenuesCount = await EventVenue.countDocuments({});

    // Find today's venue reservations
    const todayReservations = await EventVenueReservation.find({
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: { $ne: "Cancelled" },
    });

    const todayVenueReservationsCount = todayReservations.length;
    const todayAvailableVenuesCount =
      totalVenuesCount - todayVenueReservationsCount;

    res.status(200).json({
      todayAvailableVenuesCount,
      todayVenueReservationsCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all roomReservations details for a specific year
const getRoomReservationsYearlyData = async (req, res) => {
  try {
    const year = parseInt(req.params.year); // Get the year from params

    // Define the start and end of the year
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);
    console.log(startOfYear);
    console.log(endOfYear);
    // Fetch room reservations for the specified year
    const roomReservationsDetails = await RoomReservation.find({
      checkIn: { $gte: startOfYear, $lt: endOfYear },
      status: { $ne: "Cancelled" },
    });

    // For each room reservation, fetch room types and add to rooms array
    const updatedReservations = await Promise.all(
      roomReservationsDetails.map(async (reservation) => {
        const roomTypesPromises = reservation.rooms.map(async (roomId) => {
          // Fetch the room by ID
          const room = await Room.findById(roomId);
          return room
            ? { roomId, type: room.type }
            : { roomId, type: "Unknown" };
        });

        const roomTypes = await Promise.all(roomTypesPromises);

        // Update the reservation object with room types
        return {
          ...reservation.toObject(),
          rooms: roomTypes,
        };
      })
    );

    // Send the updated reservations in the response
    res.status(200).json(updatedReservations);
  } catch (error) {
    console.error("Error fetching room reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getVenueReservationsYearlyData = async (req, res) => {
  try {
    const year = parseInt(req.params.year); // Get the year from params

    // Define the start and end of the year
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);
    console.log(startOfYear);
    console.log(endOfYear);
    // Fetch venue reservations for the specified year
    const venueReservationsDetails = await EventVenueReservation.find({
      checkIn: { $gte: startOfYear, $lt: endOfYear },
      status: { $ne: "Cancelled" },
    });

    // For each venue reservation, fetch venue types and add to venues array
    const updatedReservations = await Promise.all(
      venueReservationsDetails.map(async (reservation) => {
        const venueTypesPromises = reservation.eventVenues.map(
          async (venueId) => {
            // Fetch the venue by ID
            const venue = await EventVenue.findById(venueId);
            return venue
              ? { venueId, type: venue.type }
              : { venueId, type: "Unknown" };
          }
        );

        const venueTypes = await Promise.all(venueTypesPromises);

        // Update the reservation object with venue types
        return {
          ...reservation.toObject(),
          venues: venueTypes,
        };
      })
    );

    // Send the updated reservations in the response
    res.status(200).json(updatedReservations);
  } catch (error) {
    console.error("Error fetching venue reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTodayRoomReservations,
  getTodayVenueReservations,
  getRoomReservationsYearlyData,
  getVenueReservationsYearlyData,
};
