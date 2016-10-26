require('seneca')()
  .client({type:'tcp', port:80})
  .act('role:math,cmd:sum,left:1,right:2', console.log);

require('seneca')()
  .use(math)
  .listen({type: 'tcp', port: 80});