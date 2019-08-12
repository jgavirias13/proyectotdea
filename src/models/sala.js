class Sala{
    constructor(usuario, coordinador){
        this.usuario = usuario;
        this.coordinador = coordinador;
        this.mensajes = [];
        this.id = usuario.id + coordinador.id + Date.now();
    }

    getId(){
        return this.id;
    }

    agregarMensaje(mensaje){
        this.mensajes.push(mensaje);
    }

    getUsuario(){
        return this.usuario;
    }

    getCoordinador(){
        return this.coordinador;
    }
}

module.exports = {
    Sala
}