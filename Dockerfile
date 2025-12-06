FROM node:22-bullseye-slim

# set working directory
WORKDIR /app

COPY . .

RUN rm -rf node_modules package-lock.json && \
    npm install && \
    npm install @rollup/rollup-linux-arm64-gnu
    
EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]