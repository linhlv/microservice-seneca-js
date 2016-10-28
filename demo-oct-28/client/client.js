var http = require('http');
var fs = require('fs');


//Lets define a port we want to listen to
const PORT=133; 

var httpServer = http.createServer(function (req, res) {
  fs.readFile(__dirname + '/client.html', function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();  
  });
});



httpServer.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});