const router = require('express').Router();
const conexion = require('../config/conexion');

router.post('/registro-tarjeta', (req, res) => {
    const request = req.body

    const tarjetaExiste = verificarTarjetaExiste(request.numero)
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

function verificarTarjetaExiste(numero) {
    const sql = "SELECT count(*) nro_tarjetas FROM tarjetas WHERE numero=$1";
    conexion.query(sql, [numero], (err, result) => {
        if(err) throw err
        else {
            const nroTarjetas = result.rows[0]
            return nroTarjetas > 0
        }
    })
}