const express = require('express');
const router = module.exports = express.Router();

const logger = require("./utils/logger");

router.all('/', function (req, res, next) {
  logger.info(req.method + ' ' + req.url + ' was requested from ' + req.ip + ' at ' + new Date().toISOString());
  next();
});

router.get('/', function (req, res) {
  res.render('index');
});

router.get("/status", (req, res) => {
  logger.info("Checking the API status: Everything is OK");
  res.status(200).send({
    status: "UP",
    message: "The API is up and running!"
  });
});