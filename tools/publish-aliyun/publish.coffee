ossApi = require './lib/oss_client.js'
config = require './config.coffee'
walkdo = require 'walkdo'
queuedo = require 'queuedo'
path = require 'path'
oss = new ossApi.OssClient(config)
OSS = 
  pubFile:(_path)->
    oss.putObject config.bucketName, _path.replace(/^\.\//,''), _path,null,(err)->
      if err
        console.log err
      else
        console.log 'success'
  getFile:(_path)->
    oss.getObject config.bucketName,_path.replace(/^\.\//,''),"oss_client.test",null,(err,info)->
      if err
        console.log err
      else
        console.log oss.getObjectEtag(info)
        console.log info
  
# Publish.pubFile('./lib/oss_client.js')

# OSS.getFile("./lib/oss_client.js")

Publish = ()->
  this.middlewares = []
  undefined

#添加一个处理中间件，根据ext判断是否要经过这个中间件处理，中间件输入一个文件，返回一个处理过的文件的内容。
#middleware 返回一个数组，列出要发布的文件结果路径。
Publish.prototype.addMiddleware = (ext,middleware)->
  this.middlewares.push({ext:ext,middleware:middleware})

Publish.prototype.pub = (_path)->
  self = this
  middlewares = this.middlewares
  walkdo _path,(file,next,context)->
    console.log file
    self.handleFile(file)
    next.call(context)
  ,()->
    console.log("all finish!")
Publish.prototype.handleFile = (file)->
  file = file
  self = this
  queuedo this.middlewares,(mw,next,context)->
    if path.extname(file)==mw.ext
      mw.middleware file,(error,_file)->
        if error
          console.log error
        else
          file = _file
        next.call(context)
  ,()->
    self.pubFile(file)

Publish.prototype.pubFile = (file)->
  Publish.pubFile(file.replace(/^.*assets\//,'assets/'))


pub = new Publish();
console.log(pub)
pub.addMiddleware(".js",require("./mw-compress.coffee"))
pub.pub("./test")