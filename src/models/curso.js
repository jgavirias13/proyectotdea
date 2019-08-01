const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    modalidad: {
        type: String,
        enum: ['Virtual', 'Presencial']
    },
    intensidad: {
        type: String
    },
    estado: {
        type: String,
        required: true,
        enum: ['disponible', 'cerrado']
    },
    docente: {
        type: Schema.Types.ObjectId, ref: 'Usuario'
    },
    planEstudio: {
        type: String
    }
});
cursoSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoSchema)

module.exports = Curso;