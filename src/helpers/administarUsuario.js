const hbs = require('hbs');

hbs.registerHelper('accionRol', (usuario) => {
    if(usuario.rol == 'coordinador'){
        return `<a href="/convertirAspirante?usuario=${usuario.documento}">Cambiar a aspirante</a>`;
    }else{
        return `<a href="/convertirCoordinador?usuario=${usuario.documento}">Cambiar a coordinador</a>`;
    }
});