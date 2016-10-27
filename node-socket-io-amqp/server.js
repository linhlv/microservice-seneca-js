var io = require('socket.io')();

io.serveClient(false);

io.on('connection', function(socket){
  console.log('A client is connected.');
  
  socket.on('register', function(data){
    console.log('A client is registering:', data);
    socket.join('listening:user:id:' + data.id);
    
    io.to('listening:user:id:' + data.id).emit('registered',{registered: true});
  });
  
});


io.on('disconnect', function(client){
  console.log('A client is left.');
});



io.listen(3210, function(sk){
  console.log('Server is running...');
});
