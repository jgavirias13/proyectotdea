const fs = require('fs');
const Usuario = require('./models/usuario');

const registrarUsuario = (datosUsuario, callback) => {
    let usuario = new Usuario({
        nombre: datosUsuario.nombre,
        documento: datosUsuario.documento,
        correo: datosUsuario.correo,
        telefono: datosUsuario.telefono,
        rol: 'aspirante',
        password: datosUsuario.password
    })

    usuario.save((err) => {
        if (err){
            callback(false);
        }else{
            callback(true);
        }
    })
}

const iniciarSesion = (datosSesion, callback) => {
    let email = datosSesion.email;
    let password = datosSesion.password;
    Usuario.findOne({correo: email}, (err, usuario) =>{
        if(usuario && usuario.password == password){
            callback(usuario);
        }else{
            callback(false);
        }
    });
}

const listarUsuario = (documento, callback) => {
    Usuario.findOne({documento: documento}, (err, usuario) => {
        callback(usuario);
    });
}

const listarUsuarios = (callback) => {
    Usuario.find((err, usuarios) => {
        callback(usuarios);
    });
}

const convertirCoordinador = (idUsuario, callback) => {
    Usuario.findOneAndUpdate({documento: idUsuario}, {rol: 'coordinador'}, {new: true}, (err, usuario) => {
        if(err){
            callback(1);
        }else{
            callback(0);
        }
    });
}

const convertirAspirante = (idUsuario, callback) => {
    Usuario.findOneAndUpdate({documento: idUsuario}, {rol: 'aspirante'}, {new: true}, (err, usuario) => {
        if(err){
            callback(1);
        }else{
            callback(0);
        }
    });
}

const eliminarUsuario = (idUsuario, callback) => {
    Usuario.findOneAndDelete({documento: idUsuario}, (err, usuario) => {
        if(err){
            callback(1);
        }else{
            callback(0);
        }
    })
}

const actualizarUsuario = (datosUsuario, callback) => {
    Usuario.findOneAndUpdate({documento: datosUsuario.documento}, {new: true}, {
        nombre: datosUsuario.nombre,
        correo: datosUsuario.correo,
        telefono: datosUsuario.telefono
    }, (err, usuario) => {
        if(err){
            callback(1);
        }else{
            callback(0);
        }
    });
}

module.exports = {
    registrarUsuario,
    iniciarSesion,
    listarUsuario,
    listarUsuarios,
    convertirAspirante,
    convertirCoordinador,
    eliminarUsuario,
    actualizarUsuario
};