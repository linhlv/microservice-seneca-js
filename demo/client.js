require('seneca')()
  .client({host: '127.0.0.1', port: 9987})
  .act('role:math,cmd:sum,left:1,right:2', console.log)
  .act('role:math,cmd:sum,left:3,right:4', console.log);

console.log('Hello World!');