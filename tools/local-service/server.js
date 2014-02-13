
require ("coffee-script");
var server = require ("./main.coffee")
var config = require ("./config.coffee")

require('http').createServer(server).listen(config.run_port,function(){
    console.log("Express server listening on port " + server.get("port"));
  }).setMaxListeners(0);

