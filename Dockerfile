FROM node:5

ENV PUBLIC_PORT $PUBLIC_PORT
ENV PUBLIC_PORT $PUBLIC_PORT

VOLUME ["/usr/src/app/src"]
VOLUME ["/usr/src/app/public"]

WORKDIR "/usr/src/app"

ADD package.json package.json

RUN npm install

ADD webpack.dev.config.js webpack.dev.config.js
ADD webpack.utv.config.js webpack.utv.config.js
ADD .babelrc .babelrc
ADD .eslintrc .eslintrc
ADD start.sh start.sh
ADD fake_security.json fake_security.json

RUN chmod +x start.sh

EXPOSE 8000

ENTRYPOINT ./start.sh
