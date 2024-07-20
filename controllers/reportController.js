const mongoose = require("mongoose");
const RoomReservation = require("../models/roomReservationModel");
const Room = require("../models/roomModel");

// GET all roomReservations for a specific year
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

module.exports = {
  getRoomReservationsYearlyData,
};
