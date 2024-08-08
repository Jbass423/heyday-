const express = require("express");
const app = express();

const cors = require('cors');
const favoritesRouter = require('./routes/favorites.router.js')
const addressRouter = require('./routes/address.router.js')
const happyHourRouter = require('./routes/happyHour.router.js')
const busRouter = require('./routes/business.router.js')
const historyRouter= require('./routes/history.router.js')
require('dotenv').config();
const scraperRouter = require("./routes/scraper.router.js"); // scraping router
const PORT = process.env.PORT || 5001;
// Middleware Includes
const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");
// Route Includes
const userRouter = require('./routes/user.router');
 
 
 app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5001'], // Allow both frontend and backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));
// Passport Session Configuration
app.use(sessionMiddleware);
// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use('/api/search_history', historyRouter )
// new
app.use("/api/getAddresses", addressRouter)
// ^^
app.use("/api/user", userRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/scraper", scraperRouter);
app.use("/api/business", busRouter)
app.use('/api/happy_hour', happyHourRouter);


// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});