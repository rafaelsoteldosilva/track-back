const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = new User({ email, password });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(200).send({ token });
   } catch (error) {
      return res.status(422).send(error.message);
   }
});

router.post("/signin", async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(422).send({ error: "Must provide email and password" });
   }
   const user = await User.findOne({ email });
   if (!user) {
      return res.status(422).send({ error: "Invalid email" });
   }
   if (user.password !== password) {
      return res.status(422).send({ error: "Invalid password" });
   }
   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
   res.status(200).send({ token });
});

module.exports = router;
