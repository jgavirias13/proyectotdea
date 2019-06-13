const fs = require('fs');

var listaUsuarios;
const nombreArchivo = 'usuarios.json';

const cargarUsuarios = () => {
    let fileContent;
    try{
        fileContent = fs.readFileSync(nombreArchivo);
        listaUsuarios = JSON.parse(fileContent);
    }catch(err){
        listaUsuarios = [];
    }
}

const registrarUsuario = (datosUsuario) => {
    let usuario = {
        nombre: datosUsuario.nombre,
        documento: datosUsuario.documento,
        correo: datosUsuario.correo,
        telefono: datosUsuario.telefono,
        rol: 'aspirante',
        password: datosUsuario.password
    }

    if(!listaUsuarios.find(us => (us.documento == usuario.documento) || (us.correo == usuario.correo))){
        listaUsuarios.push(usuario);
        guardar();
        return true;
    }else{
        return false;
    }
}

const iniciarSesion = (datosSesion) => {
    let email = datosSesion.email;
    let password = datosSesion.password;
    let usuario = listaUsuarios.find(us => us.correo == email);

    if(usuario && usuario.password == password){
        return usuario;
    }else{
        return false;
    }
}

const listarUsuario = (documento) => {
    return listaUsuarios.find(usuario => usuario.documento == documento);
}

const listarUsuarios = () => {
    return listaUsuarios;
}

const convertirCoordinador = (idUsuario) => {
    let usuario = listaUsuarios.find(usuario => usuario.documento == idUsuario);
    if(usuario){
        usuario.rol = 'coordinador';
        guardar();
        return 0;
    }else{
        return 1;
    }
}

const convertirAspirante = (idUsuario) => {
    let usuario = listaUsuarios.find(usuario => usuario.documento == idUsuario);
    if(usuario){
        usuario.rol = 'aspirante';
        guardar();
        return 0;
    }else{
        return 1;
    }
}

const eliminarUsuario = (idUsuario) => {
    let nuevoListado = listaUsuarios.filter( usuario => usuario.documento != idUsuario);
    if(nuevoListado.length != listaUsuarios.length){
        listaUsuarios = nuevoListado;
        guardar();
        return 0;
    }else{
        return 1;
    }
}

const guardar = () => {
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile(nombreArchivo, datos, (err) => {
        if(err){
            console.log(err);
        }
    })
}

const actualizarUsuario = (datosUsuario) => {
    let usuario = listaUsuarios.find( usuario => usuario.documento == datosUsuario.documento);
    if(usuario){
        usuario.nombre = datosUsuario.nombre;
        usuario.correo = datosUsuario.correo;
        usuario.telefono = datosUsuario.telefono;

        guardar();

        return 0;
    }else{
        return 1;
    }
}


module.exports = {
    cargarUsuarios,
    registrarUsuario,
    iniciarSesion,
    listarUsuario,
    listarUsuarios,
    convertirAspirante,
    convertirCoordinador,
    eliminarUsuario,
    actualizarUsuario
};