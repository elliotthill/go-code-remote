FROM node:bookworm
LABEL authors="elliotthill"

WORKDIR /srv/opt/node

COPY package*.json ./

RUN npm install --force

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
