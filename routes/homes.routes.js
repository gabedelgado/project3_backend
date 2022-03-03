const { isAuthenticated } = require("../middleware/jwt.middleware");
const router = require("express").Router();
const Home_List = require("../models/Home_List.model");
const Listing = require("../models/Listing.model");
const User = require("../models/User.model");

router.post("/add-home", isAuthenticated, async (req, res) => {
  console.log(req.body);
  try {
    const listing = req.body;
    const user = await User.findById(req.user._id);
    let newlisting = await Listing.create(listing);

    await Home_List.findByIdAndUpdate(user.home_list, {
      $push: { savedHomes: newlisting._id },
    });
    return res.status(200).json({
      message: "The home was successfully added to your saved homes.",
    });
  } catch (error) {
    return res.status(500).json({
      error,
      message: "Something went wrong when trying to add that home to your saved homes.",
    });
  }
});

router.get("/", isAuthenticated, (req, res) => {
  User.findById(req.user._id, { home_list: 1 })
    .populate({
      path: "home_list",
      populate: { path: "savedHomes" },
    })
    .then((results) => {
      return res.json(results);
    })
    .catch((error) => {
      return res.status(500).json({
        error,
        message: "Something went wrong when trying to retreive your saved homes.",
      });
    });
});

router.post("/delete-home", isAuthenticated, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.body.listing);
    let user = await User.findById(req.user._id);
    await Home_List.findByIdAndUpdate(user.home_list, {
      $pull: { savedHomes: req.body.listing },
    });
    return res.json({
      message: "the home was successfully deleted from the users home_list",
    });
  } catch (error) {
    return res.status(500).json({
      error,
      message: "something went wrong when trying to delete that home from the users home_list",
    });
  }
});

module.exports = router;
