const hbs = require('hbs');

hbs.registerHelper('accionCurso', (curso) =>{
    if(curso.estado == 'disponible'){
        return `<a href="/cerrarCurso?curso=${curso.id}" class="btn btn-danger">Cerrar curso</a>`;
    }else{
        return `<a href="/abrirCurso?curso=${curso.id}" class="btn btn-warning">Abrir curso</a>`;
    }
});