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

    obtenerTotalRestantes(){
        return this.turnos.length;
    }

    siguienteTurno(){
        let turnoUsuario = this.turnos.shift();
        return turnoUsuario;
    }

}

module.exports = {
    Turnos
};