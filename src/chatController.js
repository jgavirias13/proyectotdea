const { Turnos } = require('./models/turno');
const io = require('socket.io');

const turnos = new Turnos();

const agregarTurno = (id, email) => {
    let usuario = {
        id: id,
        email: email
    }
    return turnos.agregarTurno(usuario);
}

const eliminarTurno = (id) => {
    turnos.eliminarTurno(id);
}

const obtenerRestantes = (id) => {
    return turnos.obtenerRestantes(id);
}

module.exports = {
    agregarTurno,
    eliminarTurno,
    obtenerRestantes
}