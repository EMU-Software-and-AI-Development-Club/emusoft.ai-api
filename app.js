const express = require("express");
const expressRateLimit = require("express-rate-limit");
const expressMongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const xssClean = require("xss-clean");
const userRoutes = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");

// * Call Express
const app = express();

// * API Limit
const limit = expressRateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "Too many requests.",
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit }));

// * Security
app.use(expressMongoSanitize()); // Block NoSQL Injection, disable { } query
app.use(helmet()); // Block XSS attacks, disable HTTP, force HTTP(S)
app.use(hpp()); // Block HTTP parameter pollution attacks
app.use(xssClean()); // Block malicious scripts

// * Routes
app.get(
  "/",
  (req, res) =>
    res.status(200).json({
      status: "success",
      message: "Welcome to the EMUSOFT.AI API",
    })

  //   res.redirect("https://emusoft.ai")
);

app.use("/users", userRoutes);

// * Global error handling
app.use(errorController);

module.exports = app;