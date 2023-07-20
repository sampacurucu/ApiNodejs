const router = require('express').Router();
const conexion = require('../config/conexion');

router.post('/registro-usuario', (req,res) => {
    const request = req.body

    const usuarioExiste = verificarUsuarioExiste(request.email)
    if(usuarioExiste) {
        res.status(400)
        .json({
            mensaje: 'El usuario ya se encuentra registrado. Por favor inicie sesion con sus credenciales para acceder.'
        })
        return
    }

    const maxId = obtenerMaxIdUsuario()
    const nuevoId = maxId + 1

    const sql = `INSERT INTO abogado(id_abogado, nombres, apellidos, email, password) 
        VALUES ($1,$2,$3,$4,$5)`;
    conexion.query(sql, [nuevoId, request.nombres, request.apellidos, request.email, request.password], (err, result) => {
        if(err) throw err
        else {
            res.status(200)
            .json({
                mensaje: 'Usuario registrado exitosamente'
            })
        }
    });
});

function verificarUsuarioExiste(correo) {
    const sql = "SELECT count(*) nro_usuarios FROM abogado WHERE email=$1";
    conexion.query(sql, [correo], (err, result) => {
        if(err) throw err
        else {
            const nroUsuarios = result.rows[0]
            return nroUsuarios > 0
        }
    })
}

function obtenerMaxIdUsuario() {
    const sql = "SELECT coalesce(max(id_abogado), 0) max_id FROM abogado";
    conexion.query(sql, (err, result) => {
        if(err) throw err
        else {
            const maxId = result.rows[0]
            return maxId
        }
    })
}