# Paso 1: Usar una imagen base que ya tiene un servidor web (Nginx)
FROM nginx:alpine

# Paso 2: Copiar nuestros archivos web al directorio donde Nginx los busca
COPY . /usr/share/nginx/html