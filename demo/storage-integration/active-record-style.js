var seneca = require('seneca')();

var product = seneca.make('product');
product.name = 'Apple';
product.price = 1.99;

// sends role:entity,cmd:save,name:product message
product.save$(console.log);

