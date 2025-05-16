FROM node:lts-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache libc6-compat \
    && npm install -g npm@11.4.0 \
    && npm install

# 👇 Add prisma folder BEFORE generating client
COPY prisma ./prisma

# 👇 Generate Prisma client now that schema is present
RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]
