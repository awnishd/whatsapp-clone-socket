import { Server } from 'socket.io';
import dotenv from 'dotenv'
dotenv.config();
const PORT=9000 || process.env.PORT;
const io = new Server(PORT, {
    cors: {
        origin: 'https://whataspp.onrender.com',
    },
})


let users = [];

const addUser = (userData, socketId) => {
    !users.some(user => user.sub === userData.sub) && users.push({ ...userData, socketId });
}



const getUser = (userId) => {
    return users.find(user => user.sub === userId);
}




//console.log(users);
io.on('connection', (socket) => {
    console.log('user connected')


    socket.on("addUser", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);
        io.to(user.socketId).emit('getMessage', data)
    })

})
