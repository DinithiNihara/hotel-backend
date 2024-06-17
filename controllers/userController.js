const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const hashedPassword = await bcrypt.hash(password, 10);

  //   add doc to db
  try {
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      role,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  let emptyFields = [];
  if (!user) {
    return res.status(404).json({ error: "User doesn't exist", emptyFields });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(404)
      .json({ error: "Username or Password is incorrect", emptyFields });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, "secret");
  res.json({
    token,
    userID: user._id,
    username: user.userName,
    role: user.role,
    emptyFields,
  });
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

  // Destructure the fields from req.body
  const { password, ...otherFields } = req.body;

  // Check if password is provided and not an empty string
  if (password && password !== "") {
    const hashedPassword = await bcrypt.hash(password, 10);
    otherFields.password = hashedPassword;
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      ...otherFields,
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
  loginUser,
  deleteUser,
  updateUser,
};
