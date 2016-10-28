var app = require('http').createServer(function(req,res){});
var io = require('socket.io')(app);

app.listen(80);