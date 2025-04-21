# Используем базовый образ с Nginx для статического хостинга
FROM nginx:alpine

# Копируем файлы в директорию Nginx
COPY . /usr/share/nginx/html

# Expose HTTP порта
EXPOSE 80
