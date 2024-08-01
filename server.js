require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/users");
const guestRoutes = require("./routes/guests");
const roomRoutes = require("./routes/rooms");
const eventVenueRoutes = require("./routes/eventVenues");
const roomReservations = require("./routes/roomReservations");
const eventVenueReservations = require("./routes/eventVenueReservations");
const reportsRoutes = require("./routes/reports");

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/users", userRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/eventVenues", eventVenueRoutes);
app.use("/api/roomReservations", roomReservations);
app.use("/api/eventVenueReservations", eventVenueReservations);
app.use("/api/reports", reportsRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // to listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
