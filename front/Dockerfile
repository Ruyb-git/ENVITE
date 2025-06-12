# Stage 1: build
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: serve com nginx
FROM nginx:alpine

# Copia o app compilado
COPY --from=build /app/dist /usr/share/nginx/html

# Copia imagem manualmente, se necessário
# COPY src/components/images/logo-envite.svg /usr/share/nginx/html/assets/logo-envite.svg
COPY src/components/images /usr/share/nginx/html/assets/images

# Configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
