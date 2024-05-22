FROM node:lts-alpine as builder

WORKDIR /app

RUN chown node:node /app

USER node

COPY --chown=node:node package*.json ./

RUN npm i --production

COPY --chmod=node:node . .

EXPOSE 5000

CMD ["node", "index.js"]