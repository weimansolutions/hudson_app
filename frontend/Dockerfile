# 1) Etapa de build con Vite
FROM node:20-alpine AS build
WORKDIR /app

# Instala deps
COPY package.json package-lock.json ./
RUN npm ci

COPY .env .env

# Copia el resto (incluyendo .env si existe)
COPY . .

# Aquí Vite inyecta import.meta.env.VITE_API_URL
RUN npm run build

# 2) Etapa de producción con Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]