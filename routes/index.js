const express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", {
    title: "GitVio",
    description: "Generate beautiful portfolios from your GitHub profile",
  });
});

module.exports = router;
