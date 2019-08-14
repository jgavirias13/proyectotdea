const chatSocket = io('/soporte');
const restantesElement = document.querySelector('#restantes');
const chatElement = document.querySelector('#chatElement');
const infoSoporte = document.getElementById('infoSoporte');
const chatContainer = document.getElementById('chatContainer');
const mensajes = document.getElementById('mensajes');
const btnTerminar = document.getElementById('btnTerminar');
const msgFinChat = document.getElementById('msg_fin_chat');

let numRestantes = 0;
let salaAsignada;

chatSocket.emit('usuarioNuevo');

btnTerminar.onclick = () => {
    chatSocket.emit('terminarChat', salaAsignada);
    chatContainer.style.display = 'none';
    msgFinChat.style.display = 'block';
};

chatSocket.on('terminarChat', () => {
    chatContainer.style.display = 'none';
    msgFinChat.style.display = 'block';
});

chatSocket.on('cambiarRestantes', (restantes) => {
    numRestantes = parseInt(restantes);
    restantesElement.innerHTML = numRestantes;
});

$('#mensaje').on('keypress', (e) => {
    if(e.which === 13){
        let contenidoMensaje = $('#mensaje').val();

        chatSocket.emit('enviarMensaje', contenidoMensaje, salaAsignada);
    }
});

chatSocket.on('actualizarRestantes', () => {
    chatSocket.emit('actualizarRestantes');
});

chatSocket.on('recibirMensaje', (mensaje) => {
    let mensajeHtml = '<div class="msg_container';
    if(mensaje.emisor.id == salaAsignada.coordinador.id){
        mensajeHtml += ' darker">';
        mensajeHtml += `<p><strong>${salaAsignada.coordinador.nombre}: </strong>`
    }else{
        mensajeHtml += '">';
        mensajeHtml += `<p><strong>${salaAsignada.usuario.nombre}: </strong>`
    }
    mensajeHtml += `${mensaje.contenido}</p>`;
    mensajeHtml += `<span class="time-right">${mensaje.fecha}</span>`;
    mensajeHtml += '</div>';

    mensajes.innerHTML += mensajeHtml;
    $('#mensaje').val('');
    $("#mensajes").animate({ scrollTop: $('#mensajes').prop("scrollHeight")}, 500);
});

chatSocket.on('irASala', (sala) => {
    salaAsignada = sala;
    nombreCoordinador = sala.coordinador.nombre;
    chatElement.innerHTML = `<strong>Coordinador: </strong>${nombreCoordinador}`;
    infoSoporte.style.display = 'none';
    chatContainer.style.display = 'block';
});