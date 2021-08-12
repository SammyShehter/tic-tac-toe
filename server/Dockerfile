FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
RUN npm install typescript -g
RUN tsc
RUN ls | grep -v 'dist' | grep -v 'node_modules' | xargs rm -rf
CMD [ "node", "./dist/app.js" ]