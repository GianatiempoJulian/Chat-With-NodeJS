const express = require('express');
const path = require('path');
const sockets = require('./sockets');

const app = express();

const server = require('http').Server(app); // Necesario para conectar Socket.io
const socketio = require('socket.io')(server); // Lo requerimos y lo vinculamos a server.

const PORT = process.env.PORT || 3000;

//! Archivos estáticos como el index.html y demás:

app.use(express.static(path.join(__dirname, 'public')));

//! Vamos a requerir lo que se encuentre en sockets.js

// Ejecutamos la función del archivo sockets.js
require('./sockets')(socketio);

//! Listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})