const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const MessageSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('messages', MessageSchema);
module.exports = Message;
