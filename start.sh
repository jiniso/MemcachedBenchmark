#!/bin/sh
#docker stack deploy --compose-file docker-compose.yml memcachedBenchmark
docker-compose up --force-recreate --build -d
npm start --prefix ./api