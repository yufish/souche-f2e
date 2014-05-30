func_user = require './../functions/user.coffee'
md5 = require 'MD5'
module.exports=(req,res,next)->
    result = 
      success:0

    if req.cookies._p
      p = req.cookies._p.split ':'
      if p.length==2
        uid = p[0]
        token = p[1]
        func_user.getById uid,(error,user)->
          if user 
            if md5(user.weibo_token)==token
              
              res.locals.user = user
              next();
            else
              result.success = 0
              result.isnotlogin = 1
              res.send result
          else
            result.success = 0
            result.isnotlogin = 1
            res.send result
      else
        result.success = 0
        result.isnotlogin = 1
        res.send result
    else
      result.success = 0
      result.isnotlogin = 1
      res.send result