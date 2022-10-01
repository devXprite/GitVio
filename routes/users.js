// const _ = require("lodash");
const createError = require("http-errors");
// const moment = require("moment");
const NodeCache = require("node-cache");
const express = require("express");
const fetchAll = require("../src/fetchAll");
const { saveToRecent } = require("../src/recentProfiles");

const router = express.Router();

const cache = new NodeCache({ stdTTL: 60 * 60 * 1 });

router.get("/@:username", async (req, res, next) => {
  const username = (req.params.username).toLocaleLowerCase();
  const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w-.]{0,39}$/gi;

  let renderData = {};
  renderData.github = {};

  if (!regex.test(username)) {
    next();
    return;
  }

  if (!process.env?.TOKEN) {
    throw new Error("Github Personal Access Token not Found!");
  }

  if (cache.has(username)) {
    renderData = cache.get(username);

    res.render("user", renderData);
    await saveToRecent(renderData);

    console.log("Sending Response from cache");
    return;
  }

  try {
    renderData = await fetchAll(username);
    // console.log(renderData);

    cache.set(username, renderData);
    res.render("user", renderData);

    await saveToRecent(renderData);
  } catch (error) {
    next(createError(500));
    console.log(error);
  }
});

module.exports = router;
