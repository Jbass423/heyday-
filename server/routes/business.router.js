const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/all-details', (req, res) => {
    console.log('GET /api/business/all-details called');
    const query = `
      SELECT 
        business.id, 
        business.business_name, 
        business.address, 
        business.description,
        happy_hour.start_time, 
        happy_hour.end_time, 
        happy_hour.day_of_week,
        STRING_AGG(DISTINCT diet.name, ', ') AS diets
      FROM 
        business
      LEFT JOIN 
        happy_hour ON business.id = happy_hour.business_id
      LEFT JOIN 
        business_diet ON business.id = business_diet.business_id
      LEFT JOIN 
        diet ON business_diet.diet_id = diet.id
      GROUP BY 
        business.id, happy_hour.id
    `;
  
    pool.query(query)
      .then((result) => {
        console.log('Query executed successfully');
        console.log('Fetched businesses:', result.rows);
        res.json(result.rows);
      })
      .catch((err) => {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err.toString() });
      });
  });


router.get('/', (req, res) => {
  const queryText = `SELECT * FROM "business"`;
  pool.query(queryText)
    .then(result => {
      res.send(result.rows);
    })
    .catch(error => {
      console.log('Error in business GET route', error);
      res.sendStatus(500);
    });
});

router.get('/:id', (req, res) => {
  const businessId = req.params.id;
  const queryText = `
  SELECT b.*,
    json_agg(DISTINCT jsonb_build_object('id', d.id, 'name', d.name)) AS diets,
    json_agg(DISTINCT jsonb_build_object('id', v.id, 'name', v.name)) AS vibes,
    json_agg(DISTINCT jsonb_build_object('id', h.id, 'start_time', h.start_time, 'end_time', h.end_time, 'day_of_week', h.day_of_week)) AS happy_hours,
    json_agg(DISTINCT bi.image_url) AS images
  FROM "business" b
  LEFT JOIN "business_diet" bd ON b.id = bd.business_id
  LEFT JOIN "diet" d ON bd.diet_id = d.id
  LEFT JOIN "business_vibe" bv ON b.id = bv.business_id
  LEFT JOIN "vibe" v ON bv.vibe_id = v.id
  LEFT JOIN "happy_hour" h ON b.id = h.business_id
  LEFT JOIN "business_image" bi ON b.id = bi.business_id
  WHERE b.id = $1
  GROUP BY b.id;
`;
  pool.query(queryText, [businessId])
    .then(result => {
      if (result.rows.length > 0) {
        res.send(result.rows[0]);
      } else {
        res.status(404).send('Business not found');
      }
    })
    .catch(error => {
      console.log('Error in business GET by ID route', error);
      res.status(500).send('Server error');
    });
});

    //Select all columns from the business table
        //combines multiple rows of data into a single JSON array.
        //connect the business table with other related tables (business_diet, diet, happy_hour, business_image).
        //filters the results to include only the business with the ID specified by $1
        //groups the results by the business ID (b.id).

      

router.post('/', (req,res)=>{
    const {  business_name, address, business_type, description, user_id, phone_number}= req.body
    const queryText = `
    INSERT INTO "business" ("business_name", "address","description", "business_type", "user_id","phone_number")
    VALUES($1,$2,$3,$4,$5,$6)
    `
    const queryValues = [  business_name, address, business_type, description, user_id,  phone_number];

    pool.query(queryText, queryValues)
    .then((response)=>{
        console.log("checking response in POST bus router");
        res.status(200).json(response.rows[0])
    })
    .catch((error)=>{
        console.log("error in POST bus route", error);
    })
})




router.get('/:id', (req, res) => {
    const queryText = 'SELECT * FROM "business" WHERE id = $1;'
    pool.query(queryText, [req.params.id])
        .then((result) => {
            if (result.rows.length === 0){
            res.status(404).json({ error: 'Business not found!!!'})
            }
            else {
                res.json(result.rows[0])
            }
        })
        .catch((error) => {
            console.log("error in address route", error);
            res.sendStatus(500)
        })
})


module.exports = router 