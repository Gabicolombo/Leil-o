const users = []
const messages = []

// Join user to chat
function userJoin(id, name, room) {
    const user = { id, name, room };

    // verifica se usuario já está na room
    const userInRoom = users.find((user) => user.name == name && user.room === room);
    
    if (userInRoom) userInRoom.id = id;
  
    users.push(user);
  
    return user;
}

// get current user
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

// User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

// pegar todos os usuários que estão na sala
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

function getUsers() {
    return users;
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getUsers
}