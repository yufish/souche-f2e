func_user = __F 'user'
md5 = require 'MD5'
module.exports=(req,res,next)->
    if req.cookies._p
      p = req.cookies._p.split ':'
      if p.length==2
        uid = p[0]
        token = p[1]
        func_user.getById uid,(error,user)->
          if user.is_block
            next new Error '您已经被加入本站黑名单。请联系 xinyu198736@gmail.com 恢复账户'
          else if user 
            if md5(user.weibo_token)==token
              
              res.locals.user = user
              next();
            else
              res.redirect '/user/login?redirect='+encodeURIComponent(req.url)
          else
            res.redirect '/user/login?redirect='+encodeURIComponent(req.url)
      else
        res.redirect '/user/login?redirect='+encodeURIComponent(req.url)
    else
      res.redirect '/user/login?redirect='+encodeURIComponent(req.url)