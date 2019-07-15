const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const inscripcionSchema = new Schema({
    idCurso:{
        type: String,
        required: true
    },
    idUsuario:{
        type: String,
        required: true
    }
})

inscripcionSchema.plugin(uniqueValidator);
inscripcionSchema.index({idCurso: 1, idUsuario: 1}, {unique: true});

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);

module.exports = Inscripcion;