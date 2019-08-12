const chatSocket = io('/soporte');
const restantesElement = document.querySelector('#restantes');
const chatElement = document.querySelector('#chatElement');
const btnSiguiente = document.getElementById('btnSiguiente');
const infoSoporte = document.getElementById('infoSoporte');
const chatContainer = document.getElementById('chatContainer');
const mensajes = document.getElementById('mensajes');

let salaAsignada;
let numRestantes = 0;

btnSiguiente.onclick = () => {
    chatSocket.emit('siguienteTurno');
}

$('#mensaje').on('keypress', (e) => {
    if(e.which === 13){
        let contenidoMensaje = $('#mensaje').val();

        chatSocket.emit('enviarMensaje', contenidoMensaje, salaAsignada);
    }
});


let initialRestantes = parseInt(restantesElement.innerHTML);
if(initialRestantes == 0){
    btnSiguiente.disabled = true;
}

chatSocket.on('recibirMensaje', (mensaje) => {
    console.log(mensaje);
    let mensajeHtml = '<div class="msg_container';
    if(mensaje.emisor == salaAsignada.coordinador.id){
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

chatSocket.on('actualizarTotalRestantes', (restantes) => {
    let restantesNum = parseInt(restantes);
    restantesElement.innerHTML = restantesNum;
    if(restantesNum == 0){
        btnSiguiente.disabled = true;
    }else{
        btnSiguiente.disabled = false;
    }
});

chatSocket.on('irASala', (sala) => {
    salaAsignada = sala;
    let nombreUsuario = sala.usuario.nombre;
    chatElement.innerHTML = `<strong>Usuario: </strong>${nombreUsuario}`;
    infoSoporte.style.display = 'none';
    chatContainer.style.display = 'block';
});