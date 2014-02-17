
var CoffeeScript = require ('coffee-script');
CoffeeScript.register();
var config = require ("./config.coffee");
var server = require ("./main.coffee");


require('http').createServer(server).listen(config.run_port,function(){
    console.log("Express server listening on port " + server.get("port"));
  }).setMaxListeners(0);

