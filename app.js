const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const config = require('./db');
const users = require('./routes/user');
const messages = require('./routes/message');

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());

app.use('/api/users', users);

app.use('/api/chat', messages);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('New user connected');
  socket.on('message', msg => io.emit('message', msg));
});

server.listen(PORT, '192.168.1.7', () => {
    console.log(`Server is running on PORT ${PORT}`);
});
