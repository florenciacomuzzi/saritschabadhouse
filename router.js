const express = require('express');
const router = express.Router();


router.all('/', function (req, res, next) {
  console.log('Someone made a request!');
  next();
});

router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;