const users = [];

const addUser = ({ id, username, room }) => {
  username = username;
  room = room;

  const existingUser = users.find((user) => user.room === room && user.username === username);

  if(!username || !room) return { error: 'Username or room are required.' };
  if(existingUser) return { error: 'Username is already used.' };

  const user = { id, username, room };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };