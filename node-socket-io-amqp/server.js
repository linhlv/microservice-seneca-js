var amqp = require('amqplib/callback_api');
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
    
    io.to('listening:user:id:' + data.id).emit('registered',{registered: true, id: data.id});
  });
});


io.on('disconnect', function(client){
  console.log('A client is left.');
});



var amqpConn = null;

function start() {
  amqp.connect('amqp://vlqtfukt:72ee0WhIwOcR-utyQSlZbfAsNhu5CixT@white-mynah-bird.rmq.cloudamqp.com/vlqtfukt?heartbeat=60', function(err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
    }
    conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });
    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });
    console.log("[AMQP] connected");
    amqpConn = conn;
    whenConnected();
  });
}


function whenConnected() {
  startPublisher();
  startWorker();
}


var pubChannel = null;
var offlinePubQueue = [];

function startPublisher() {
  amqpConn.createConfirmChannel(function(err, ch) {
    if (closeOnErr(err)) return;
      ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    pubChannel = ch;
    while (true) {
      var m = offlinePubQueue.shift();
      if (!m) break;
      publish(m[0], m[1], m[2]);
    }
  });
}


function publish(exchange, routingKey, content) {
  try {
    pubChannel.publish(exchange, routingKey, content, { persistent: true },
                      function(err, ok) {
                        if (err) {
                          console.error("[AMQP] publish", err);
                          offlinePubQueue.push([exchange, routingKey, content]);
                          pubChannel.connection.close();
                        }
                      });
  } catch (e) {
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([exchange, routingKey, content]);
  }
}


// A worker that acks messages only if processed successfully
function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    ch.prefetch(10);
    ch.assertQueue("jobs", { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume("jobs", processMsg, { noAck: false });
      console.log("Worker is started");
    });
    
     function processMsg(msg) {
        work(msg, function(ok) {
          try {
            if (ok)
              ch.ack(msg);
            else
              ch.reject(msg, true);
          } catch (e) {
            closeOnErr(e);
          }
        });
      }
    
  });
}                

function work(msg, cb) {
  if(msg.content.indexOf('id:') >= 0) {
    console.log('sending message to socket.io', msg.content.toString());  
    var id = msg.content.toString().split(':')[1];
    io.to('listening:user:id:' + id).emit('received',{
      original: 'amqp',
      id: id
    });
    
  } else{
    console.log("PDF processing of ", msg.content.toString());  
  } 
  
  cb(true);
}

function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}



app.listen(3210, function(){
  console.log('Server is running...');
  
  start();
  
  setInterval(function() {
    publish("", "jobs", new Buffer("work work work"));
  }, 10000);  
});
