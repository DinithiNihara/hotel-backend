const EventVenue = require("../models/eventVenueModel");
const mongoose = require("mongoose");
const moment = require("moment");
const EventVenueReservation = require("../models/eventVenueReservationModel");

// GET all eventVenues
const getEventVenues = async (req, res) => {
  const eventVenues = await EventVenue.find({}).sort({ createdAt: -1 }); //descending order
  res.status(200).json(eventVenues);
};

const getAvailableVenues = async (req, res) => {
  const { checkIn, checkOut } = req.query;

  // Parse dates using moment.js
  const checkInDate = moment(checkIn, "YYYY-MM-DD").format("YYYY-MM-DD");
  const checkOutDate = moment(checkOut, "YYYY-MM-DD").format("YYYY-MM-DD");

  try {
    // Get all venue reservations
    const allEventVenueReservations = await EventVenueReservation.find({});

    let venues;

    if (allEventVenueReservations.length === 0) {
      // If there are no venue reservations, return all venues
      venues = await EventVenue.find({});
    } else {
      // Find reservations that overlap with the given dates
      const overlappingReservations = await EventVenueReservation.find({
        $or: [
          // checkInDate is in between reservation dates
          {
            checkIn: { $lte: checkInDate },
            checkOut: { $gte: checkInDate },
          },
          // checkOutDate is in between reservation dates
          {
            checkIn: { $lte: checkOutDate },
            checkOut: { $gte: checkOutDate },
          },
          // checkInDate & checkOutDate are in between reservation dates
          {
            checkIn: { $lte: checkInDate },
            checkOut: { $gte: checkOutDate },
          },
          // reservation dates are in between checkInDate & checkOutDate
          {
            checkIn: { $gte: checkInDate },
            checkOut: { $lte: checkOutDate },
          },
        ],
      }).select("venues");

      // Extract venue IDs from overlapping reservations
      const reservedVenueIds = overlappingReservations.flatMap(
        (reservation) => reservation.venues
      );

      // Find available venues by excluding reserved venues
      venues = await EventVenue.find({
        _id: { $nin: reservedVenueIds },
      });
    }

    res.status(200).json(venues);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
};

// GET eventVenue
const getEventVenue = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No eventVenue found" });
  }

  const eventVenue = await EventVenue.findById(id);

  if (!eventVenue) {
    return res.status(404).json({ error: "No eventVenue found" });
  } else {
    return res.status(200).json(eventVenue);
  }
};

// POST eventVenue
const addEventVenue = async (req, res) => {
  const { type, venueNo, capacity, description, cost } = req.body;

  let emptyFields = [];

  if (!type) {
    emptyFields.push("type");
  }
  if (!venueNo) {
    emptyFields.push("venueNo");
  }
  if (!capacity) {
    emptyFields.push("capacity");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (!cost) {
    emptyFields.push("cost");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  //   add doc to db
  try {
    const eventVenue = await EventVenue.create({
      type,
      venueNo,
      capacity,
      description,
      cost,
    });
    res.status(200).json(eventVenue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE eventVenue
const deleteEventVenue = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No eventVenue found" });
  }

  const eventVenue = await EventVenue.findOneAndDelete(
    { _id: id },
    { new: true }
  );

  if (!eventVenue) {
    return res.status(404).json({ error: "No eventVenue found" });
  } else {
    return res.status(200).json(eventVenue);
  }
};

// UPDATE eventVenue
const updateEventVenue = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No eventVenue found" });
  }

  const eventVenue = await EventVenue.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!eventVenue) {
    return res.status(404).json({ error: "No eventVenue found" });
  } else {
    return res.status(200).json(eventVenue);
  }
};

module.exports = {
  getEventVenues,
  getAvailableVenues,
  getEventVenue,
  addEventVenue,
  deleteEventVenue,
  updateEventVenue,
};
