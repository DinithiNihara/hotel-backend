const Guest = require("../models/guestModel");
const mongoose = require("mongoose");

// GET all guests
const getGuests = async (req, res) => {
  const guests = await Guest.find({}).sort({ createdAt: -1 }); //descending order
  res.status(200).json(guests);
};

// GET a guest
const getGuest = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No guest found" });
  }

  const guest = await Guest.findById(id);

  if (!guest) {
    return res.status(404).json({ error: "No guest found" });
  } else {
    return res.status(200).json(guest);
  }
};

// POST a guest
const addGuest = async (req, res) => {
  const { title, firstName, lastName, address, phone, email } = req.body;

  //   add doc to db
  try {
    const guest = await Guest.create({
      title,
      firstName,
      lastName,
      address,
      phone,
      email,
    });
    res.status(200).json(guest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a guest
const deleteGuest = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No guest found" });
  }

  const guest = await Guest.findOneAndDelete({ _id: id });

  if (!guest) {
    return res.status(404).json({ error: "No guest found" });
  } else {
    return res.status(200).json(guest);
  }
};

// UPDATE a guest
const updateGuest = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No guest found" });
  }

  const guest = await Guest.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!guest) {
    return res.status(404).json({ error: "No guest found" });
  } else {
    return res.status(200).json(guest);
  }
};

module.exports = {
  getGuests,
  getGuest,
  addGuest,
  deleteGuest,
  updateGuest,
};
