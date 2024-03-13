const socket = io();

socket.emit('message', "Hello, I communicate to websocket");
