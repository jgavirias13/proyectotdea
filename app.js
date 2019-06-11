const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cursosController =require('./src/cursosController');
const usuariosController = require('./src/usuariosController');

const app = express();
const directorioPartials = path.join(__dirname, '/views/partials');
const directorioPublics = path.join(__dirname, '/public');
const directorioModules = path.join(__dirname, '/node_modules');

hbs.registerPartials(directorioPartials);
app.use(express.static(directorioPublics));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/css', express.static(directorioModules + '/bootstrap/dist/css'));
app.use('/js', express.static(directorioModules + '/jquery/dist/'));
app.use('/js', express.static(directorioModules + '/popper.js/dist/'));
app.use('/js', express.static(directorioModules + '/bootstrap/dist/js'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    usuariosController.cargarUsuarios();
    let usuario = usuariosController.iniciarSesion(req.body);
    
    if(usuario){
        cursosController.cargarCursos();
        if(usuario.rol == 'coordinador'){
            let listaCursos = cursosController.listar();
            res.render('administrarCursos', {
                cursos: listaCursos
            });
        }else{
            let listaCursos = cursosController.listarDisponibles();
            res.render('listarCursos', {
                cursos: listaCursos
            });
        }
    }else{
        let mensajeError = 'Email o contraseña incorrectos';
        mensajeError = '<div class="alert alert-danger" role="alert">'
            + mensajeError
            + '</div>';
        res.render('index', {
            mensajeError: mensajeError,
            email: req.body.email
        });
    }
})

app.get('/registrar', (req, res) => {
    res.render('registrar');
});

app.post('/registrar', (req, res) => {
    usuariosController.cargarUsuarios();
    if(usuariosController.registrarUsuario(req.body)){
        let mensajeExito = 'Registrado con exito';
        mensajeExito = '<div class="alert alert-success" role="alert">'
            + mensajeExito
            + '</div>';
        res.render('index', {
            mensajeExito: mensajeExito
        });
    }else{
        let mensajeError = 'Documento o correo ya registrados';
        mensajeError = '<div class="alert alert-danger" role="alert">'
            + mensajeError
            + '</div>';
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
    res.render('crearCurso');
});

app.get('/listarCursos', (req, res) => {
    cursosController.cargarCursos();
    let listaCursos = cursosController.listarDisponibles();
    res.render('listarCursos', {
        cursos: listaCursos
    });
})

app.get('/listarCurso', (req, res) => {
    cursosController.cargarCursos();
    let curso = cursosController.listarCurso(req.query);

    res.render('listarCurso', {
        curso: curso
    });
})

app.get('/administrarCursos', (req, res) => {
    res.render('administrarCursos');
})

app.post('/crearCurso', (req, res) => {
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
        mensajeError = '<div class="alert alert-danger" role="alert">'
            + mensajeError
            + '</div>';
    }else if(mensajeExito){
        mensajeExito = '<div class="alert alert-success" role="alert">'
            + mensajeExito
            + '</div>';
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
})


app.listen(3000, () =>{
    console.log('Escuchando en el puerto 3000');
});