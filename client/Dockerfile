FROM node:lts as build

WORKDIR '/app'
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci --silent
RUN npm install -g --silent
COPY . ./
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]