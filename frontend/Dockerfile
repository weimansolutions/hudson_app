# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copia package.json e instala deps
COPY package.json package-lock.json ./
RUN npm ci

# Copia el resto
COPY . .

# Construye la app estática
RUN npm run build

# Usa un servidor ligero para servir estático
FROM nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expón el puerto 80
EXPOSE 80

# Inicia nginx
CMD ["nginx", "-g", "daemon off;"]
