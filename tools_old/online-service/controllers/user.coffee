func_user = __F 'user'
config = require './../config.coffee'
md5 = require 'MD5'
querystring = require 'querystring'
uuid = require 'node-uuid'
module.exports.controllers = 
  "/login":
    get:(req,res,next)->
      

