FROM node:16

WORKDIR /root/src/workdir
COPY . .
RUN ["npm", "install", "-g", "npm@8.5.0"]
RUN ["npm", "i"]
ENV MONGO_URL=mongodb+srv://Arnon:arnonarnon1234@cluster16.u9jso.mongodb.net/chessserver?retryWrites=true&w=majority
ENV SECRET=123
EXPOSE 8080

CMD ["npm", "start"]