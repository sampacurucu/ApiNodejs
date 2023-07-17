require ('./config/conexion');

const express= require('express');
const port = (process.env.port || 4000);

// express 
const app = express();

// admitir
app.use(express.json())

// config
app.set('port',port)


// rutas se coloca el nombre de la api de la tabla a utilizar 
// app.use('/api', require('./routes/documentos'))
app.use('/apidocumentos', require('./routes/documentos'))
app.use('/servicios-judiciales', require('./routes/servicios-judiciales'))
// app.use('/apiabogados', require('./routes/abogados'))


//inicializar express
app.listen(app.get('port'),(error)=>{
    if(error)
    {console.log('error al iniciar el servidor: '+error)}
    else{
        console.log('servidor iniciado en el puerto: '+port)
    }
})