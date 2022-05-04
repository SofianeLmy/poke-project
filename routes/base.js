'use strict';

const express = require('express');
const router = express.Router();
const axios = require('axios');
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Hello World!' });
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

router.get('/results', async (req, res) => {
  const term = req.query.term;
  try {
    const result = await axios.get(
      'https://api.pokemontcg.io/v2/cards?q=name:' + term,
      {
        headers: {
          'X-Api-Key': '5e9e9705-ad38-4fea-a17e-37d15e199f5b'
        }
      }
    );
    const cards = result.data.data;
    res.render('results', { cards });
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
