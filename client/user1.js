// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IndfcTk4S2dDciIsImlhdCI6MTUzNTQ2MTgwOTEzNCwiZXhwIjoxNTM1NTQ4MjA5LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6ImFzQTJERHRteiIsImZpcnN0TmFtZSI6InBhbmthaiAiLCJsYXN0TmFtZSI6InNpbmdoIiwiZW1haWwiOiJhYmNAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjoxMjM0NTY3ODl9fQ.elyat4E0aF6WNAwbkvQRPjPVcEk1ixnWDwjbPoevGKc"
const userId= "asA2DDtmz"

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });

  socket.on(userId, (data) => {

    console.log("you received a message")
    console.log(data)

  });




}// end chat socket function

chatSocket();
