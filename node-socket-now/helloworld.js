var http = require('http');
var nowjs = require('now');
var fs = require('fs');

//Lets define a port we want to listen to
const PORT=1337; 

var httpServer = http.createServer(function (req, res) {
  fs.readFile(__dirname + '/helloworld.html', function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();  
  });
});


var everyone = nowjs.initialize(httpServer);

nowjs.on('connect', function(){
  console.log('Joined: ' + this.now.name);
});

nowjs.on('disconnect', function(){
  console.log('Left: ' + this.now.name);
});

/* delcare a function in the now namespace */
everyone.now.distributeMessage = function(message){
  everyone.now.receiveMessage(this.now.name, message);
};


httpServer.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});