const fs = require('fs');
const usuariosController = require('./usuariosController');
const cursosController = require('./cursosController');

var listaInscripciones;
const nombreArchivo = 'inscripciones.json';

const cargarInscripciones = () => {
    let fileContent;
    try{
        fileContent = fs.readFileSync(nombreArchivo);
        listaInscripciones = JSON.parse(fileContent);
    }catch(err){
        listaInscripciones = [];
    }
}

const guardar = () => {
    let datos = JSON.stringify(listaInscripciones);
    fs.writeFile(nombreArchivo, datos, (err) => {
        if(err){
            console.log(err);
        }
    })
}

const inscribir = (idUsuario, idCurso) => {
    if(!listaInscripciones.find(inscripcion => inscripcion.idUsuario == idUsuario
        && inscripcion.idCurso == idCurso)){
            let inscripcion = {
                idCurso: idCurso,
                idUsuario: idUsuario
            }
            listaInscripciones.push(inscripcion);
            guardar();
            return 0;
    }else{
        return 1;
    }
}

const listarInscritos = (idCurso) => {
    let inscripciones = listaInscripciones.filter(inscripcion => inscripcion.idCurso == idCurso);
    let inscritos = [];
    usuariosController.cargarUsuarios();
    inscripciones.forEach(inscripcion => {
        let usuario = usuariosController.listarUsuario(inscripcion.idUsuario);
        usuario.curso = idCurso;
        inscritos.push(usuario);
    });
    return inscritos;
}

const listarInscripciones = (idUsuario) => {
    let inscripciones = listaInscripciones.filter(inscripcion => inscripcion.idUsuario == idUsuario);
    let inscritos = [];
    cursosController.cargarCursos();
    inscripciones.forEach(inscripcion => {
        let curso = cursosController.listarCurso({id: inscripcion.idCurso});
        inscritos.push(curso);
    });
    return inscritos;
}

const eliminarInscripcion = (idCurso, idUsuario) => {
    let nuevoListado = listaInscripciones.filter(
        inscripcion => !(inscripcion.idCurso == idCurso && inscripcion.idUsuario == idUsuario));
    if(nuevoListado.length != listaInscripciones.length){
        listaInscripciones = nuevoListado;
        guardar();
        return 0;
    }else{
        return 1;
    }
}

module.exports = {
    cargarInscripciones,
    inscribir,
    listarInscritos,
    eliminarInscripcion,
    listarInscripciones
}