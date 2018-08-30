// connecting with sockets.

const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjJhZzdhNnZEUyIsImlhdCI6MTUzNTYzNzE5NjQzMywiZXhwIjoxNTM1NzIzNTk2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IkhjWUNJdTVtLSIsImZpcnN0TmFtZSI6InVzZXIyIiwibGFzdE5hbWUiOiJ1c2VyMiIsImVtYWlsIjoiZGVmQGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6OTg3NjU0MzIxfX0.zgbQIXbi0fAcsTxxoPK_QSy84X3bdUyPFYibb67ONnI"
const userId= "HcYCIu5m"

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'asA2DDtmz',//putting user2's id here 
  receiverName: "abc@gmail.com",
  senderId: userId,
  senderName: "def"
}

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });

  socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

  });

  socket.on("online-user-list", (data) => {

    console.log("Online user list is updated. some user can online or went offline")
    console.log(data)

  });


  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)

  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing","Aditya Kumar")

  })

  socket.on("typing", (data) => {

    console.log(data+" is typing")
    
    
  });



}// end chat socket function

chatSocket();
