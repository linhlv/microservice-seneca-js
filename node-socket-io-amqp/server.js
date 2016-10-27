var app = require('http').createServer(function(req,res){});
var io = require('socket.io')(app);

io.serveClient(false);

io.set('origins', 
       'http://microservice-seneca-js-linhle.codeanyapp.com:* http://domain.com:* http://domain.org:* http://domain.net:* http://domain.gov:*');

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


app.listen(3210, function(){
  console.log('Server is running...');
});
