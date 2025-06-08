# Etapa 1: build
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa 2: produção
FROM node:20

WORKDIR /app

COPY --from=build /app ./

# Copie o .env, se necessário
# COPY .env .env

EXPOSE 3001

CMD ["npm", "start"]
