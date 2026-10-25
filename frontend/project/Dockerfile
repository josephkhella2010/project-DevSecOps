FROM node:22-alpine3.24

RUN npm install --global npm@11.21.1 \
    && mkdir -p /tmp/undici-fix \
    && cd /tmp/undici-fix \
    && npm pack undici@6.29.1 \
    && tar -xzf undici-6.29.1.tgz \
    && rm -rf /usr/local/lib/node_modules/npm/node_modules/undici \
    && mv package /usr/local/lib/node_modules/npm/node_modules/undici \
    && cd / \
    && rm -rf /tmp/undici-fix 
    
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]