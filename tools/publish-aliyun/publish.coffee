ossApi = require './lib/oss_client.js'
OSS = require('ali-oss')
co = require('co')
global.config = config = require './config.coffee'
walkdo = require 'walkdo'
queuedo = require 'queuedo'
path = require 'path'
properties = require 'properties'
fs = require 'fs'
fse = require 'fs-extra'
argv = require('optimist').argv
oss = new ossApi.OssClient(config)
client = OSS.create(config)
client.upload = co(client.upload)
client.get = co(client.get)
client.remove = co(client.remove)
timestampData = {}
countObject = (obj)->
  count = 0
  for i of obj
    count++
  return count
OSS =
  #第一个参数是发布的路径，第二个参数是真实发布的文件路径，发布完成调用callback
  pubFile:(_path,realPath,callback)->
    console.log '开始处理：'+_path+" 真实路径："+realPath
    clearPath = _path.replace(/^.*?\//,'/assets/')
    etag = oss.getObjectEtag(realPath)
    client.get _path,"cache.test",(error,info)->
      if error
        console.log "start uploading "+clearPath
        if timestampData[clearPath]
          timestampData[clearPath] = timestampData[clearPath]*1+1
        else
          timestampData[clearPath] = 1
        client.upload realPath,_path.replace(/^\.\//,''),(err, data)->
          if err
            console.error err
          else
            console.log "upload finished " + _path.replace(/^\.\//,'')
          callback err
      else
        etagOnline = oss.getObjectEtag(__dirname+"/cache.test")
        if etagOnline != etag
          console.log "start uploading "+clearPath
          if timestampData[clearPath]
            timestampData[clearPath] = timestampData[clearPath]*1+1
          else
            timestampData[clearPath] = 1
          client.upload realPath,_path.replace(/^\.\//,''),(err, data)->
            if err
              console.error err
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
    fse.copy self.config.properties_file,self.config.properties_file+".backup",(error)->
      if error then console.log error
      fs.writeFile self.config.properties_file,properties.stringify(timestampData),'utf-8',(error)->
        if error then console.log error
        console.log 'properties length:'+countObject(timestampData)
Publish.prototype.handleFile = (file,callback)->
  obj = 
    path:file
    realPath:file
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
      mw.middleware obj.realPath,(error,result)->
        if error
          console.log error
        else
          obj.path = result.path
          obj.realPath = result.realPath
        next.call(context)
    else
      next.call(context)
  ,()->
    self.pubFile(obj.path,obj.realPath,callback)

Publish.prototype.pubFile = (_path,realPath,callback)->
  OSS.pubFile(_path.replace(/^.*assets\//,'assets/'),realPath,callback)



pub = new Publish({
  properties_file: if argv.resource then argv.resource else "./resource.properties",
  white_list:['.js','.less','.css','.png','.jpg'], #文件后缀的白名单
  black_list:[/\.min\.js/] #文件名的黑名单，正则
});
pub.addMiddleware(".js",require("./middleware/mw-compress.coffee"))
pub.addMiddleware(".less",require("./middleware/mw-less.coffee"))
pub.addMiddleware(".png",require("./middleware/mw-png.coffee"))

pub.pub((if argv.path then argv.path else "./test"))