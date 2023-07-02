// Para trabajar con los Sockets. (Lado servidor)

// Aquí evaluaremos toda la lógica del lado servidor para la comunicación.
module.exports = (io) => {

    //! Variables:
    let usernames = []; //? Para verificar si el username esta en uso.

    // Comprobamos que usuario esta activo. Este método "on" esta en la documentación 
    // de Socket.io 
    io.on('connection', socket => {

        //! Recibimos y enviamos mensaje.
        //Al recibir un mensaje, recojemos los datos de este ultimo.
        //El primer parametro de on tiene que ser IGUAL al primero de
        // .emit en donde hayamos enviado el mensaje.
        socket.on('Send message', data => {

            //Emitimos el mensaje para que todos puedan verlo.

            //Con esto vamos a recibir la informacion desde el lado cliente.
            //(main.js)
            io.sockets.emit('New message', {
                msg: data,
                username: socket.username
            });

        });

        //! Recibimos nuevo usuario.
        //Enviamos callback para verificar que se cumplan los if del lado
        //servidor.
        socket.on('New user', (data, callback) => {
            if (usernames.indexOf(data) != -1) {
                callback(false); //Si existe enviaremos un false al lado cliente.
            } else {
                callback(true); //Si no existe enviaremos un true al lado cliente.
                socket.username = data;
                usernames.push(socket.username);

                // Le enviamos al lado cliente la lista de usuarios.
                io.sockets.emit('Users-list', usernames);
            }
        });

        //! Desconectar usuario.
        socket.on('Logout', data => {
            //Eliminamos el usuario de la lista de usuarios.    

            // Si no existe, nos echa automaticamente de la función.
            if (!socket.username) {
                return;
            } else {
                usernames.splice(usernames.indexOf(socket.username), 1); // Eliminamos si encuentra.
                io.sockets.emit('Users-list', usernames);
            }
        });



    });
}