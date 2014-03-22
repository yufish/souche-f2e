ossApi = require './lib/oss_client.js'
config = require './config.coffee'
walkdo = require 'walkdo'
queuedo = require 'queuedo'
path = require 'path'
properties = require 'properties'
fs = require 'fs'
argv = require('optimist').argv
oss = new ossApi.OssClient(config)
timestampData = {}
OSS = 
  pubFile:(_path,callback)->
    console.log '开始处理：'+_path
    clearPath = _path.replace(/^\.\//,'/')
    etag = oss.getObjectEtag(_path)
    this.getFile _path,(error,info)->
      etagOnline = oss.getObjectEtag(info)
      if etagOnline != etag
        console.log "start uploading "+_path
        if timestampData[clearPath]
          timestampData[clearPath] = timestampData[clearPath]*1+1
        else
          timestampData[clearPath] = 1
        oss.putObject config.bucketName, _path.replace(/^\.\//,''), _path,(err)->
          if err
            console.log err
          else
            console.log "upload finished " + _path.replace(/^\.\//,'')
          callback err

      else
        console.log "无变化 "
        callback error

  getFile:(_path,callback)->
    oss.getObject config.bucketName,_path.replace(/^\.\//,''),"cache.test",(err,info)->
      if err
        console.error err
      callback err,info
  
# Publish.pubFile('./lib/oss_client.js')

# OSS.getFile("./lib/oss_client.js")

Publish = (_config)->
  self = this
  this.config = 
    properties_file:""
    white_list:['']
  for k,v of _config
    this.config[k]=v
  this.middlewares = []
  properties.parse this.config.properties_file,{path:true},(error, obj)->
    if error then console.error error
    timestampData = obj
  undefined

#添加一个处理中间件，根据ext判断是否要经过这个中间件处理，中间件输入一个文件，返回一个处理过的文件的内容。
#middleware 返回一个数组，列出要发布的文件结果路径。
Publish.prototype.addMiddleware = (ext,middleware)->
  this.middlewares.push({ext:ext,middleware:middleware})

Publish.prototype.pub = (_path)->
  self = this
  middlewares = this.middlewares
  walkdo _path,(file,next,context)->
    self.handleFile file,()->
      next.call(context)
  ,()->
    console.log("all finish!")
    fs.writeFileSync self.config.properties_file,properties.stringify(timestampData),'utf-8'
Publish.prototype.handleFile = (file,callback)->
  file = file
  self = this
  is_in_white = false
  extname = path.extname(file)
  for i in [0...this.config.white_list.length]
    if extname.indexOf(this.config.white_list[i]) != -1
      is_in_white = true
  if !is_in_white 
    callback null
    return
  queuedo this.middlewares,(mw,next,context)-> 
    if extname == mw.ext
      mw.middleware file,(error,_file)->
        if error
          console.log error
        else
          file = _file
        next.call(context)
    else
      next.call(context)
  ,()->
    self.pubFile(file,callback)

Publish.prototype.pubFile = (file,callback)->
  OSS.pubFile(file.replace(/^.*assets\//,'assets/'),callback)



pub = new Publish({
  properties_file:argv.resource?argv.resource:"./resource.properties",
  white_list:['.js','.less','.css','.png','.jpg'], #文件后缀的白名单
  black_list:[/\.min\.js/] #文件名的黑名单，正则
});
pub.addMiddleware(".js",require("./middleware/mw-compress.coffee"))
pub.addMiddleware(".less",require("./middleware/mw-less.coffee"))
pub.addMiddleware(".png",require("./middleware/mw-png.coffee"))
pub.pub((argv.path?argv.path:"./test"))