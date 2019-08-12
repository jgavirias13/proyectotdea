class Mensaje{
    constructor(emisor, contenido){
        this.emisor = emisor;
        this.fecha = new Date();
        this.contenido = contenido;
    }

    getEmisor(){
        return this.emisor;
    }

    getFecha(){
        return this.fecha;
    }

    getContenido(){
        return this.contenido;
    }
}

module.exports = {
    Mensaje
}