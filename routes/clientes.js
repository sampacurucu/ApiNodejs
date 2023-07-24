const router = require('express').Router();
const conexion = require('../config/conexion');

router.get('/', async (req, res) => {
    const idAbogado = req.sesion?.idUsuario
    const filtro = req.query.filtro

    const rows = await buscarClientesPorAbogado(idAbogado, filtro?.toLowerCase())

    res.status(200)
    .json(rows)
    return
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

module.exports = router