var _ = require("lodash");
var createError = require('http-errors');
const moment = require("moment");
const NodeCache = require("node-cache");
const main = require("../src/fetchAll");

var express = require('express');
var router = express.Router();

const cache = new NodeCache({ stdTTL: 60 * 60 * 1 });

router.get('/@:username', async (req, res, next) => {
  var username = req.params.username;
  var regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w-.]{0,39}$/gi;

  let renderData = {};
  renderData.github = {};

  if (!regex.test(username)) {
    next();
    return
  }

  if (cache.has(username)) {
    let userNameData = cache.get(username);
    console.log(`Sending Response from cache memory`);
    res.render('user', userNameData);
    return
  }

  try {
    
    renderData = await main(username);
    console.log(renderData);
    res.render('user', renderData);
    cache.set(username, renderData);

  } catch (error) {

    if (error.code == "ERR_BAD_REQUEST") {
      let limitReset = moment(error.response.headers["x-ratelimit-reset"] * 1000).toNow(true);
      next(createError(529, `Try again in ${limitReset}`));
    } if (error.code == "ENOTFOUND") {
      next(createError(404, `User not found!`));
    } else {
      next(createError(500));
    }

    console.log(error);
  }

});

module.exports = router;
