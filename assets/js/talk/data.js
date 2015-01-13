define(['talk/util','souche/util/sc-db'],function(SoucheIMUtil,DB){
    /**
     * 承载聊天数据
     */
    var SoucheIMData = function(){
        var lastMessageTime = 0;
        var souchedb = new DB("souche");
        return {
            /**
             * 最近联系人
             friendId:
             friendName:
             unReadMsg:
             */
            contacts:[],
            //现在激活的聊天对象
            now_chat_userid:"admin",
            //我的id
            my_userid:"",
            /**
             * 消息列表，以用户id为key，值是数组
             user_id:from_user_id,
             user_name:name,
             content:content,
             is_me:false,
             ext:msg.ext,
             timestramp:new Date().getTime()+Math.random()
             */
            messages:{},
            /**
             * 添加一条最近联系人，如果已存在则忽略，但是未读会+1
             * @param user_id
             */
            addContact:function(user_id,unread,callback){
                var is_in = false;
                var self = this;
                SoucheIMUtil.getUsername(user_id,function(name) {
                    self.contacts.forEach(function(c,i){
                        if(c.friendId==user_id){
                            is_in = true;
                            c.unReadMsg+=(typeof(unread)=="undefined"?1:unread);
                            self.contacts.unshift(self.contacts.splice(i,1)[0]);
                        }
                    })
                    if(!is_in) {
                        self.contacts.unshift({
                            friendId: user_id,
                            friendName: name + ":" + user_id.replace(/[^0-9]/g,""),
                            unReadMsg: (typeof(unread)=="undefined"?1:unread)
                        })
                    }
                    callback();
                })
            },
            addHistoryMessage:function(msg){
                var from_user_id = msg.from;
                var content = msg.data
                if(!this.messages[from_user_id]){
                    this.messages[from_user_id] = [];
                }
                var self = this;
                SoucheIMUtil.getUsername(from_user_id,function(name){
                    var message = {
                        user_id:from_user_id,
                        user_name:name,
                        content:content,
                        is_me:false,
                        ext:msg.ext,
                        timestramp:new Date().getTime()+Math.random()
                    }
                    var nowTime = new Date().getTime()
                    if(nowTime - lastMessageTime >1000*30){
                        message.time = moment().format("hh:mm")
                        lastMessageTime = nowTime;
                    }
                    self.messages[from_user_id].push(message)
                })
            },
            /**
             * 添加一条对方发来的消息
             * @param msg {from:,data:,to:}
             * @param callback
             */
            addMessage:function(msg,callback){
                var from_user_id = msg.from;
                var content = msg.data
                var unreadCount = 1;
                var self = this;
                if(from_user_id==this.now_chat_userid){
                    unreadCount = 0;
                }
                if(!this.messages[from_user_id]){
                    this.messages[from_user_id] = [];
                }
                var self = this;
                SoucheIMUtil.getUsername(from_user_id,function(name){
                    var message = {
                        user_id:from_user_id,
                        user_name:name,
                        content:content,
                        is_me:false,
                        ext:msg.ext,
                        img:msg.url,
                        timestramp:new Date().getTime()+Math.random()
                    }
                    var nowTime = new Date().getTime()
                    if(nowTime - lastMessageTime >1000*30){
                        message.time = moment().format("hh:mm")
                        lastMessageTime = nowTime;
                    }
                    self.messages[from_user_id].push(message)
                    self.addContact(from_user_id,unreadCount,callback)
                })
            },
            /**
             * 添加一条我自己发的消息
             * @param content
             */
            addLocalMessage:function(msg){
                if(!this.messages[this.now_chat_userid]){
                    this.messages[this.now_chat_userid] = [];
                }
                var message = {
                    user_id:this.my_userid,
                    user_name:"我",
                    content:msg.msg,
                    is_me:true,
                    timestramp:new Date().getTime()+Math.random(),
                    ext:msg.ext
                }
                console.log(message)
                var nowTime = new Date().getTime()
                if(nowTime - lastMessageTime >1000*30){
                    message.time = moment().format("hh:mm")
                    lastMessageTime = nowTime;
                }
                this.messages[this.now_chat_userid].push(message)
            },
            /**
             * 备份聊天记录到本地
             */
            dumpMessages:function(){
                for(var i in this.messages){
                    if(this.messages[i]&&this.messages[i].length){
                        souchedb.sets("souche_talk_messages_"+SoucheIMData.my_userid+"_to_"+i,this.messages[i])
                        souchedb.set("souche_talk_messages_time_"+SoucheIMData.my_userid+"_to_"+i,new Date().getTime())
                    }
                }
                console.log("dump message")
            },
            /**
             * 从本地恢复聊天记录
             */
            restoreMessages:function(user_id,friend_id){
                var ms = souchedb.gets("souche_talk_messages_"+user_id+"_to_"+friend_id);
                console.log(ms)
                if(ms){
                    this.messages[friend_id] = ms;
                }
            },
            restoreMessageFromOnline:function(user_id,friend_id){
                var self = this;
                SoucheIMUtil.getHistory(user_id,friend_id,function(msgList){
                    for(var i=msgList.length-1;i>=0;i--){
                        self.addHistoryMessage(msgList[i])
                    }
                })
            }
        }

    }();
    return SoucheIMData;
})