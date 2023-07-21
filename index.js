require ('./config/conexion');

const express= require('express');
var cors = require('cors');
const { permitirAccesoPublico } = require('./middlewares/authorization');
const port = (process.env.port || 4000);

// express 
const app = express();

//cors
app.use(cors())

// admitir
app.use(express.json())

// config
app.set('port',port)

app.use(permitirAccesoPublico)

// rutas se coloca el nombre de la api de la tabla a utilizar 
app.use('/apidocumentos', require('./routes/documentos'))
app.use('/servicios-judiciales', require('./routes/servicios-judiciales'))
app.use('/blogs-abogados', require('./routes/blogs-abogado'))
app.use('/autenticacion', require('./routes/autenticacion'))
app.use('/tarjetas', require('./routes/tarjetas'))

app.use('/comentarios',require('./routes/comentarios'))


//inicializar express
app.listen(app.get('port'),(error)=>{
    if(error)
    {console.log('error al iniciar el servidor: '+error)}
    else{
        console.log('servidor iniciado en el puerto: '+port)
    }
})