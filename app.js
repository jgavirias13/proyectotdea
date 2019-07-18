const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cursosController =require('./src/cursosController');
const usuariosController = require('./src/usuariosController');
const inscripcionesController = require('./src/inscripcionesController');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('./src/helpers/administrarCurso');
require('./src/helpers/administarUsuario');

const app = express();
const directorioPartials = path.join(__dirname, '/views/partials');
const directorioPublics = path.join(__dirname, '/public');
const directorioModules = path.join(__dirname, '/node_modules');

const port = process.env.PORT || 3000;
const urlDB = "mongodb+srv://jgavirias13:CtUVmt85NA17FlY7@virtualtdea-s9l0m.mongodb.net/tdea?retryWrites=true&w=majority";

function crearError(mensaje){
    return `<div class="alert alert-danger" role="alert">${mensaje}</div>`;
}

function crearExitoso(mensaje){
    return `<div class="alert alert-success" role="alert">${mensaje}</div>`;
}

hbs.registerPartials(directorioPartials);
app.use(express.static(directorioPublics));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'random',
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: 600000
    }
}));
app.use((req, res, next) => {
    if(req.cookies.user_sid && !req.session.usuario){
        res.clearCookie('user_sid');
    }else if(req.cookies.user_sid && req.session.usuario){
        res.locals.session = true;
        res.locals.nombre = req.session.usuario.correo;
        switch(req.session.usuario.rol){
            case "aspirante":
                res.locals.aspirante = true;
                break;
            case "coordinador":
                res.locals.coordinador = true;
                break;
            case "docente":
                res.locals.docente = true;
                break;
        }
    }
    next();
})

app.use('/css', express.static(directorioModules + '/bootstrap/dist/css'));
app.use('/js', express.static(directorioModules + '/jquery/dist/'));
app.use('/js', express.static(directorioModules + '/popper.js/dist/'));
app.use('/js', express.static(directorioModules + '/bootstrap/dist/js'));
app.set('view engine', 'hbs');

var sessionChecker = (req, res, next) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            res.redirect('/administrarCursos');
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        next();
    }
}


app.get('/', sessionChecker,(req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    usuariosController.iniciarSesion(req.body, (usuario) =>{
        if(usuario){
            req.session.usuario = usuario;
            if(usuario.rol == 'coordinador'){
                res.redirect('/administrarCursos')
            }else{
                res.redirect('/listarCursos');
            }
        }else{
            let mensajeError = crearError('Email o contraseña incorrectos');
            res.render('index', {
                mensajeError: mensajeError,
                email: req.body.email
            });
        }
    });
});

app.get('/logout', (req, res) => {
    if(req.cookies.user_sid && req.session.usuario){
        res.clearCookie('user_sid');
        req.session.usuario = null;
    }
    res.redirect('/');
})

app.get('/registrar', sessionChecker,(req, res) => {
    res.render('registrar');
});

app.post('/registrar', (req, res) => {
    usuariosController.registrarUsuario(req.body, (result) => {
        if(result){
            let mensajeExito = crearExitoso('Registrado con exito');
            res.render('index', {
                mensajeExito: mensajeExito
            });
        }else{
            let mensajeError = crearError('Documento o correo ya registrados');
            res.render('registrar', {
                mensajeError: mensajeError,
                nombre: req.body.nombre,
                documento: req.body.documento,
                correo: req.body.correo,
                telefono: req.body.telefono
            });
        }
    });
})

app.get('/crearCurso', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            res.render('crearCurso');
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.get('/listarCursos', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        cursosController.listarDisponibles((listaCursos) => {
            if(usuario.rol == 'coordinador'){
                res.render('listarCursos', {
                    cursos: listaCursos
                });
            }else{
                res.render('listarCursos', {
                    cursos: listaCursos
                });
            }
        });
    }else{
        res.redirect('/');
    }
});

app.get('/listarInscripciones', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        inscripcionesController.listarInscripciones(usuario.documento, (listaInscripciones) => {
            if(usuario.rol == 'coordinador'){
                res.render('listarInscripciones', {
                    cursos: listaInscripciones
                });
            }else{
                res.render('listarInscripciones', {
                    cursos: listaInscripciones
                });
            }
        });
    }else{
        res.redirect('/');
    }
});

app.get('/listarCurso', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        cursosController.listarCurso(req.query, (curso) => {
            if(usuario.curso == 'coordinador'){
                res.render('listarCurso', {
                    curso: curso
                });
            }else{
                res.render('listarCurso', {
                    curso: curso
                });
            }
        });
    }else{
        res.redirect('/');
    }
});

