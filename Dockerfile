FROM node:lts-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies + latest npm safely
RUN apk add --no-cache libc6-compat && \
    npm install -g npm@11.4.0 && \
    npm install

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]
