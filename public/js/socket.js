let socket = io();
socket.on('mensaje', (informacion) => {
    console.log(informacion);
});
socket.emit('mensaje', 'estoy conectado');
socket.on('listos', (mensaje) => {
    console.log(mensaje);
});