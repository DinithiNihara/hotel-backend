const Guest = require("../models/guestModel");
const mongoose = require("mongoose");

// GET all guests
const getGuests = async (req, res) => {
  const guests = await Guest.find({}).sort({ createdAt: -1 }); //descending order
  res.status(200).json(guests);
};

// Search guest
const searchGuest = async (req, res) => {
  const { term } = req.params;
  try {
    const searchRegex = new RegExp(term, "i"); // case-insensitive search
    const guests = await Guest.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { nicPassport: searchRegex },
      ],
    });
    res.status(200).json(guests);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
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
  const { title, firstName, lastName, address, nicPassport, phone, email } =
    req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!firstName) {
    emptyFields.push("firstName");
  }
  if (!lastName) {
    emptyFields.push("lastName");
  }
  if (!address) {
    emptyFields.push("address");
  }
  if (!nicPassport) {
    emptyFields.push("nicPassport");
  }
  if (!phone) {
    emptyFields.push("phone");
  }
  if (!email) {
    emptyFields.push("email");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  //   add doc to db
  try {
    const guest = await Guest.create({
      title,
      firstName,
      lastName,
      address,
      nicPassport,
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

  const guest = await Guest.findOneAndDelete({ _id: id }, { new: true });

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
    },
    { new: true }
  );

  if (!guest) {
    return res.status(404).json({ error: "No guest found" });
  } else {
    return res.status(200).json(guest);
  }
};

module.exports = {
  getGuests,
  searchGuest,
  getGuest,
  addGuest,
  deleteGuest,
  updateGuest,
};
