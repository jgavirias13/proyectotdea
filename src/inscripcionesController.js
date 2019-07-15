const fs = require('fs');
const Usuario = require('./models/usuario');
const Curso = require('./models/curso');
const Inscripcion = require('./models/inscripcion');

const inscribir = (idUsuario, idCurso, callback) => {
    let inscripcion = new Inscripcion({
        idCurso: idCurso,
        idUsuario: idUsuario
    });
    inscripcion.save((err, inscripcion) => {
        if(err){
            callback(1);
        }else{
            callback(0);
        }
    })
}

const listarInscritos = (idCurso, callback) => {
    Inscripcion.find({idCurso: idCurso}, (err, inscripciones) => {
        let inscritos = [];
        inscripciones.forEach(inscripcion => {inscritos.push(inscripcion.idUsuario)});
        Usuario.find({documento: {$in: inscritos}}, (err, usuarios) => {
            usuarios.forEach(usuario => {usuario.curso = idCurso});
            callback(usuarios);
        });
    });
}

const listarInscripciones = (idUsuario, callback) => {
    Inscripcion.find({idUsuario: idUsuario}, (err, inscripciones) => {
        let inscritos = [];
        inscripciones.forEach(inscripcion => {inscritos.push(inscripcion.idCurso)});
        Curso.find({id: {$in: inscritos}}, (err, cursos) => {
            callback(cursos);
        });
    });
}

const eliminarInscripcion = (idCurso, idUsuario, callback) => {
    Inscripcion.findOneAndDelete({idCurso: idCurso, idUsuario: idUsuario}, (err, inscripcion) => {
        if(err){
            callback(1);
        }else{
            callback(0);
        }
    });
}

module.exports = {
    inscribir,
    listarInscritos,
    eliminarInscripcion,
    listarInscripciones
}