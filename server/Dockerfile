FROM node:latest

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

COPY ./passport-42-fixed node_modules/@types/passport-42/index.d.ts

COPY ./app .

COPY ./init.sh .

RUN chmod u+x init.sh

CMD [ "bash", "./init.sh"]