const socket = io();

const formChat = document.getElementById('formularioChat');

formChat.addEventListener("submit",(e)=>{
    const user = document.getElementById('email').value;
    console.log(user);
    const message = document.getElementById('messageUser').value;
    console.log(messageUser);
    socket.emit('newMessage',{user,message});
}) 


