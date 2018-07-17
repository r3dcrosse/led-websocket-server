# led-websocket-server
Experimental websocket server to drive LED connected esp32 arduinos

## Requirements
- Node.js (at least LTS version)
- npm 6.x
- Docker (optional)

## Getting started
Clone the repo
```sh
git clone https://github.com/r3dcrosse/led-websocket-server.git && cd led-websocket-server
```

Install all the dependencies
```sh
npm install
```

## Starting the server
How to start the server without using Docker:
```sh
npm start
```

How to start the server using Docker:
```sh
npm run docker:build -- <your username here>/led-websocket-server 8000
```
The last argument is the port to expose as your server. If you
do not pass the port number, it will default to 3000

### Useful Docker commands
List what containers are running:
```sh
docker ps
```

How to stop a container:
- Get the container ID from `docker ps`
```sh
docker stop CONTAINER_ID
```
