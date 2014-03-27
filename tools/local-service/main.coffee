express = require 'express'
http = require 'http'
path           = require 'path'
config         = require './config.coffee'
rainbow        = require './lib/rainbow.js'
lessmiddle     = require 'less-middleware'
less           = require 'less'
fs             = require 'fs'
expressUglify = require('express-uglify')
#log4js
log4js         = require 'log4js'
log4js.configure({
  appenders: [
    { type: 'console' }
#    {
#      type: 'file'
#      filename: 'logs/access.log'
#      maxLogSize: 1024
#      backups:3
#      category: 'normal' 
#    }
  ]
})
logger = log4js.getLogger('normal')
logger.setLevel('INFO')
#setup express
app = express()
app.configure ->
  app.set "port", config.run_port
  app.set "views", config.demo_path
  app.set "view engine", "jade"
  app.use express.favicon()
  app.use "/assets",lessmiddle({src:config.assets_path,compress:false,force:true})
  app.use "/assets", express.static(config.assets_path)
  # app.use express.logger("dev")
  # app.use express.bodyParser()
  # app.use express.cookieParser()
  # app.use express.cookieSession(secret: 'fd2afdsafdvcxzjaklfdsa')

  app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}))
  # app.locals.assets_head = config.assets_head
  # 直接输出静态jade的route，无需自己配置route
  app.locals.pretty = true;
  app.get /^\/demo\/(.*)$/,(req,res,next)->
    console.log req.params[0]
    res.locals.query = req.query
    _path = path.join config.demo_path,req.params[0]+".jade"
    if fs.existsSync _path
      res.render req.params[0]+".jade",{pretty:true}
    else
      fs.readFile (path.join config.demo_path,req.params[0]),'utf-8',(error,content)->
        if error 
          next error
        else
          res.send content
  app.use app.router
  
  # rainbow.route(app, {  
  #   controllers: '/controllers/',
  #   filters:'/filters/',      
  #   template:'/views/'   
  # })
  #404
  app.all "*",(req, res, next)->
      res.send "页面不存在",404
  #错误显示页面
  app.use (err, req, res, next)->
    console.trace err
    res.send err.message,404
  
  # app.locals.moment= require 'moment'
  # app.locals.moment.lang('zh-cn');
app.set('env', 'development');
console.log process.env.NODE_ENV
app.configure "development", ->
  app.use express.errorHandler()

module.exports = app
