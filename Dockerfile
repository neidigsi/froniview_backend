FROM node:12
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install python
COPY . .
RUN npm install
RUN npm install bcrypt
EXPOSE 80
CMD [ "node", "server.js" ]