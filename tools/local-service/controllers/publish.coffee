Publish = require './../../publish-aliyun/put.coffee'
pub = new Publish({
  properties_file:__CONFIG.resource_path,
  white_list:['.js','.less','.css','.png','.jpg'], #文件后缀的白名单
  black_list:[/\.min\.js/] #文件名的黑名单，正则
});
pub.addMiddleware(".js",require("./../../publish-aliyun/middleware/mw-compress.coffee"))
pub.addMiddleware(".less",require("./../../publish-aliyun/middleware/mw-less.coffee"))
# pub.addMiddleware(".png",require("./../../publish-aliyun/middleware/mw-png.coffee"))

queuedo = require 'queuedo'
func_changefile = __F 'changefile'
module.exports.controllers = 
    "/":
        get:(req,res,next)->

            res.render "publish-list.jade"
        post:(req,res,next)->
            console.log req.body.filelist
            if typeof(req.body.filelist).toLowerCase() == 'string'
                req.body.filelist = [req.body.filelist]

            queuedo req.body.filelist,(file,next,context)->
                pub.pub __CONFIG.f2e_path+file,(error,info)->
                    if not error
                        func_changefile.updateByPath file,{is_publish:1},(error)->
                            if error
                                console.log error
                    next.call(context)
            ,()->
                res.send '发布成功：'+req.body.filelist
    "/log":
        get:(req,res,next)->
            count = 0
            res.setHeader('content-type', 'text/html; charset=utf-8')
            setInterval ()->
                count++
                res.write count+""
            ,1000
            # pub.pub 
module.exports.filters = 
    "/":
        get:['no-publish-files']