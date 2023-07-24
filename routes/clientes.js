const router = require('express').Router();
const conexion = require('../config/conexion');

router.get('/', async (req, res) => {
    try {
        const idAbogado = req.sesion?.idUsuario
        const filtro = req.query.filtro

        const rows = await buscarClientesPorAbogado(idAbogado, filtro?.toLowerCase())

        res.status(200)
        .json(rows)
        return
    } catch(err) {
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
        const { nroIdentificacion, tipoIdentificacion, lugarNaci, razonSocial, email, phone, address, fechaNaci, tipoPersona, actividadComercial, genero } = datos
    
        const resultadosClientes = await verificarSiClienteExite(datos.nroIdentificacion)        
        let idCliente = 0
    
        if(resultadosClientes?.length == 0) {
            idCliente = await crearCliente(datos)
        } else {
            const cliente = resultadosClientes[0]            
            idCliente = cliente?.idcliente
        }
    
        await enlazarClienteAAbogado(sesion?.idUsuario, idCliente)
    
        res.status(200)
        .json({
            mensaje: 'Cliente creado exitosamente.'
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

router.delete('/:idCliente', async (req, res) => {
    try {
        const idCliente = req.params.idCliente
        const sesion = req.sesion
    
        await eliminarClienteAbogado(sesion?.idUsuario, idCliente)
    
        res.status(200)
        .json({
            mensaje: 'Cliente eliminado exitosamente.'
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

router.get('/verificarExistencia/:nroIdentificacion', async (req, res) => {
    try {
        const nroIdentificacion = req.params.nroIdentificacion

        const rows = await verificarSiClienteExite(nroIdentificacion)
        console.log('Rows existe cliente', rows)

        res.status(200)
        .json(rows.length > 0)
        return
    } catch(err) {
        return res.status(500)
        .json({
            error: err,
            mensaje: 'Error interno del servidor...'
        })
    }
})

const buscarClientesPorAbogado = async(idAbogado, filtro) => {
    const sql = `select c.id_cliente AS idCliente,
                        c.nro_identificacion AS nroIdentificacion,
                        c.tipo_identificacion AS tipoIdentificacion,
                        c.lugar_naci AS lugarNaci,
                        c.razon_social AS razonSocial,
                        c.email,
                        c.phone,
                        c.address,
                        c.fecha_naci AS fechaNaci,
                        c.tipo_persona AS tipoPersona,
                        c.actividad_comercial AS actividadComercial,
                        c.genero
    from clientes c
    inner join abogados_clientes ac
    on c.id_cliente=ac.id_cliente
    where (lower(razon_social) like '%' || $1 || '%'
    or nro_identificacion like '%' || $1 || '%')
    and ac.id_abogado=$2`;

    try {
        console.log('Id abogad, filtro', idAbogado, filtro)
        const result = await conexion.query(sql, [ filtro, idAbogado ])
        const rows = result.rows
        console.log(rows)
        return rows
    } catch(err) {
        throw err
    }
}

const verificarSiClienteExite = async (nroIdentificacion) => {
    const sql = `select c.id_cliente AS idCliente,
            c.nro_identificacion AS nroIdentificacion,
            c.tipo_identificacion AS tipoIdentificacion,
            c.lugar_naci AS lugarNaci,
            c.razon_social AS razonSocial,
            c.email,
            c.phone,
            c.address,
            c.fecha_naci AS fechaNaci,
            c.tipo_persona AS tipoPersona,
            c.actividad_comercial AS actividadComercial,
            c.genero
        from clientes c 
        where c.nro_identificacion=$1`;

    try {
        const result = await conexion.query(sql, [ nroIdentificacion ])
        const rows = result.rows
        return rows
    } catch(err) {
        throw err
    }
}

const crearCliente = async (datos) => {
    const { nroIdentificacion, tipoIdentificacion, lugarNaci, razonSocial, email, phone, address, fechaNaci, tipoPersona, actividadComercial, genero } = datos
    
    const maxIdClientes = await obtenerMaxIdClientes()
    const nuevoId = maxIdClientes + 1

    const sql = `INSERT INTO clientes(
                    id_cliente,
                    nro_identificacion,
                    tipo_identificacion,
                    lugar_naci,
                    razon_social,
                    email,
                    phone,
                    address,
                    fecha_naci,
                    tipo_persona,
                    actividad_comercial,
                    genero)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

    try {
        const result = await conexion.query(sql, [ 
            nuevoId, 
            nroIdentificacion, 
            tipoIdentificacion, 
            lugarNaci,
            razonSocial,
            email,
            phone,
            address,
            fechaNaci,
            tipoPersona,
            actividadComercial,
            genero
        ])

        return nuevoId
    } catch(err) {
        throw err
    }
}

const enlazarClienteAAbogado = async (idAbogado, idCliente) => {
    const sql = `INSERT INTO abogados_clientes(
            id_cliente,
            id_abogado)
        VALUES($1, $2)`;

    try {
        const result = await conexion.query(sql, [ 
            idCliente, 
            idAbogado
        ])

        return result
    } catch(err) {
        throw err
    }
}

const eliminarClienteAbogado = async (idAbogado, idCliente) => {
    const sql = `DELETE FROM abogados_clientes WHERE id_abogado=$1 AND id_cliente=$2`;

    try {
        const result = await conexion.query(sql, [ 
            idAbogado, 
            idCliente
        ])

        return result
    } catch(err) {
        throw err
    }
}

async function obtenerMaxIdClientes() {
    const sql = "SELECT coalesce(max(id_cliente), 0) max_id FROM clientes";
    try {
        const result = await conexion.query(sql)
        const maxId = result.rows[0].max_id
        return maxId
    } catch(err) {
        throw err
    }
}

module.exports = router