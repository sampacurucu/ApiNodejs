const router = require('express').Router();
const conexion = require('../config/conexion');

router.post('/registro-tarjeta', async (req, res) => {
    const request = req.body
    console.log('antes de verificar tarjeta')

    const tarjetaExiste = await verificarTarjetaExiste(request.numero)
    if(tarjetaExiste) {
        console.log('Tarjeta ya existe')
        res.status(200)
        .json()
        return
    }

    console.log('Antes de armar query de registro de tarjeta')
    const sql = `INSERT INTO tarjetas(numero, fecha_vence, cvc, titular_tarjeta) 
        VALUES ($1,$2,$3,$4)`;

    console.log('Query insertado', sql)

    try {
        console.log('Antres de hacer el registro')
        const result = await conexion.query(sql, [request.numero, request.fechaVence, request.cvc, request.titularTarjeta])
        console.log('Result insertar tarjetas', result)
        res.status(200)
        .json()
        return
    } catch(err) {
        console.error('Hay error' + err)
        throw err
    }
})

async function verificarTarjetaExiste(numero) {
    const sql = "SELECT count(*) nro_tarjetas FROM tarjetas WHERE numero=$1";
    try {
        const result = await conexion.query(sql, [numero])
        const nroTarjetas = result.rows[0].nro_tarjetas
        return nroTarjetas > 0
    } catch(err) {
        throw err
    }
}

module.exports=router;