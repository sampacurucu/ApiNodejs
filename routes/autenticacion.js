const router = require('express').Router();
const conexion = require('../config/conexion');
const { generarToken } = require('../helpers/jwt-helper');

router.post('/registro-usuario', async (req,res) => {
    const request = req.body

    const usuarioExiste = await verificarUsuarioExiste(request.email)
    if(usuarioExiste) {
        res.status(400)
        .json({
            mensaje: 'El usuario ya se encuentra registrado. Por favor inicie sesion con sus credenciales para acceder.'
        })
        return
    }

    const maxId = await obtenerMaxIdUsuario()
    console.log('Max Id', maxId)
    const nuevoId = maxId + 1

    const sql = `INSERT INTO abogado(id_abogado, nombres, apellidos, email, password) 
        VALUES ($1,$2,$3,$4,$5)`;

    console.log('Body', request)
    console.log('NuevoId', nuevoId)
    conexion.query(sql, [nuevoId, request.nombres, request.apellidos, request.email, request.clave], (err, result) => {
        if(err) throw err
        else {
            res.status(200)
            .json({
                mensaje: 'Usuario registrado exitosamente'
            })
        }
    });
});

router.post('/login', async (req,res) => {
    const request = req.body

    const sql = `SELECT id_abogado FROM abogado WHERE email=$1 AND password=$2`;

    try {
        const result = await conexion.query(sql, [ request.email, request.clave ])
        const rows = result.rows

        if(rows.length == 0) {
            res.status(400)
            .json({
                mensaje: 'El correo o clave son incorrectos'
            })
            return
        }

        const idAbogado = rows[0].id_abogado
        const suscripcion = await obtenerSuscripcionUsuario(idAbogado)


        const token = generarToken({
            idUsuario: idAbogado,
            esAdmin: suscripcion?.es_admin,
            idSuscripcion: suscripcion?.id_suscripcion
        })

        res.status(200)
        .json({
            token: token
        })
        return
    } catch(err) {
        throw err
    }
});

async function verificarUsuarioExiste(correo) {
    const sql = "SELECT count(*) nro_usuarios FROM abogado WHERE email=$1";
    try {
        const result = await conexion.query(sql, [correo])
        const nroUsuarios = result.rows[0].nro_usuarios
        return nroUsuarios > 0
    } catch(err) {
        throw err
    }
}

async function obtenerMaxIdUsuario() {
    const sql = "SELECT coalesce(max(id_abogado), 0) max_id FROM abogado";
    try {
        const result = await conexion.query(sql)
        const maxId = result.rows[0].max_id
        return maxId
    } catch(err) {
        throw err
    }
}

async function obtenerSuscripcionUsuario(idUsuario) {
    const sql = "SELECT id_usuario, id_suscripcion, es_admin FROM usuarios_suscripciones WHERE id_usuario=$1";
    try {
        const result = await conexion.query(sql, [ idUsuario ])
        const rows = result.rows
        if(rows == 0) {
            return null
        }

        const suscripcion = rows[0]
        return suscripcion
    } catch(err) {
        throw err
    }
}

module.exports=router;