var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'GitVio',
    description: 'Generate beautiful portfolios from your GitHub profile'
  });
});

module.exports = router;
