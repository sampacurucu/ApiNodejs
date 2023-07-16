// const mysql = require('mysql');
const {Client} = require('pg');

// const conexion = mysql.createConnection({
const conexion = new Client({
    host: '34.123.218.24',
    user: 'postgres',
    password: 'gestionlegal',
    port:'5432',
    database: 'postgres'
});

conexion.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});

module.exports=conexion