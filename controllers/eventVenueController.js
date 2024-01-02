const EventVenue = require("../models/eventVenueModel");
const mongoose = require("mongoose");

// GET all eventVenues
const getEventVenues = async (req, res) => {
  const eventVenues = await EventVenue.find({}).sort({ createdAt: -1 }); //descending order
  res.status(200).json(eventVenues);
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
  const { type, capacity, description, cost, l } = req.body;

  let emptyFields = [];

  if (!type) {
    emptyFields.push("type");
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

  const eventVenue = await EventVenue.findOneAndDelete({ _id: id }, { new: true });

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
  getEventVenue,
  addEventVenue,
  deleteEventVenue,
  updateEventVenue,
};
