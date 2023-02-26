FROM node:16.10

WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/uploads

COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --build-from-source

COPY . .

RUN npm run prisma:generate
RUN node --max_old_space_size=1024 ./node_modules/@nestjs/cli/bin/nest.js build

ENTRYPOINT ["bash", "./docker-entrypoint.sh"]

EXPOSE 4030

CMD ["runserver"]