FROM node:22-alpine

# set working directory
WORKDIR /app

# install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]