FROM node:17.8.0-alpine3.15



WORKDIR /app

COPY . .

EXPOSE 8030
EXPOSE 5432

RUN npm i

CMD ["npm","run","server"]


