const fs = require('fs');

var listaCursos;
const nombreArchivo = 'cursos.json';

const cargarCursos = () => {
    let fileContent;
    try{
        fileContent = fs.readFileSync(nombreArchivo);
        listaCursos = JSON.parse(fileContent);
    }catch(err){
        listaCursos = [];
    }
}

const crear = (cursoBody) => {

    let curso = {
        nombre: cursoBody.nombreCurso,
        id: cursoBody.idCurso,
        descripcion: cursoBody.descripcionCurso,
        valor: cursoBody.valorCurso,
        modalidad: cursoBody.modalidadCurso,
        intensidad: cursoBody.intensidadCurso,
        estado: 'disponible'
    };

    if(!listaCursos.find(cursoLista => cursoLista.id == curso.id)){
        listaCursos.push(curso);
        guardar();
        return 0;
    }else{
        return 1;
    }
    
}

const guardar = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile(nombreArchivo, datos, (err) => {
        if(err){
            console.log(err);
        }
    })
}

module.exports = {
    crear,
    cargarCursos
}