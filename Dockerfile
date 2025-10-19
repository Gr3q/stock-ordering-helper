FROM node:24

WORKDIR /app
COPY ./ /app/

RUN npm ci
RUN npm run build

CMD [ "node", "build" ]