const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./db');

const users = require('./routes/user');

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

const app = express();

app.use(bodyParser.json());

app.use('/api/users', users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
