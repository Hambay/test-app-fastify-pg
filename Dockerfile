FROM node

WORKDIR /app

ENV TZ Europe/Moscow

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

EXPOSE 3300

CMD ["npm", "run", "start"]
