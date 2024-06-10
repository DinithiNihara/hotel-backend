const User = require("../models/userModel");
const mongoose = require("mongoose");

// GET all users
const getUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 }); //descending order
  res.status(200).json(users);
};

// GET a user
const getUser = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No user found" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: "No user found" });
  } else {
    return res.status(200).json(user);
  }
};

// POST a user
const addUser = async (req, res) => {
  const { userName, email, password, role } = req.body;

  let emptyFields = [];

  if (!userName) {
    emptyFields.push("userName");
  }
  if (!email) {
    emptyFields.push("email");
  }
  if (!password) {
    emptyFields.push("password");
  }
  if (!role) {
    emptyFields.push("role");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  //   add doc to db
  try {
    const user = await User.create({
      userName,
      email,
      password,
      role,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No user found" });
  }

  const user = await User.findOneAndDelete({ _id: id }, { new: true });

  if (!user) {
    return res.status(404).json({ error: "No user found" });
  } else {
    return res.status(200).json(user);
  }
};

// UPDATE a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  // invalid - if it doesn't have the same length as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No user found" });
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ error: "No user found" });
  } else {
    return res.status(200).json(user);
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
};
