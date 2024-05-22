FROM node:20

EXPOSE 5000

WORKDIR /api/index

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

run npm install

COPY . .

CMD ["node", "index.js"]