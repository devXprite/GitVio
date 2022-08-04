const express = require("express");
const { recentProfiles } = require("../src/recentProfiles");

const router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  res.render("index", {
    title: "GitVio",
    description: "Generate beautiful portfolios from your GitHub profile",
    recentProfiles: await recentProfiles(),
  });
});

module.exports = router;
