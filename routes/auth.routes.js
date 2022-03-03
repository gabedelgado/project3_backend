const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

const Home_List = require("../models/Home_List.model");

// require jwt to send tokens on login and signup
const jwt = require("jsonwebtoken");

// jwt middleware, will be changed soon to cross reference the requested info and user asking for it
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/loggedin", isAuthenticated, (req, res) => {
  console.log(req.user);

  // user data can be found in the req.user ^^^^

  res.json({ sensitiveData: "poopdollar" });
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res.status(400).json({ errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database

        return User.create({
          username,
          password: hashedPassword,
        });
      })
      .then(async (user) => {
        let newHomeList = await Home_List.create({ owner: user._id });
        await User.findByIdAndUpdate(user._id, {
          home_list: newHomeList._id,
        });

        // generate and send web token
        const payload = { _id: user._id, username: user.username };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        return res.status(200).json(authToken);
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage: "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

// will decide whether or not to make this request on the front end, no middleware
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ errorMessage: "Please provide your username." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }
        const payload = { _id: user._id, username: user.username };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        return res.status(200).json(authToken);
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

// HOW CAN WE DO THIS ?
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }
    res.json({ message: "Done" });
  });
});

router.get("/delete", isAuthenticated, async (req, res) => {
  const idToDelete = req.user._id;
  try {
    await User.findByIdAndDelete(idToDelete);
    return res.json({ message: "User successfully deleted" });
  } catch (err) {
    return res.status(500).json({
      err,
      message: "Something went wrong when trying to delete that user from the DB",
    });
  }
});

router.post("/update-user", isAuthenticated, async (req, res) => {
  try {
    let doubleuser = await User.findOne({ username: req.body.username });
    if (doubleuser) {
      return res.status(409).json({ error: "that username is taken, please try another." });
    } else {
      await User.findByIdAndUpdate(req.user._id, { username: req.body.username });
      return res.json({ message: "Username successfully updated." });
    }
  } catch (error) {
    return res.status(500).json({ error, message: "something went wrong when trying to update your username. " });
  }
});

module.exports = router;
