'use strict';

const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');

const router = new Router();

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const { name, age, gender, email, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        age,
        gender,
        email,
        passwordHashAndSalt: hash
      });
    })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/private');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect('/private');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

// router.get('/results', async (req, res, next) => {
//   res.render('results');
// });

// router.post('/results', (req, res, next) => {
//   const { user, cardName, cardValue, cardImage } = req.body;
//   const creator = req.user._id;
//   Card.create({ user, cardName, cardValue, cardImage, creator })
//     .then(() => res.redirect('private'))
//     .catch((error) => next(error));
// });

// router.post('/add-card', (req, res, next) => {
//   console.log('hey hallo here i am');
// });

// router.post('/add-card', (req, res, next) => {
//   console.log('copy test');
//   const cardName = req.body.cardName;
//   const cardImage = req.body.cardImage;
//   const cardValue = req.body.cardValue;
//   const creator = req.user._id;
//   const card = {
//     cardName,
//     cardImage,
//     cardValue,
//     creator
//   };
//   Card.create(card)
//     .then((cardData) => {
//       console.log(cardData);
//       res.redirect('private');
//     })
//     .catch((error) => next(error));
// });

module.exports = router;
