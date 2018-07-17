# led-websocket-server
Experimental websocket server to drive LED connected esp32 arduinos

## Requirements
- Node.js (at least LTS version)
- npm 6.x
- Docker (optional)

## Getting started
Clone the repo
```
git clone https://github.com/r3dcrosse/led-websocket-server.git && cd led-websocket-server
```

Install all the dependencies
```
npm install
```

## Starting the server
How to start the server without using Docker:
```
npm start
```

How to start the server using Docker:
```
npm run docker:build -- <your username here>/led-websocket-server 8000
```
The last argument is the port to expose as your server. If you
do not pass the port number, it will default to 3000.
