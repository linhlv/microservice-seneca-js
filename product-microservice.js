var seneca = require('seneca')();
seneca.add({role:'math', cmd: 'sum'}, function onMatch(msg, respond){
  var sum = msg.left + msg.right;
  respond(null, {answer: sum});
});

seneca.add({role:'math', cmd: 'product'}, function onMatch(msg, respond){
  var product = msg.left * msg.right;
  respond(null, {answer: product});
});

/*
seneca.add({role: 'math', cmd: 'sum', integer: true},
  function(msg, respond){
    var sum = Math.floor(msg.left) + Math.floor(msg.right);
    respond(null, {answer: sum});
});
*/

seneca.add('role:math, cmd:sum, integer: true', function(msg, respond){
  this.act({
    role: 'math',
    cmd: 'sum',
    left: Math.floor(msg.left),
    right: Math.floor(msg.right)
  }, respond);
});

seneca.act({role: 'math', cmd: 'sum', left: 1, right: 2}, function(err, result){
  if(err) return console.error(err);
  console.log(result);
});

seneca.act({role: 'math', cmd: 'product', left: 3, right: 4}, function(err, result){
  if(err) return console.error(err);
  console.log(result);
});
