const express = require('express')
const app = express()
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)

app.use(express.urlencoded({extended: true}))
app.use('/', express.static(__dirname + '/public'))

let users = {}
let socketMap = {}

function login (socket, user) {
    socket.join(user)
    socket.emit('logged_in')
    socketMap[socket.id] = user
    console.log(users, socketMap);
}

io.on('connection', (socket) => {
    console.log('Connected to socket with id: ', socket.id);

    socket.on('login', (data) => {
        if (users[data.username]) {
            if (users[data.username] == data.pass) {
                login(socket, data.username)
            } else {
                socket.emit('login_failed')
            }
        } else {
            users[data.username] = data.pass
            login(socket, data.username)
        }
    })
    socket.on('msg_send', (data) => {
        data.from = socketMap[socket.id]
        if (data.to) {
            io.to(data.to).emit('msg_rcvd', data)
            socket.emit('msg_rcvd', data)
        } else {
            socket.broadcast.emit('msg_rcvd', data)
        }
    })
})

server.listen(5555, '0.0.0.0',() => {
    console.log('Server started at http://localhost:5555');
})