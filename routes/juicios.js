const router = require('express').Router();
const conexion = require('../config/conexion');

router.get('/', async (req, res) => {
    try {
        const idAbogado = req.sesion?.idUsuario
        const filtro = req.query.filtro

        const rows = await buscarJuiciosPorAbogado(idAbogado, filtro?.toLowerCase())

        res.status(200)
        .json(rows)
        return
    } catch(err) {
        console.log('Error buscar juicios', err)
        return res.status(500)
        .json({
            error: err,
            mensaje: 'Error interno del servidor...'
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const datos = req.body
        const sesion = req.sesion
        datos.idAbogado = sesion.idUsuario
    
        const resultadoJuicio = await guardarJuicio(datos)
        console.log('Resultado juicio guardado', resultadoJuicio)
    
        res.status(200)
        .json({
            mensaje: 'Juicio guardado exitosamente.'
        })
        return
    } catch(err) {
        return res.status(500)
        .json({
            error: err,
            mensaje: 'Error interno del servidor...'
        })
    }
})

router.put('/', async (req, res) => {
    try {
        const datos = req.body
        const sesion = req.sesion
        datos.idAbogado = sesion.idUsuario
    
        const resultadoJuicio = await modificarJuicio(datos)
        console.log('Resultado juicio modificado', resultadoJuicio)
    
        res.status(200)
        .json({
            mensaje: 'Juicio modificado exitosamente.'
        })
        return
    } catch(err) {
        return res.status(500)
        .json({
            error: err,
            mensaje: 'Error interno del servidor...'
        })
    }
})

router.delete('/:idJuicio', async (req, res) => {
    try {
        const idJuicio = req.params.idJuicio
        const sesion = req.sesion
    
        const resultadoJuicio = await eliminarJuicio(idJuicio, sesion.idUsuario)
        console.log('Resultado eliminar juicio', resultadoJuicio)
    
        res.status(200)
        .json({
            mensaje: 'Juicio eliminado exitosamente.'
        })
        return
    } catch(err) {
        return res.status(500)
        .json({
            error: err,
            mensaje: 'Error interno del servidor...'
        })
    }
})

const buscarJuiciosPorAbogado = async(idAbogado, filtro) => {
    const sql = `SELECT j.id_juicio AS idjuicio,
                    j.id_cliente AS idcliente,
                    c.razon_social AS razonsocial,
                    j.id_abogado AS idabogado,
                    j.id_tipo AS idtipo,
                    tj.tipo_juicio AS descripciontipojuicio,
                    j.numero_secuencial AS numerosecuencial,
                    j.codigo_dependencia AS codigodependencia,
                    j.anio,
                    j.nombre_juicio AS nombrejuicio
                FROM juicio j
                INNER JOIN tipo_juicio tj
                ON j.id_tipo=tj.id_tipo
                INNER JOIN clientes c
                ON j.id_cliente=c.id_cliente
                WHERE j.id_abogado=$1
                AND (
                    lower(coalesce(c.razon_social, '')) like '%'||$2||'%'
                    OR coalesce(j.codigo_dependencia, '') like '%'||$2||'%'
                    OR cast(j.anio as varchar) like '%'||$2||'%'
                    OR coalesce(j.numero_secuencial, '') like '%'||$2||'%'
                    OR coalesce(j.nombre_juicio, '') like '%'||$2||'%'
                )`;

    try {
        console.log('Id abogad, filtro', idAbogado, filtro)
        const result = await conexion.query(sql, [ idAbogado, filtro ])
        const rows = result.rows
        console.log(rows)
        return rows
    } catch(err) {
        throw err
    }
}

const guardarJuicio = async (juicio) => {
    const {
        idAbogado,
        idCliente,
        tipoJuicio,
        numeroSecuencial,
        codigoDependencia,
        anio,
        nombreJuicio
    } = juicio

    console.log('Datos juicio crear', juicio)

    const sql = `INSERT INTO juicio (id_cliente, id_abogado, id_tipo, numero_secuencial, codigo_dependencia, anio, nombre_juicio)
                VALUES($1, $2, $3, $4, $5, $6, $7)`

    try {
        const result = await conexion.query(sql, [ 
            idCliente, 
            idAbogado, 
            tipoJuicio,
            numeroSecuencial,
            codigoDependencia,
            anio,
            nombreJuicio?.toUpperCase()
        ])

        return result
    } catch(err) {
        console.log('Error guardar juicio', err)
        throw err
    }
}

const modificarJuicio = async (juicio) => {
    const {
        idJuicio,
        idAbogado,
        idCliente,
        tipoJuicio,
        numeroSecuencial,
        codigoDependencia,
        anio,
        nombreJuicio
    } = juicio

    console.log('Datos juicio modificar', juicio)

    const sql = `UPDATE juicio set id_cliente=$1,
                                   id_tipo=$2,
                                   numero_secuencial=$3,
                                   codigo_dependencia=$4,
                                   anio=$5,
                                   nombre_juicio=$6
                WHERE id_juicio=$7
                AND id_abogado=$8`

    try {
        const result = await conexion.query(sql, [ 
            idCliente, 
            tipoJuicio,
            numeroSecuencial,
            codigoDependencia,
            anio,
            nombreJuicio?.toUpperCase(),
            idJuicio,
            idAbogado
        ])

        return result
    } catch(err) {
        console.log('Error modificar juicio', err)
        throw err
    }
}

const eliminarJuicio = async (idJuicio, idAbogado) => {
    const sql = `DELETE FROM juicio WHERE id_juicio=$1 AND id_abogado=$2`

    try {
        const result = await conexion.query(sql, [ idJuicio, idAbogado ])

        return result
    } catch(err) {
        console.log('Error eliminar juicio', err)
        throw err
    }
} 

module.exports=router;