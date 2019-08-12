class Salas{
    constructor(){
        this.salas = [];
    }

    agregarSala(sala){
        this.salas.push(sala);
    }

    finalizarSala(sala){
        this.salas = this.salas.filter(salaL => salaL.id =! sala.id);
    }

    obtenerSala(idSala){
        return this.salas.find(sala => sala.id == idSala);
    }
}

module.exports = {
    Salas
}