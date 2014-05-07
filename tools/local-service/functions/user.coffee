User = __M 'f2e_users'
User.sync()
pinyin = require './../lib/PinYin.js'
cache = 
  allNames:
    data:[]
    time:0
func_user =  
  getAllNames:(callback)->
    nowTime = new Date().getTime()
    if (nowTime-cache.allNames.time>1000*60*60) #every hour
      User.findAll
        order:'nick'
      .success (users)->
        us = []
        users.forEach (user)->
          us.push {id:user.id,nick:user.nick,head_pic:user.head_pic,pinyin:pinyin(user.nick,{style: pinyin.STYLE_NORMAL}).join("")}
        cache.allNames.data = us
        cache.allNames.time = nowTime
        callback null,us
      .error (e)->
        callback null,[]
 
    else
      callback null,cache.allNames.data
  getByUserIds:(ids,callback)->
    User.findAll
      where:
        id:ids
    .success (users)->
      callback null,users
    .error (error)->
      callback error
  getByWeiboId:(id,callback)->
    User.find
      where:
        weibo_id:id
    .success (user)->
      callback null,user
    .error (error)->
      callback error
  getByNick:(nick,callback)->
    User.find
      where:
        nick:nick
    .success (user)->
      if not user
        callback new Error '不存在的用户昵称'
      else
        callback null,user
    .error (error)->
      callback error
  
  
__FC func_user,User,['update','count','delete','getById','getAll','add']
module.exports = func_user