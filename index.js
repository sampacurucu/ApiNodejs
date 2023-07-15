require ('./config/conexion');

const express= require('express');
const port = (process.env.port || 3000);

// express 
const app = express();

// admitir
app.use(express.json())

// config
app.set('port',port)


// rutas se coloca el nombre a utilizar 
// app.use('/api', require('./routes/documentos'))
app.use('/apidocumentos', require('./routes/documentos'))


//inicializar express
app.listen(app.get('port'),(error)=>{
    if(error)
    {console.log('error al iniciar el servidor: '+error)}
    else{
        console.log('servidor iniciado en el puerto: '+port)
    }
})