var app = require('http').createServer(function(req,res){});
var io = require('socket.io')(app);

io.serveClient(false);
io.set('origins', 
       'http://microservice-seneca-js-linhle.codeanyapp.com:*');

io.on('connection', function(socket){
  console.log('A client is connected.');
  
  socket.on('register', function(data){
    console.log('A client is registering:', data);
    socket.join('listening:user:id:' + data.id);
    socket.join('listening:group:' + data.group);
  });
  
  io.emit('message', {
    message: 'something there'
  });
  
  /*
  io.to().emit('sendittome', {
    message: 'something there to you'
  });
  */
  
  socket.on('sendittogroup', function(data){
    
    console.log('sendittogroup', data);
    
    io.to('listening:group:group1').emit('groupreceived', {
      message: 'something there to your group'
    });  
  });
});


app.listen(3210, function(){
  console.log('Server is running...');
});