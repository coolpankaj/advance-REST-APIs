// connecting with sockets.

const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6ImY0UE0zTll6bCIsImlhdCI6MTUzNTYzNzIyOTQ5NCwiZXhwIjoxNTM1NzIzNjI5LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6ImFzQTJERHRteiIsImZpcnN0TmFtZSI6InBhbmthaiAiLCJsYXN0TmFtZSI6InNpbmdoIiwiZW1haWwiOiJhYmNAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjoxMjM0NTY3ODl9fQ.rCbYihH6NKuth-08uh8pVclvQSGtiHF2CyKSiHk_buk"
const userId= "asA2DDtmz"

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'HcYCIu5m',//putting user2's id here 
  receiverName: "abc@gmail.com",
  senderId: userId,
  senderName: "abc"
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
