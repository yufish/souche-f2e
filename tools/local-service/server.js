var CoffeeScript = require('coffee-script');
CoffeeScript.register();
require("./lib/BaseInit.js");
var config = require("./config.js");
var server = require("./index.js");


require('http').createServer(server).listen(config.run_port, function() {
    console.log("Express server listening on port " + server.get("port"));
}).setMaxListeners(0);