
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

COPY --chown=node:node package*.json ./

RUN npm ci && chown -R node:node /app

COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD ["npm", "run", "dev", "--", "--legacy-watch"]
