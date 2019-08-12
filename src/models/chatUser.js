class ChatUser{
    constructor(nombre, email, id){
        this.id = id;
        this.nombre = nombre;
        this.email = email;
    }

    getNombre(){
        return this.nombre;
    }

    getId(){
        return this.id;
    }

    getEmail(){
        return this.email;
    }
}

module.exports = {
    ChatUser
}