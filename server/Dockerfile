FROM node:20-slim

WORKDIR /app

# Install required libraries for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY ./app/package*.json ./
COPY ./app/prisma ./prisma

RUN npm install

# Generate Prisma Client
RUN npx prisma generate

COPY ./app .

COPY ./init.sh .

RUN chmod u+x init.sh

CMD [ "bash", "./init.sh"]