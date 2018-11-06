const express = require('express');
const router = express.Router();

const Message = require('../models/Message');

router.post('/', function(req, res) {
  const newMsg = new Message({
    from: req.body.from,
    text: req.body.text
  });
  newMsg.save().then(() => {
    return res.json(newMsg);
  });
})

router.get('/', function(req, res) {
  Message.find({}).then(messages => {
    if(!messages) {
      res.json([{}]);
    }
    res.json(messages);
  }).catch(e => {
    res.status(401).json(e);
  });
})

module.exports = router;
