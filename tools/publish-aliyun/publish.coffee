argv = require('optimist').argv
Publish = require './put.coffee'
pub = new Publish({
  properties_file: if argv.resource then argv.resource else "./resource.properties",
  white_list:['.js','.less','.css','.png','.jpg','.jpeg','.rjs','gif'], #文件后缀的白名单
  black_list:[/\.min\.js/] #文件名的黑名单，正则
});
pub.addMiddleware(".js",require("./middleware/mw-compress.coffee"))
pub.addMiddleware(".less",require("./middleware/mw-less.coffee"))
pub.addMiddleware(".png",require("./middleware/mw-png.coffee"))
pub.addMiddleware(".jpeg",require("./middleware/mw-png.coffee"))
pub.addMiddleware(".jpg",require("./middleware/mw-png.coffee"))
pub.addMiddleware(".rjs",require("./middleware/mw-requirejs.coffee"))
pub.pub((if argv.path then argv.path else "./test"))

