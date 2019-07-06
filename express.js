var express = require("express");
var cookie = require("cookie-parser");
var app = new express();
app.use(express.static("./page"));
app.use(cookie());

module.exports = app;