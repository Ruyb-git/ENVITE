# Etapa 1: build do React com Vite
FROM node:18-alpine AS builder
WORKDIR /app
COPY ./front ./
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm install && npm run build

# Etapa 2: imagem final com Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/no-ssl.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]