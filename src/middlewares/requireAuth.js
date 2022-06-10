const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
   const { authorization } = req.headers;

   if (!authorization) {
      console.log("authorization is empty");
      return res.status(401).send({ error: "You must be logged in" });
   }

   // extract the token from the authorization header
   const token = authorization.replace("Bearer ", "");
   // Verify the token against JWT_SECRET
   jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
         console.log("the verification failed");
         return res.status(401).send({ error: "You must be logged in" });
      }
      // if the token is valid, find the user by the userId in the token
      const { userId } = payload;
      const user = await User.findById(userId);
      // if there's no user with the userId, return an error
      if (!user) {
         console.log("no user was found with that id");
         return res.status(401).send({ error: "You must be logged in" });
      }
      // now, insert a user property in the request object so that we can use it next
      req.user = user;
      next();
   });
};
