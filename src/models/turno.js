class Turnos{
    constructor(){
        this.turnos = [];
    }

    agregarTurno(usuario){
        return this.turnos.push(usuario) - 1;
    }

    eliminarTurno(idUsuario){
        this.turnos = this.turnos.filter(turno => turno.id != idUsuario);
    }

    obtenerRestantes(idUsuario){
        return this.turnos.findIndex(turno => turno.id == idUsuario);
    }

}

module.exports = {
    Turnos
};