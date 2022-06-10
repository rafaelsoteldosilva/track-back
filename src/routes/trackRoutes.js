const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Track = mongoose.model("Track");

const router = express.Router();

router.use(requireAuth);

router.get("/tracks", async (req, res) => {
   const tracks = await Track.find({ userId: req.user._id });
   // Remember, the middleware requireAuth was already called, so in the req object, there's a user property
   res.send(tracks);
});

router.post("/tracks", async (req, res) => {
   const { name, locations } = req.body;

   if (!name || !locations) {
      return res
         .status(422)
         .send({ error: "Please provide a name and locations" });
   }

   try {
      const track = new Track({
         userId: req.user._id,
         name,
         locations,
      });

      await track.save();
      res.send(track);
   } catch (err) {
      res.status(422).send({ error: err.message });
   }
});

module.exports = router;
