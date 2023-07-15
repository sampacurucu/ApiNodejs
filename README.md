# ApiNodejs
instalar nodemon: npm install --save-dev nodemon
instalar: npm install express mysql
Correr el servidor: npm run dev
verificar: http://localhost:3000/apidocumentos
apidocumentos es de la tabla documentos

Para crear una nueva api de otra tabla
En la carpeta routes crean un archivo con extension js (ejemplo abogados.js)
En el archivo index.js agregar app.use('/apiabogados(pueden cambiar por el que desean)', require('./routes/abogados'))
Corren el servidor y verifican 
Correr el servidor: npm run dev
verificar: http://localhost:3000/apiabogados

Base de Datos
Se utiliza mysql de xampp
Se crean una base de datos con el nombre de: gestionlegal
Crean la tabla Documentos(si quiere probar la apidocumentos):
CREATE TABLE documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_juicio VARCHAR(255),
  tipo VARCHAR(255),
  nombre VARCHAR(255),
  descripcion VARCHAR(255),
  documento LONGBLOB
);

#En el proyecto de Angular
En el archivo proxy.conf.json deben agregar la api que van a utilizar
Y en la carpeta src/app/servicios deben crear una carpeta para el servicio (por ejemplo servicio-abogados) y dentro crear el servicio con ng g s abogados

#Guia 
Video: https://www.youtube.com/watch?v=m0qeCEo2Id8 y las otras partes, ahi explica todo 

