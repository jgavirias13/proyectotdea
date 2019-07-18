const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    documento: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
        enum: ['aspirante', 'coordinador', 'docente']
    },
    password: {
        type: String,
        required: true
    }
});
usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;