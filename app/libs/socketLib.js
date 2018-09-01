/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib");
const check = require("./checkLib");
const response = require('./responseLib')
const ChatModel = mongoose.model('Chat');



let setServer = (server) => {

    let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('')

    myIo.on('connection',(socket) => {

        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");

        // code to verify the user and make him online

        socket.on('set-user',(authToken) => {

            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken,(err,user)=>{
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else{

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    console.log(currentUser)
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);
                   // socket.emit(currentUser.userId,`${currentUser.userId}  ${fullName} is online.`)

                    let userObj = {userId:currentUser.userId,fullName:fullName}
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)


                    // setting user name
                    socket.room = 'myChat'
                    // joining chat-group room
                    socket.join(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers)

                }


            })
          
        }) // end of listening set-user event

        socket.on('chat-msg', (data) => {
            console.log('socket chat-msg called.')
            console.log(data)
            data['chatId'] = shortid.generate()
            console.log(data)
            
            setTimeout(function() {
                eventEmitter.emit('save-chat', data)
            })

            myIo.emit(data.receiverId, data)
            // socket.emit(data.receiverId, data)
        }) // receiving chat-message from client side



        socket.on('typing', (fullName) => {
            socket.to(socket.room).broadcast.emit('typing', fullName)
        })


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);
            var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers)

            socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers)
            socket.leave(socket.room)


        }) // end of on disconnect

         

    });

}


// database operations are kept outside of socket.io code.

// saving chats to database.
eventEmitter.on('save-chat', (data) => {

    // let today = Date.now();

    let newChat = new ChatModel({

        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn

    });

    newChat.save((err,result) => {
        if(err){
            console.log(`error occurred: ${err}`);
        }
        else if(result == undefined || result == null || result == ""){
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved.");
            console.log(result);
        }
    });

}); // end of saving chat.

module.exports = {
    setServer: setServer
}
