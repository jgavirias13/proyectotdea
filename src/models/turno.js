class Turnos{
    constructor(){
        this.turnos = [];
    }

    agregarTurno(usuario){
        return this.turnos.push(usuario) - 1;
    }

    eliminarTurno(idUsuario){
        if(this.turnos.find(turno => turno.id == idUsuario)){
            this.turnos = this.turnos.filter(turno => turno.id != idUsuario);
            return true;
        }else{
            return false;
        }
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