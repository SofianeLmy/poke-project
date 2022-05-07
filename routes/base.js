'use strict';

const express = require('express');
const router = express.Router();
const axios = require('axios');
const routeGuard = require('./../middleware/route-guard');
const Card = require('./../models/card');

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
    const count = result.data.count;
    if (count === 0) {
      res.render('private'); // this must be wrong input
    } else {
      res.render('results', { cards });
    }
  } catch (error) {
    console.error(error);
  }
});

router.post('/add-card', (req, res, next) => {
  const cardName = req.body.cardName;
  const cardImage = req.body.cardImage;
  const cardValue = req.body.cardValue;
  const creator = req.user._id;
  const card = {
    cardName,
    cardImage,
    cardValue,
    creator
  };
  Card.create(card)
    .then((cardData) => {
      console.log(cardData);
      res.redirect('private');
    })
    .catch((error) => next(error));
});

module.exports = router;
