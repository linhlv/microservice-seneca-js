console.log(__filename);
console.log(__dirname);

setTimeout(function(){
  console.log('delay');
}, 5000);

setInterval(function(){
  console.log('timely')
}, 5000);