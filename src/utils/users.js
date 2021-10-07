const users = []

// Join user to chat
function userJoin(id, nome, sala) {
    const user = { id, nome, sala };

    // verifica se usuario já está na sala
    const userInRoom = users.find((user) => user.nome == nome && user.sala === sala);
    
    if (userInRoom) userInRoom.id = 
  
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
function getRoomUsers(sala){
    return users.filter(user => user.sala === sala)
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}