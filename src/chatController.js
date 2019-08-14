const correosController = require('./correosController');
const { Turnos } = require('./models/turno');
const { Sala } = require('./models/sala');
const { ChatUser } = require('./models/chatUser');
const { Mensaje } = require('./models/mensaje');
const { Salas } = require('./models/salas');

const turnos = new Turnos();
const salas = new Salas();

const agregarTurno = (id, email, nombre) => {
    let usuario = new ChatUser(nombre, email, id);
    return turnos.agregarTurno(usuario);
}

const eliminarTurno = (id) => {
    return turnos.eliminarTurno(id);
}

const obtenerRestantes = (id) => {
    return turnos.obtenerRestantes(id);
}

const obtenerTotalRestantes = () => {
    return turnos.obtenerTotalRestantes();
}

const siguienteTurno = (idCoordinador, nombre, email) => {
    let coordinador = new ChatUser(nombre, email, idCoordinador);
    let usuario = turnos.siguienteTurno();
    let sala = new Sala(usuario, coordinador);
    salas.agregarSala(sala);
    return sala;
}

const enviarMensaje = (contenidoMensaje, idCliente, sala) => {
    let usuario;
    if(idCliente == sala.usuario.id){
        usuario = sala.usuario;
    }else{
        usuario = sala.coordinador;
    }
    let mensaje = new Mensaje(usuario, contenidoMensaje);
    let salaLista = salas.obtenerSala(sala.id);
    salaLista.agregarMensaje(mensaje);
    return mensaje;
}

const obtenerSalaUsuario = (idUsuario) => {
    return salas.obtenerSalaUsuario(idUsuario);
}

const enviarConversacion = (sala) => {
    let salaLista = salas.obtenerSala(sala.id);
    let usuario = sala.usuario;
    let coordinador = sala.coordinador;
    let mensajes = salaLista.mensajes;

    correosController.enviarConversacion(usuario, mensajes);
    correosController.enviarConversacion(coordinador, mensajes);
}

module.exports = {
    agregarTurno,
    eliminarTurno,
    obtenerRestantes,
    obtenerTotalRestantes,
    siguienteTurno,
    enviarMensaje,
    obtenerSalaUsuario,
    enviarConversacion
}