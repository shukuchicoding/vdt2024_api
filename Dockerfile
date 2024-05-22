FROM node:lts-alpine

EXPOSE 5000

WORKDIR /app

COPY package.json package-lock.json ./

run npm install

COPY . .

CMD ["node", "index.js"]