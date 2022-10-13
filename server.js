const http = require('http');
const cors = require('cors');
const express = require('express');
const { Server } = require('socket.io');
const router = require('./app/routes/routes');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./app/users/users');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
    socket.on('join', ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room });
  
      if(error) return callback(error);
  
      socket.join(user.room);
  
      socket.emit('message', { user: 'Chat Room Bot', text: `Hi ${user.username}, welcome to Room ${user.room}.`});
      socket.broadcast.to(user.room).emit('message', { user: 'Chat Room Bot', text: `User ${user.username} has joined!` });
  
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
  
      callback();
    });
  
    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
  
      if(user) {
        io.to(user.room).emit('message', { user: user.username, text: message });
      }
  
      callback();
    });
  
    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
  
      if(user) {
        io.to(user.room).emit('message', { user: 'Chat Room Bot', text: `User ${user.username} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      }
    })
});
  
httpServer.listen(process.env.PORT || 8080, () => console.log(`Server has started.`));
