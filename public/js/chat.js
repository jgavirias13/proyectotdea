const chatSocket = io('/soporte');
const restantesElement = document.querySelector('#restantes');

let numRestantes = 0;

chatSocket.emit('usuarioNuevo');
chatSocket.on('cambiarRestantes', (restantes) => {
    numRestantes = parseInt(restantes);
    restantesElement.innerHTML = numRestantes;
});

chatSocket.on('actualizarRestantes', () => {
    chatSocket.emit('actualizarRestantes');
});