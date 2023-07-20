const router = require('express').Router();
const conexion = require('../config/conexion');

router.post('/registro-tarjeta', async (req, res) => {
    const request = req.body

    const tarjetaExiste = await verificarTarjetaExiste(request.numero)
    if(tarjetaExiste) {
        res.status(200)
        return
    }

    const sql = `INSERT INTO tarjetas(numero, fecha_vence, cvc) 
        VALUES ($1,$2,$3)`;
    conexion.query(sql, [request.numero, request.fechaVence, request.cvc], (err, result) => {
        if(err) throw err
        else {
            res.status(200)
        }
    });
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