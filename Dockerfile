FROM node:12.13.0
RUN cd home
RUN apt update
RUN apt install python
COPY . .
RUN npm install
RUN npm install bcrypt
CMD [ "npm", "start" ]