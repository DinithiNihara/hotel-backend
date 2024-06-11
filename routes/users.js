const express = require("express");
const {
  getUsers,
  getUser,
  addUser,
  loginUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET a user
router.get("/:id", getUser);

// POST a user
router.post("/", addUser);

// POST a user data to log in
router.post("/login", loginUser);

// DELETE a user
router.delete("/:id", deleteUser);

// UPDATE a user
router.patch("/:id", updateUser);

module.exports = router;
