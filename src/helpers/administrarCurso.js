const hbs = require('hbs');

hbs.registerHelper('accionCurso', (curso) =>{
    if(curso.estado == 'disponible'){
        return `<a href="#" class="btn btn-danger show-alert">Cerrar curso</a>`;
    }else{
        return `<a href="/abrirCurso?curso=${curso.id}" class="btn btn-warning">Abrir curso</a>`;
    }
});

hbs.registerHelper('listarDocentes', (docentes) => {
    let lista = "[";
    docentes.forEach(docente => {
        lista += `{text: "${docente.nombre}", value: "${docente.id}"}`;
    });
    lista += "]";
    return lista;
})