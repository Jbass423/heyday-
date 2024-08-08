const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    access_level: req.user.access_level
  });
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Need to adjust this route below to create an access level 2 user (business user)


router.post('/register/business', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password, access_level)
    VALUES ($1, $2, 2) RETURNING id, username, access_level`;
  pool
    .query(queryText, [username, password])
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
      console.log('Business user registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    access_level: req.user.access_level
  });
});

// clear all server session information about this user
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

router.put('/access_level', (req, res) => {
  const userId = req.user.id; // get user information in the session
  const { access_level } = req.body;
  const queryText = `UPDATE "user" SET "access_level" = $1 WHERE "id" = $2 RETURNING *;`;

  pool.query(queryText, [access_level, userId])
    .then((response) => {
      console.log("Access level updated successfully", response.rows[0]);
      res.status(200).json(response.rows[0]);
    })
    .catch((error) => {
      console.log("Error in updating access level", error);
      res.sendStatus(500);
    });
});

module.exports = router;
