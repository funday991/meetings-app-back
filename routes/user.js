const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('../models/User');

router.post('/register', function(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email
  }).then(user => {
    if(user) {
      return res.status(400).json({
        email: 'Email already exists'
      });
    }
    else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if(err) console.error('There was an error', err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) console.error('There was an error', err);
            else {
              newUser.password = hash;
              newUser.save().then(() => {
                return newUser.generateAuthToken();
              }).then((token) => {
                res.header('x-auth', token).json(newUser);
              });
            }
          });
        }
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then(user => {
      if(!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            return user.generateAuthToken().then((token) => {
              res.header('x-auth', token).json(user);
            })
          } else {
            errors.password = 'Incorrect Password';
            return res.status(400).json(errors);
          }
        });
    });
});

router.get('/me', (req, res) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    res.json(user);
  }).catch((e) => {
    res.status(401).json();
  });
});

router.delete('/me/token', (req, res) => {
  var token = req.header('x-auth');
  req.user.removeToken(token).then(() => {
    res.status(200).json();
  }, () => {
    res.status(400).json();
  })
});

module.exports = router;