app.get('/administrarCursos', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            cursosController.listar((listaCursos) => {
                res.render('administrarCursos', {
                    cursos: listaCursos
                });
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.get('/administrarCurso', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            cursosController.listarCurso(req.query, (curso) => {
                inscripcionesController.listarInscritos(curso.id, (inscritos) => {
                    res.render('administrarCurso', {
                        curso: curso,
                        inscritos: inscritos
                    });
                });
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.get('/cerrarCurso', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            cursosController.cerrarCurso(req.query.curso, (curso) => {
                if(curso){
                    inscripcionesController.listarInscritos(curso.id, (inscritos) => {
                        let mensajeExito = crearExitoso('Curso cerrado con exito');
                        res.render('administrarCurso', {
                            mensajeExito: mensajeExito,
                            curso: curso,
                            inscritos: inscritos
                        });
                    });
                }else{
                    cursosController.listar((listaCursos) => {
                        let mensajeError = crearError('Ha ocurrido un error con tu solicitud');
                        res.render('administrarCursos', {
                            cursos: listaCursos,
                            mensajeError: mensajeError
                        });
                    });
                } 
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.get('/abrirCurso', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            cursosController.abrirCurso(req.query.curso, (curso) => {
                if(curso){
                    inscripcionesController.listarInscritos(curso.id, (inscritos) => {
                        let mensajeExito = crearExitoso('Curso abierto con exito');
                        res.render('administrarCurso', {
                            mensajeExito: mensajeExito,
                            curso: curso,
                            inscritos: inscritos
                        });
                    });
                }else{
                    cursosController.listar((listaCursos) => {
                        let mensajeError = crearError('Ha ocurrido un error con tu solicitud');
                        res.render('administrarCursos', {
                            cursos: listaCursos,
                            mensajeError: mensajeError
                        });
                    });
                }
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.post('/crearCurso', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            cursosController.crear(req.body, (retorno) => {
                let mensajeError;
                let mensajeExito;
                switch(retorno){
                    case 0:
                        mensajeExito = 'Curso creado con exito!';
                        break;
                    case 1:
                        mensajeError = 'El id de curso indicado ya existe!';
                        break;
                    case 2:
                        mensajeError = 'No se ha podido guardar el curso, intentelo de nuevo';
                        break;
                    default:
                        mensajeError = 'Error desconocido';
                        break;
                }
    
                if(mensajeError){
                    mensajeError = crearError(mensajeError);
                }else if(mensajeExito){
                    mensajeExito = crearExitoso(mensajeExito);
                }
    
                res.render(('crearCurso'), {
                    mensajeError: mensajeError,
                    mensajeExito: mensajeExito,
                    nombreCurso: req.body.nombreCurso,
                    idCurso: req.body.idCurso,
                    descripcionCurso: req.body.descripcionCurso,
                    valorCurso: req.body.valorCurso,
                    modalidadCurso: req.body.modalidadCurso,
                    intensidadCurso: req.body.intensidadCurso
                });
            });
        }else{
            res.redirect('/listarCursos');
        }   
    }else{
        res.redirect('/');
    }
});

app.get('/inscribirCurso', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        let curso = req.query.curso;
        let mensajeError = '';
        let mensajeExito = '';

        renderDisponibles = () => {
            cursosController.listarDisponibles((listaCursos) => {
                res.render('listarCursos', {
                    cursos: listaCursos,
                    mensajeError: mensajeError,
                    mensajeExito: mensajeExito
                });
            });
        }

        if(curso){
            inscripcionesController.inscribir(usuario.documento, curso, (res) => {
                if(res == 0){
                    mensajeExito = crearExitoso('Inscrito con exito!');
                }else{
                    mensajeError = crearError('Ya estas inscrito a este curso');
                }
                renderDisponibles();
            });
        }else{
            mensajeError = crearError('Ha ocurrido un error en tu inscripción');
            renderDisponibles();
        }
    }else{
        res.redirect('/');
    }
});

app.get('/borrarInscrito', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            let idCurso = req.query.curso;
            let idUsuario = req.query.usuario;
            let mensajeError = '';
            let mensajeExito = '';
            inscripcionesController.eliminarInscripcion(idCurso, idUsuario, (ret) => {
                if(ret == 0){
                    mensajeExito = crearExitoso('Se ha eliminado la inscripción');
                }else{
                    mensajeError = crearError('No se ha podido eliminar, por favor intente de nuevo');
                }
                let cursoId = {id: idCurso};
                cursosController.listarCurso(cursoId, (curso) => {
                    let inscritos = inscripcionesController.listarInscritos(curso.id);
                    res.render('administrarCurso', {
                        curso: curso,
                        inscritos: inscritos,
                        mensajeError: mensajeError,
                        mensajeExito: mensajeExito
                    });
                });
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.get('/borrarInscripcion', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        let idCurso = req.query.curso;
        let idUsuario = usuario.documento;
        let mensajeError = '';
        let mensajeExito = '';
        inscripcionesController.eliminarInscripcion(idCurso, idUsuario, (ret) => {
            if(ret == 0){
                mensajeExito = crearExitoso('Se ha eliminado la inscripción');
            }else{
                mensajeError = crearError('No se ha podido eliminar, por favor intente de nuevo');
            }
            inscripcionesController.listarInscripciones(usuario.documento, (listaInscripciones) => {
                if(usuario.rol == 'coordinador'){
                    res.render('listarInscripciones', {
                        cursos: listaInscripciones,
                        mensajeError: mensajeError,
                        mensajeExito: mensajeExito
                    });
                }else{
                    res.render('listarInscripciones', {
                        cursos: listaInscripciones,
                        mensajeError: mensajeError,
                        mensajeExito: mensajeExito
                    });
                }
            });
        });
    }else{
        res.redirect('/');
    }
});


app.get('/administrarUsuarios', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            usuariosController.listarUsuarios((usuarios) => {
                res.render('administrarUsuarios', {
                    usuarios: usuarios
                })
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.get('/editarUsuario', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            usuariosController.listarUsuario(req.query.usuario, (usuario) => {
                res.render('editarUsuario', {
                    usuario: usuario
                })
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.post('/editarUsuario', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            usuariosController.actualizarUsuario(req.body, (resp => {
                usuariosController.listarUsuarios((listaUsuarios) => {
                    if(resp == 0){
                        let mensajeExito = crearExitoso('Usuario actualizado con exito');
                        res.render('administrarUsuarios', {
                            usuarios: listaUsuarios,
                            mensajeExito: mensajeExito
                        })
                    }else{
                        let mensajeError = crearError('Ha ocurrido un error en tu solicitud. Vuelve a intentarlo');
                        res.render('administrarUsuarios', {
                            usuarios: listaUsuarios,
                            mensajeError: mensajeError
                        })
                    }
                });
            }));
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
})

app.get('/convertirAspirante', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            usuariosController.convertirAspirante(req.query.usuario, (resp) => {
                usuariosController.listarUsuarios((listaUsuarios) => {
                    if(resp == 0){
                        let mensajeExito = crearExitoso('Rol cambiado con exito');
                        res.render('administrarUsuarios', {
                            mensajeExito: mensajeExito,
                            usuarios: listaUsuarios
                        });
                    }else{
                        let mensajeError = crearError('Ha ocurrido un error con tu solicitud');
                        res.render('administrarUsuarios', {
                            mensajeError: mensajeError,
                            usuarios: listaUsuarios
                        });
                    }
                });
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.get('/convertirCoordinador', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            usuariosController.convertirCoordinador(req.query.usuario, (resp) => {
                usuariosController.listarUsuarios((listaUsuarios) => {
                    if(resp == 0){
                        let mensajeExito = crearExitoso('Rol cambiado con exito');
                        res.render('administrarUsuarios', {
                            mensajeExito: mensajeExito,
                            usuarios: listaUsuarios
                        });
                    }else{
                        let mensajeError = crearError('Ha ocurrido un error con tu solicitud');
                        res.render('administrarUsuarios', {
                            mensajeError: mensajeError,
                            usuarios: listaUsuarios
                        });
                    }
                });
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

app.get('/eliminarUsuario', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            usuariosController.eliminarUsuario(req.query.usuario, (resp) => {
                usuariosController.listarUsuarios((listaUsuarios) => {
                    if(resp == 0){
                        let mensajeExito = crearExitoso('Usuario eliminado con exito');
                        res.render('administrarUsuarios', {
                            mensajeExito: mensajeExito,
                            usuarios: listaUsuarios
                        });
                    }else{
                        let mensajeError = crearError('Ha ocurrido un error con tu solicitud');
                        res.render('administrarUsuarios', {
                            mensajeError: mensajeError,
                            usuarios: listaUsuarios
                        });
                    }
                });
            });
        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
});

mongoose.connect(urlDB, {useNewUrlParser: true}, (err, res) => {
    if(err){
        console.log("** Ha ocurrido un error al conectar con la base de datos");
        return console.log(err);
    }
    return console.log(`Conectado a ${urlDB}`);
});

app.listen(port, () =>{
    console.log(`Escuchando en el puerto ${port}`);
});