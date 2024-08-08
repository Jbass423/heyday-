const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {rejectUnauthenticated} = require('../modules/authentication-middleware');
router.get('/',  (req, res) => {
  const queryText = `
 SELECT * FROM "search_history"
  `;
  
  pool.query(queryText)
    .then((result) => {
      console.log(`GET from database`, result.rows);
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error making database query ${queryText}`, error);
      res.sendStatus(500);
    });
});
  router.post('/', (req, res) => {
    const { name , address , business_id} = req.body;
    const user_id = req.user.id;
  
    console.log('Received POST request:', { user_id,  name, address , business_id});
  
    if (!user_id) {
      console.log('User ID is missing');
      return res.status(400).send('User ID is required');
    }
  
    let sqlText = `
      INSERT INTO "search_history" ("user_id", "name", "address", "business_id")
      VALUES ($1, $2,$3,$4)
    `;
  
    const values = [user_id, name , address, business_id ];
  
    pool.query(sqlText, values)
      .then(() => {
        console.log('POST successful');
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Error making POST:', error);
        res.status(500).send(error.toString());
      });
  });
  router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.id;
    console.log(`Attempting to delete item ${itemId} for user ${userId}`);
    const queryText = `
    DELETE FROM "search_history"
    WHERE "id" = $1 AND "user_id" = $2
    `
    pool.query(queryText, [itemId, userId])
    .then ((result) => {
      if (result.rowCount > 0) {
        res.sendStatus(204)
      } else {
        res.sendStatus(403)
      } 
    })
    .catch((error) => {
      console.log('Error with DELETE', error);
      res.sendStatus(500)
    })
});
module.exports = router;