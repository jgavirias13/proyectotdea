const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cursosController =require('./src/cursosController');
const usuariosController = require('./src/usuariosController');
const inscripcionesController = require('./src/inscripcionesController');
const session = require('express-session');
const cookieParser = require('cookie-parser');

require('./src/helpers/administrarCurso');

const app = express();
const directorioPartials = path.join(__dirname, '/views/partials');
const directorioPublics = path.join(__dirname, '/public');
const directorioModules = path.join(__dirname, '/node_modules');

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
    usuariosController.cargarUsuarios();
    let usuario = usuariosController.iniciarSesion(req.body);
    
    if(usuario){
        req.session.usuario = usuario;
        cursosController.cargarCursos();
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
    usuariosController.cargarUsuarios();
    if(usuariosController.registrarUsuario(req.body)){
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
        cursosController.cargarCursos();
        let listaCursos = cursosController.listarDisponibles();
        res.render('listarCursos', {
            cursos: listaCursos
        });
    }else{
        res.redirect('/');
    }
});

app.get('/listarCurso', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        cursosController.cargarCursos();
        let curso = cursosController.listarCurso(req.query);

        res.render('listarCurso', {
            curso: curso
        });
    }else{
        res.redirect('/');
    }
});

app.get('/administrarCursos', (req, res) => {
    let usuario = req.session.usuario;
    if(usuario && req.cookies.user_sid){
        if(usuario.rol == 'coordinador'){
            cursosController.cargarCursos();
            let listaCursos = cursosController.listar();
            res.render('administrarCursos', {
                cursos: listaCursos
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
            cursosController.cargarCursos();
            inscripcionesController.cargarInscripciones();
            let curso = cursosController.listarCurso(req.query);
            let inscritos = inscripcionesController.listarInscritos(curso.id);
            res.render('administrarCurso', {
                curso: curso,
                inscritos: inscritos
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
            cursosController.cargarCursos();
            inscripcionesController.cargarInscripciones();
            let curso = cursosController.cerrarCurso(req.query.curso);
            if(curso){
                let inscritos = inscripcionesController.listarInscritos(curso.id);
                let mensajeExito = crearExitoso('Curso cerrado con exito');
                res.render('administrarCurso', {
                    mensajeExito: mensajeExito,
                    curso: curso,
                    inscritos: inscritos
                });
            }else{
                let listaCursos = cursosController.listar();
                let mensajeError = crearError('Ha ocurrido un error con tu solicitud');
                res.render('administrarCursos', {
                    cursos: listaCursos,
                    mensajeError: mensajeError
                });
            }
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
            cursosController.cargarCursos();
            inscripcionesController.cargarInscripciones();
            let curso = cursosController.abrirCurso(req.query.curso);
            if(curso){
                let inscritos = inscripcionesController.listarInscritos(curso.id);
                let mensajeExito = crearExitoso('Curso abierto con exito');
                res.render('administrarCurso', {
                    mensajeExito: mensajeExito,
                    curso: curso,
                    inscritos: inscritos
                });
            }else{
                let listaCursos = cursosController.listar();
                let mensajeError = crearError('Ha ocurrido un error con tu solicitud');
                res.render('administrarCursos', {
                    cursos: listaCursos,
                    mensajeError: mensajeError
                });
            }
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
            cursosController.cargarCursos();
            let retorno = cursosController.crear(req.body);
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
        if(curso){
            inscripcionesController.cargarInscripciones();
            let res = inscripcionesController.inscribir(usuario.documento, curso);
            if(res == 0){
                mensajeExito = crearExitoso('Inscrito con exito!');
            }else{
                mensajeError = crearError('Ya estas inscrito a este curso');
            }
        }else{
            mensajeError = crearError('Ha ocurrido un error en tu inscripción');
        }

        cursosController.cargarCursos();
        let listaCursos = cursosController.listarDisponibles();
        res.render('listarCursos', {
            cursos: listaCursos,
            mensajeError: mensajeError,
            mensajeExito: mensajeExito
        });
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
            inscripcionesController.cargarInscripciones();
            let mensajeError = '';
            let mensajeExito = '';
            let ret = inscripcionesController.eliminarInscripcion(idCurso, idUsuario);
            if(ret == 0){
                mensajeExito = crearExitoso('Se ha eliminado la inscripción');
            }else{
                mensajeError = crearError('No se ha podido eliminar, por favor intente de nuevo');
            }
            let cursoId = {id: idCurso};
            let curso = cursosController.listarCurso(cursoId);
            let inscritos = inscripcionesController.listarInscritos(curso.id);
            res.render('administrarCurso', {
                curso: curso,
                inscritos: inscritos,
                mensajeError: mensajeError,
                mensajeExito: mensajeExito
            });

        }else{
            res.redirect('/listarCursos');
        }
    }else{
        res.redirect('/');
    }
})

app.listen(3000, () =>{
    console.log('Escuchando en el puerto 3000');
});