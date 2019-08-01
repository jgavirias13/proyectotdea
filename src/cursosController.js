const fs = require('fs');
const Curso = require('./models/curso');
const Usuario = require('./models/usuario');

const crear = (cursoBody, callback) => {

    let curso = new Curso({
        nombre: cursoBody.nombreCurso,
        id: cursoBody.idCurso,
        descripcion: cursoBody.descripcionCurso,
        valor: cursoBody.valorCurso,
        modalidad: cursoBody.modalidadCurso,
        intensidad: cursoBody.intensidadCurso,
        estado: 'disponible'
    });

    if(cursoBody.planCurso){
        curso.planEstudio = cursoBody.planCurso.path
    }

    curso.save((err, curso) => {
        if(err){
            callback(1);
        }else{
            callback(0);
        }
    });
}

const listar = (callback) => {
    Curso.find((err, cursos) => {
        callback(cursos);
    });
}

const listarDisponibles = (callback) => {
    Curso.find({estado: 'disponible'}, (err, cursos) => {
        callback(cursos);
    })
}

const listarCursosDocente = (docente, callback) => {
    Curso.find({docente: docente}).populate('docente').exec((err, cursos) => {
        callback(cursos);
    });
}

const listarCurso = (cursoDatos, callback) => {
    Curso.findOne({id: cursoDatos.id}).populate('docente').exec((err, curso) => {
        callback(curso);
    });
}

const cerrarCurso = (idCurso, idDocente, callback) => {
    console.log(idDocente);
    Usuario.findById(idDocente, (err, doc) => {
        if(err){
            return callback(false);
        }
        Curso.findOneAndUpdate({id: idCurso}, {estado: 'cerrado', docente: doc}, {new: true})
            .populate('docente').exec((err, curso) => {
                if(err){
                    callback(false);
                }else{
                    callback(curso);
                }
            });
    });
}

const abrirCurso = (idCurso, callback) => {
    Curso.findOneAndUpdate({id: idCurso}, {estado: 'disponible'}, {new: true})
        .populate('docente').exec((err, curso) => {
            if(err){
                callback(false);
            }else{
                callback(curso);
            }
        });
}

module.exports = {
    crear,
    listar,
    listarCurso,
    listarDisponibles,
    listarCursosDocente,
    cerrarCurso,
    abrirCurso
}