var seneca = require('seneca')();

function math(options){
  this.add('role:math, cmd:sum', function(msg, respond){
    respond(null, {answer: msg.left + msg.right});
  });

  this.add('role:math, cmd:product', function(msg, respond){
    respond(null, {answer: msg.left * msg.right});
  })
}

seneca.use(math);

seneca.act('role:math,cmd:sum,left:1,right:2', console.log);
