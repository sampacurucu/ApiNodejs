# ApiNodejs
## Para Nodejs
- instalar nodemon: npm install --save-dev nodemon
- instalar: npm install express
- instalar(postgres): npm install pg
- Correr el servidor: npm run dev
- verificar: http://localhost:3000

- ### Para crear una nueva api de otra tabla

- En la carpeta routes crean un archivo con extension js (ejemplo abogados.js)

- En el archivo index.js agregar app.use('/apiabogados(pueden cambiar por el que desean)', require('./routes/abogados'))

- Corren el servidor y verifican 

- Correr el servidor: npm run dev

- verificar: http://localhost:3000/apiabogados

## Base de Datos
- Datos de conexion a la BD
- Host: 34.123.218.24
- Usuario: postgres
- Clave: gestionlegal
- Puerto: 5432
- DB: postgres

## En el proyecto de Angular

- En el archivo proxy.conf.json deben agregar la api que van a utilizar

- Y en la carpeta src/app/servicios deben crear una carpeta para el servicio (por ejemplo servicio-abogados y dentro crear el servicio con ng g s abogados)

# #Guia 

- Video: https://www.youtube.com/watch?v=m0qeCEo2Id8 y las otras partes, ahi explica todo 

