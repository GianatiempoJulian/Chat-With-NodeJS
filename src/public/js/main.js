// (Lado cliente)
$(function() {
    const socket = io();

    //! Variables:
    var name = '';

    //! Accedemos a los objetos del DOM.
    const msgForm = $('#messages-form');
    const msg = $('#message');
    const chat = $('#chat');

    const username = $('#username');
    const usernameForm = $('#username-form');
    const usernameError = $('#username-error');

    const usersConnectedList = $('#users-connected-list');

    //? Eventos.

    //! Enviamos mensaje al servidor:
    msgForm.submit(event => {

        //Evitamos que se recargue la pantalla.
        event.preventDefault();

        //Con .emit podemos emitir un mensaje.
        //Con .val obtenemos el valor de la variable.
        socket.emit('Send message', msg.val());

        //Limpiamos el input del mensaje.
        msg.val('');

        //El mensaje debera ser recibido desde sockets.js

    });

    //! Obtenemos respuesta del servidor:
    //El primer parametro de on tiene que ser IGUAL al primero de
    // .emit en donde hayamos enviado el nuevo mensaje.
    socket.on('New message', function(data) {

        // Para ponerle color a nuestro mensaje.
        let color = "";

        if (name == data.username) {
            color = "#967E76";
        }

        //Vamos a mostrar los mensajes en el chat.
        chat.append(`<div class="msg-area mb-2 msg-box" style="background-color:${color}"><b>${data.username}</b><p class="msg">${data.msg}</p></div>`);
    });

    //! Nuevo usuario:

    usernameForm.submit(event => {
        event.preventDefault();
        socket.emit('New user', username.val(), data => {
            if (data) {
                name = username.val();
                $('#username-wrap').hide();
                $('#content-wrap').show();
            } else {
                usernameError.html('<div class="alert alert-danger" > This username is not available </div>');
            }
            //Limpiamos variable username.
            username.val('')
        });
    });

    //! Obtener arreglo de usuarios conectados:

    socket.on('Users-list', data => {

        let userList = '';
        let color = '';
        let logout = '';

        for (let i = 0; i < data.length; i++) {
            if (name == data[i]) {

                color = "#967E76";
                logout = '<a class="logout" href="/">Logout</a>';
            } else {

                color = "#D7C0AE"
                logout = '';
            }
            userList += `<p class="userInList" style="background-color: ${color}">${data[i]} ${logout}</p>`
        }

        usersConnectedList.html(userList);
    })

})