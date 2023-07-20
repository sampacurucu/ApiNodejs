const router = require('express').Router();
const conexion = require('../config/conexion');

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

module.exports=router;