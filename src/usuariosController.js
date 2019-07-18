const fs = require('fs');
const Usuario = require('./models/usuario');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registrarUsuario = (datosUsuario, callback) => {
    bcrypt.hash(datosUsuario.password, saltRounds, (err, hash) => {
        if(err){
            return callback(false);
        }

        let usuario = new Usuario({
            nombre: datosUsuario.nombre,
            documento: datosUsuario.documento,
            correo: datosUsuario.correo,
            telefono: datosUsuario.telefono,
            rol: 'aspirante',
            password: hash
        })
    
        usuario.save((err) => {
            if (err){
                callback(false);
            }else{
                callback(true);
            }
        })
    })
}

const iniciarSesion = (datosSesion, callback) => {
    let email = datosSesion.email;
    let password = datosSesion.password;
    Usuario.findOne({correo: email}, (err, usuario) =>{
        bcrypt.compare(password, usuario.password, (err, res) => {
            if(res == true){
                callback(usuario);
            }else{
                callback(false);
            }
        });
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
    Usuario.findOneAndUpdate({documento: datosUsuario.documento}, {
        nombre: datosUsuario.nombre,
        correo: datosUsuario.correo,
        telefono: datosUsuario.telefono,
        rol: datosUsuario.rol
    }, {new: true}, (err, usuario) => {
        if(err){
            callback(1);
        }else{
            callback(0);
        }
    });
}

const obtenerDocentes = (callback) => {
    Usuario.find({rol: 'docente'}, (err, usuarios) => {
        if(err){
            callback(false);
        }else{
            callback(usuarios);
        }
    });
}

module.exports = {
    registrarUsuario,
    iniciarSesion,
    listarUsuario,
    listarUsuarios,
    eliminarUsuario,
    actualizarUsuario,
    obtenerDocentes
};