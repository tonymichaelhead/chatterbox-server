// YOUR CODE HERE:
var app = {};
app.friends = [];
app.init = function() {
  this.server = 'http://127.0.0.1:3000/classes/messages';
  $('.submit').on('click', app.handleSubmit);
  $('#chats').on('click', '.username', app.handleUsernameClick);
  $('#create-room').on('click', function() {
    let currentRoom = $('#new-room').val();
    if (!app.rooms[currentRoom]) {
      app.renderRoom(currentRoom);  
    }
    
  });
  
};

app.rooms = {
  lobby: true,
  testing: true
};

app.send = function(message) { 
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      let room = $('#roomSelect').val();
      app.fetch(room);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

};

app.fetch = function(room) {
  $.ajax({
    
    url: app.server,
    type: 'GET',
    // dataFilter: function(data) {
    //   let someData = JSON.parse(data);
    //   someData.results.sort(function(a, b) {
    //     return new Date(a.createdAt) - new Date(b.createdAt);
    //   });
    //   data = JSON.stringify(someData);
    //   return data;
    // },
    data: { order: '-createdAt' },
    // data: { format: 'json'},
    // contentType: 'application/json',
    success: function (data) {
      // data.results.sort(function(a, b) {
      //   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      // });
      app.clearMessages();
      console.log(data)
      let messages = data.results;
      // console.log('chatterbox: Message fetched', data);
      for (let i = 0; i < messages.length; i++) {
        //if (messages[i].roomname === room) {
          console.log('iterarting bro!!!!')
          app.renderMessage(messages[i]);
        //}
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  let $messageNode = $('<div class="messageNode"></div>');
  $messageNode.addClass(message.roomname);
  
  let $user = $(`<button class="username" value="${message.username}"></button>`);
  $user.addClass(message.username);
  $user.text(message.username + ': ');
  $messageNode.append($user);
  
  let $text = $('<div></div>');
  $text.attr('id', message.objectId);
  $text.text(message.text);
  $messageNode.append($text);
  if (app.friends.includes(message.username)) {
    $text.css('font-weight', 'bold');
  }
   
  
  
  // let $timeStamp = $(`<div id="time-stamp">${$.timeago(message.createdAt)}</div>`);
  // $messageNode.append($timeStamp);
  
  $('#chats').append($messageNode); 
};

app.renderRoom = function(roomName) {
  app.rooms[roomName] = true;
  let roomNode = $('<option value="' + roomName + '">' + roomName + '</option>');
  $('#roomSelect').append(roomNode);  
};

app.handleUsernameClick = function() {
  console.log($(this).val());
  app.friends.push($(this).val());
  let room = $('#roomSelect').val();
  app.fetch(room);
};

app.handleSubmit = function() {
  let text = $('#text-input').val();
  let username = window.location.search;//fill in with function to get user
  //console.log(username.slice(10));
  let roomname = 'testing';//fill in to get room
  let message = {
    'username': username.slice(10),
    'text': text,
    'roomname': $('#roomSelect').val()
  };
  app.send(message);
};
   
$( document ).ready(function() {

  
  let room = $('#roomSelect').val();
  app.init();
  app.fetch(room);
  setInterval(function() {
    let room = $('#roomSelect').val();
    app.fetch(room);
  }, 5000);
  

  // var button = document.getElementById("user");
  // button.onclick = function() {
  // //do stuff
  //   console.log('asdf');
  //   app.friends.push($(this).val());
  // };
  
});


// var message = {
//   username: 'mikeandtony',
//   text: 'is this working',
//   roomname: '4chan'
// };



