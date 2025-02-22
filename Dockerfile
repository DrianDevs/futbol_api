# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la API
COPY . .

# Expone el puerto en el que corre la API
EXPOSE 3000

# Comando para ejecutar la API
CMD ["node", "index.js"]
