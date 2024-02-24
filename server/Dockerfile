FROM node:latest

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

COPY ./passport-42-fixed node_modules/@types/passport-42/index.d.ts

COPY ./app .

COPY ./init.sh .

RUN npm run build

RUN chmod u+x init.sh

EXPOSE 3000

CMD [ "bash", "./init.sh"]
