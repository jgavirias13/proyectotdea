const hbs = require('hbs');

hbs.registerHelper('rolesUsuario', (usuario) => {
    let roles = ['aspirante', 'coordinador', 'docente'];
    let opciones = "";
    roles.forEach((rol) => {
        opciones += "<option";
        if(usuario.rol == rol){
            opciones += " selected";
        }
        opciones += ` value="${rol}">${rol}</option>`;
    });
    return opciones;
});