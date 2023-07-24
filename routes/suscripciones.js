const router = require('express').Router();
const conexion = require('../config/conexion');
const faker = require('faker');
const { addMonths } = require('date-fns');
const { generarToken } = require('../helpers/jwt-helper');

router.get('/planes', async (_, res) => {
    const sql = `SELECT id, nombre, descripcion, precio, items
                 FROM tipos_suscripciones`;

    try {
        const result = await conexion.query(sql)
        const rows = result.rows

        if(rows.length == 0) {
            res.status(400)
            .json({
                mensaje: 'No se han podido recuperar los planes disponibles.'
            })
            return
        }

        res.status(200)
        .json(rows)
        return
    } catch(err) {
        throw err
    }
})

router.get('/planes/:idPlan', async (req, res) => {
    const idPlan = req.params.idPlan
    const rows = await obtenerTipoPlanPorId(idPlan)
    if(rows.length == 0) {
        res.status(400)
        .json({
        mensaje: 'No se han podido recuperar el plan.'
        })
        return
    }

    res.status(200)
    .json(rows[0])
    return
})

router.post('/procesar-pago', async (req, res) => {
    const { idPlan, renovacionAutomatica, numeroTarjeta, nombreTitular, fechaExpiracion, cvv } = req.body
    const { idUsuario } = req.sesion
    const esAdmin = 'S'

    if (!numeroTarjeta || !nombreTitular || !fechaExpiracion || !cvv) {
        return res.status(400)
        .json({ mensaje: 'Datos de tarjeta incompletos.' });
    }    

    try {
        const idSuscripcion = await crearSuscripcion({ idPlan, renovacionAutomatica, numeroTarjeta })
        await enlazarUsuarioASuscripcion({ idUsuario, idPlan, esAdmin })

        const sesion = {
            idUsuario: idUsuario,
            idSuscripcion: idSuscripcion,
            esAdmin
        }
        console.log('La sesion', sesion)

        const token = generarToken(sesion)

        return res.status(200)
        .json({ 
            mensaje: 'Su pago ha sido procesado con exito!',
            token: token,
            idSuscripcion,
            esAdmin
        })
    } catch(error) {
        console.log('El error al procesar el pago', error)
        return res.status(500)
        .json({ mensaje: 'Error al procesar el pago. Intente nuevamente más tarde.', error })
    }
})

const obtenerTipoPlanPorId = async (idPlan) => {
    const sql = `SELECT id, nombre, descripcion, precio, 
                    usuarios_permitidos AS usuariosPermitidos, 
                    duracion_meses AS duracionMeses,
                    items
                FROM tipos_suscripciones 
                WHERE id=$1`;

    try {
        const result = await conexion.query(sql, [ idPlan ])
        const rows = result.rows
        return rows
    } catch(err) {
        throw err
    }
}

const crearSuscripcion = async (datos) => {
    const { idPlan, renovacionAutomatica, numeroTarjeta } = datos
    
    const plan = (await obtenerTipoPlanPorId(idPlan))[0]
    
    const maxIdSuscripcion = await obtenerMaxIdSuscripcion()
    const nuevoId = maxIdSuscripcion + 1

    const sql = `INSERT INTO suscripciones(
                    id_suscripcion, 
                    tipo_suscripcion, 
                    fecha_inicio, 
                    fecha_vencimiento, 
                    estado_renovacion, 
                    numero_tarjeta_asociada)
                VALUES($1, $2, $3, $4, $5, $6)`;

    try {
        const result = await conexion.query(sql, [ 
            nuevoId, 
            idPlan, 
            new Date(), 
            addMonths(new Date(), plan.duracionmeses), 
            renovacionAutomatica, 
            numeroTarjeta 
        ])

        return nuevoId
    } catch(err) {
        throw err
    }
}

async function enlazarUsuarioASuscripcion(datos) {
    console.log(datos)
    const { idUsuario, idPlan, esAdmin } = datos

    const sql = `INSERT INTO usuarios_suscripciones(id_usuario, id_suscripcion, es_admin)
                VALUES($1, $2, $3)`;

    try {
        const result = await conexion.query(sql, [ 
            idUsuario, 
            idPlan, 
            esAdmin
        ])

        return result
    } catch(err) {
        throw err
    }
}

async function obtenerMaxIdSuscripcion() {
    const sql = "SELECT coalesce(max(id_suscripcion), 0) max_id FROM suscripciones";
    try {
        const result = await conexion.query(sql)
        const maxId = result.rows[0].max_id
        return maxId
    } catch(err) {
        throw err
    }
}

module.exports = router