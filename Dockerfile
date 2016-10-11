FROM node:5

ENV PUBLIC_PORT $PUBLIC_PORT
ENV PUBLIC_PORT $PUBLIC_PORT

VOLUME ["/usr/src/app/src"]
VOLUME ["/usr/src/app/public"]

WORKDIR "/usr/src/app"

ADD package.json package.json

RUN npm install

ADD fake_security.json fake_security.json

ADD start.sh start.sh
RUN chmod +x start.sh

EXPOSE 8000

ENTRYPOINT ./start.sh
