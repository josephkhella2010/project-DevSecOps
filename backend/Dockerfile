FROM node:22-alpine3.24

RUN npm install --global npm@11.21.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev", "--", "--legacy-watch"]