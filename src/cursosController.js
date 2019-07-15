const fs = require('fs');
const Curso = require('./models/curso');

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
        cursos.forEach(curso => {
            curso.valor = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP'
            }).format(curso.valor);
        });
        callback(cursos);
    });
}

const listarDisponibles = (callback) => {
    Curso.find({estado: 'disponible'}, (err, cursos) => {
        cursos.forEach(curso => {
            curso.valor = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP'
            }).format(curso.valor);
        });
        callback(cursos);
    })
}

const listarCurso = (cursoDatos, callback) => {
    Curso.findOne({id: cursoDatos.id}, (err, curso) =>{
        curso.valor = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(curso.valor);
        callback(curso);
    });
}

const cerrarCurso = (idCurso, callback) => {
    Curso.findOneAndUpdate({id: idCurso}, {estado: 'cerrado'}, {new: true}, (err, curso) => {
        if(err){
            callback(false);
        }else{
            callback(curso);
        }
    });
}

const abrirCurso = (idCurso, callback) => {
    Curso.findOneAndUpdate({id: idCurso}, {estado: 'disponible'}, {new: true}, (err, curso) => {
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
    cerrarCurso,
    abrirCurso
}