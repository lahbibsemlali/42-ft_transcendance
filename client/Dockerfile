# building the files

FROM node:latest

ARG VITE_DOMAIN

ENV VITE_DOMAIN=$VITE_DOMAIN

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

COPY ./app .

RUN npm run build

# serve with nginx

FROM nginx:latest

WORKDIR /var/www

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /app/dist/ .

ENTRYPOINT [ "nginx", "-g", "daemon off;"]