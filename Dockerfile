# Establecer la imagen base, en este caso, usaremos la imagen oficial de Node.js LTS (Long-Term Support)
FROM node:lts

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json (o yarn.lock si usas Yarn) al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todo el contenido de la aplicación al directorio de trabajo en el contenedor
COPY . .

# Exponer el puerto en el que el servidor de Node.js escucha (asegúrate de que coincida con el puerto configurado en tu aplicación)
EXPOSE 4000

# Comando para ejecutar el servidor de Node.js (reemplaza "index.js" con el nombre de tu archivo de entrada si es diferente)
CMD ["node", "index.js"]
