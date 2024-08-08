const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/', (req,res)=>{
    const queryText = `
    SELECT * FROM "happy_hour";
    `;

    pool.query(queryText)
    .then((result)=>{
        console.log("checking data in happy_hour get ", result.rows);
        res.send(result.rows)
    })
    .catch((error)=>{
        console.log("error in happyhour get route", error );
        res.sendStatus(500)
    })
})

router.post('/', (req,res)=>{
    const {  user_id, business_id, address,   date, start_time, end_time,description , name} = req.body

    const queryText= `
      INSERT INTO "happy_hour" ("user_id","business_id","address", "date", "start_time", "end_time","description","name")
    VALUES($1, $2, $3, $4, $5,$6,$7,$8)
  ;
    `
    const queryValues = [ user_id, business_id, address,    date , start_time , end_time , description , name];

    pool.query(queryText, queryValues)
    .then((response)=>{
        console.log("Response in post happy route:", response);
      res.status(200).json(response.rows[0]);
    })

})




router.delete('/:id', (req, res)=>{


    const queryText= `
    DELETE FROM "happy_hour" WHERE "id" = $1;
    `
    pool.query(queryText, [req.params.id])
    .then((result)=>{
      console.log(result)
      res.sendStatus(200)
    })
    .catch((error)=>{
      console.log("error in delete fav route ", error);
    })
  })

router.put('/likes/:id', (req, res)=>{
    const { id } = req.params
    const queryText = `
    UPDATE "happy_hour"
    SET "likes" = "likes" + 1
    WHERE "id" = $1
    RETURNING *;
    `

    pool.query(queryText, [id])
    .then((result)=>{
        console.log("checking result in like ", result );
        res.sendStatus(200)
    })
    .catch((error)=>{
        console.log("error in like put", error );
        res.sendStatus(400)
    })
})

router.put('/interested/:id', (req, res)=>{
    const { id } = req.params

    const queryText = `
    UPDATE "happy_hour"
     SET "interested" = "interested" + 1 
     WHERE "id" = $1;
    `

    pool.query(queryText, [id])
    .then((result)=>{
        console.log("checking result in like ", result );
        res.sendStatus(200)
    })
    .catch((error)=>{
        console.log("error in like put", error );
        res.sendStatus(400)
    })
})


module.exports = router;