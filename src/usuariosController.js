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
    console.log(email);
    let password = datosSesion.password;
    let usuario = listaUsuarios.find(us => us.correo == email);

    if(usuario && usuario.password == password){
        return usuario;
    }else{
        return false;
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


module.exports = {
    cargarUsuarios,
    registrarUsuario,
    iniciarSesion
};