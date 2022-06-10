require("./models/User");
require("./models/Track");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoute");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();
app.use(express.json());

const mongoUri = "mongodb+srv://rafael:1234@cluster0.jljzt.mongodb.net/track";
mongoose.connect(mongoUri);

mongoose.connection.on("connected", () => {
   console.log("connected to mongo db");
});

mongoose.connection.on("error", (err) => {
   console.log("Error connecting to mongo db", err);
});

app.use(authRoutes);
app.use(trackRoutes);

app.get("/", requireAuth, (req, res) => {
   res.send(`Your verified email is ${req.user.email}`);
});

app.listen(3000, () => {
   console.log("listening on port 3000");
});
