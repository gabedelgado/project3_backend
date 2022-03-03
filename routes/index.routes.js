const router = require("express").Router();
const authRoutes = require("./auth.routes");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const homesRoutes = require("./homes.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/homes", homesRoutes);
module.exports = router;
