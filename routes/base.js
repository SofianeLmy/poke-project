'use strict';

const express = require('express');
const router = express.Router();
const axios = require('axios');
const routeGuard = require('./../middleware/route-guard');
const Card = require('./../models/card');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Poke-Project' });
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
    const cardsFromAPI = result.data.data;
    const count = result.data.count;
    // const cardId = req.body.cardApiId;
    //console.log(cardsFromAPI);
    Card.find({ creator: req.user._id })
      .then((cardsFromDB) => {
        console.log(cardsFromDB);
        const arrayOfIds = cardsFromDB.map((eachElement) =>
          String(eachElement.cardApiId)
        );
        const cardsToDisplay = cardsFromAPI.filter(
          (eachCard) => !arrayOfIds.includes(eachCard.id)
        );
        console.log('CARDS', cardsToDisplay);
        if (count === 0) {
          res.render('collection'); // this must be wrong input
        } else {
          res.render('results', { cardsToDisplay });
        }
      })
      .catch((error) => next(error));

    // console.log(req.body.cardApiId, cards[0].id);
  } catch (error) {
    console.error(error);
  }
});

// console.log(req.body.cardApiId);

router.post('/add-card', routeGuard, (req, res, next) => {
  const cardName = req.body.cardName;
  const cardImage = req.body.cardImage;
  const cardValue = req.body.cardValue;
  const cardAmount = req.body.cardAmount;
  const cardApiId = req.body.cardApiId;
  const creator = req.user._id;
  const card = {
    cardName,
    cardImage,
    cardValue,
    cardAmount,
    cardApiId,
    creator
  };
  Card.create(card)
    .then((card) => {
      console.log(card);
      res.redirect('collection');
    })
    .catch((error) => next(error));
});

router.post('/collection/:cardId/delete', (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then(() => res.redirect('/collection'))
    .catch((error) => next(error));
});

router.post('/collection/:cardId/edit', (req, res, next) => {
  const { cardId } = req.params;
  const { cardAmount } = req.body;

  Card.findByIdAndUpdate(cardId, { cardAmount }, { new: true })
    .then(() => res.redirect('/collection'))
    .catch((error) => next(error));
});

router.get('/collection', routeGuard, (req, res, next) => {
  const userId = req.user._id;

  Card.find({ creator: userId })
    .then((allTheCardsFromDB) => {
      const arrayOfValues = allTheCardsFromDB.map((eachElement) =>
        Number(eachElement.cardValue * eachElement.cardAmount)
      );
      const TotalValue = arrayOfValues.reduce((a, b) => a + b, 0).toFixed(2);

      if (TotalValue == 0) {
        res.render('collection', {
          cards: allTheCardsFromDB,
          TotalValue: 'Add a card to your collection first'
        });
      } else {
        res.render('collection', {
          cards: allTheCardsFromDB,
          TotalValue: '$' + TotalValue
        });
      }
    })
    .catch((error) => {
      console.log('Error while getting the cards from the DB: ', error);
      next(error);
    });
});

module.exports = router;
