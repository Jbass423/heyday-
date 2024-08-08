const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    const queryText = 'SELECT id, address FROM "business";'
    pool.query(queryText)
        .then((result) => {
            console.log("checking address", result.rows);
            res.json(result.rows)

        })
        .catch((error) => {
            console.log("error in address route", error);
            res.sendStatus(500)
        })
})




module.exports = router;