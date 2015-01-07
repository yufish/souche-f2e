define(['souche/util/sc-db','lib/moment'],function(DB,Moment){
    var souchedb = new DB("souche");
    var appkey = "souche#souchetest";
    var conn = new Easemob.im.Connection();

    $("#talking-text").attr("placeholder","正在连接聊天服务器，请稍候")
    conn.init({
        https : false,
        //当连接成功时的回调方法
        onOpened : function() {
            console.log("open")
            $("#talking-text").attr("placeholder","连接成功，开始聊天吧")
            conn.setPresence();
            SoucheIM.onOpen();
//            handleOpen(conn);
        },
        //当连接关闭时的回调方法
        onClosed : function() {
            //handleClosed();
            console.log("close")
            $("#talking-text").attr("placeholder","聊天结束，连接关闭")
            SoucheIM.leaveWindow();
        },
        //收到文本消息时的回调方法
        onTextMessage : function(message) {
            console.log("text message")
            message.content = message.data;
            console.log(message)
            setTimeout(function(){
                SoucheIMData.addMessage(message);
                window.parent.window.Souche.Sidebar.newMessageTip();
            })
        },
//    //收到表情消息时的回调方法
//    onEmotionMessage : function(message) {
//        console.log(message)
//        //handleEmotion(message);
//    },
        //收到图片消息时的回调方法
        onPictureMessage : function(message) {
            console.log("onPictureMessage")
            //handlePictureMessage(message);
        },
//    //收到音频消息的回调方法
//    onAudioMessage : function(message) {
//        console.log(message)
//        //handleAudioMessage(message);
//    },
//    onLocationMessage : function(message) {
//        console.log(message)
//        //handleLocationMessage(message);
//    },
        //收到联系人订阅请求的回调方法
        onPresence : function(message) {
            //handlePresence(message);
        },
        //收到联系人信息的回调方法
        onRoster : function(message) {
            //handleRoster(message);
        },
        //收到群组邀请时的回调方法
        onInviteMessage : function(message) {
            //handleInviteMessage(message);
        },
        //异常时的回调方法
        onError : function(message) {
            console.log(message)
            //handleError(message);
        }
    });

    var SoucheIMUtil = function(){
        var souche_token = "ScM9Eno7f2dl0vz"
        var username_cache = {

        }
        return {
            getHistory:function(user_id,friend_id,callback){
                $.ajax({
                    url:contextPath+"/chatAction/receive.json",
                    data:{
                        token:souche_token,
                        user:user_id,
                        friend:friend_id.replace("cn_","cheniu_")
                    },
                    dataType:"json",
                    success:function(data){
                       if(data.msgList){
                           var arr = []
                           data.msgList.items.forEach(function(msg){
                               arr.push({
                                   from:friend_id,
                                   data:msg.body
                               })
                           })
                           callback(arr);
                       }
                    }
                })
            },
            /**
             * 获取最近联系人列表
             * @param user_id
             * @param callback
             */
            getRecentContacts:function(user_id,callback){
                $.ajax({
                    url:contextPath+"/chatAction/getChatList.json",
                    data:{
                        token:souche_token,
                        user:user_id
                    },
                    dataType:"json",
                    success:function(data){
                        /**
                         * friendId:user_id,
                         friendName:user_id,
                         unReadMsg:1
                         */
                        if(data.chatList.code=="0"){
                            data.chatList.items.forEach(function(c){
                                    c.friendId = c.friend.replace("cheniu_","cn_");
                                    c.friendName = c.friend.replace("cheniu_","cn_");
                                    c.unReadMsg = c.unread;
                            })
                            callback(data.chatList.items);
                        }
                    }
                })
            },
            /**
             * 向网站同步一份消息，主要用来做最近联系人列表
             * @param toUserId
             * @param content
             */
            sendMessage:function(userId,toUserId,content){
                $.ajax({
                    url:contextPath+"/chatAction/send.json",
                    data:{
                        friend:toUserId,
                        user:userId,
                        body:content
                    },
                    dataType:"json",
                    success:function(data){
                        console.log(data)
                    }
                })
            },
            /**
             * 获取昵称，带缓存
             * @param user_id
             * @param callback
             */
            getUsername:function(user_id,callback){
                if(username_cache[user_id]){
                    callback(username_cache[user_id])
                    return;
                }
                $.ajax({
                    url:contextPath+"/pages/app/thumbelina/easemobIMUsersAction/getChatUserInfo.json",
                    data:{
                        id:user_id.replace(/[^0-9]/g,'')
                    },
                    dataType:"json",
                    success:function(data){
                        if(data.code==100000){
                            username_cache[user_id] = data.data.userInfo.friendName;
                            callback(data.data.userInfo.friendName);
                        }else{
                            callback()
                        }
                    }
                })
            },
            /**
             * 先去获取环信用户名和密码
             * @param phone
             * @param callback
             */
            getLoginInfo:function(phone,callback){
                $.ajax({
                    url:contextPath+"/pages/app/thumbelina/chatIDMapAction/getMapChatID.json",
                    data:{
                        userId:phone
                    },
                    dataType:"json",
                    success:function(data){
                        if(data.code==100000){
                            callback(data.data.chatId,data.data.pwd);
                        }
                    }
                })
            }
        }
    }();
    var SoucheIMData = function(){
        var lastMessageTime = 0;

        //记录是否已经从线上加载过聊天记录，第一次才调用。
        var hasLoadOnline = {}
        return {
            contacts:[],
            now_chat_userid:"admin",
            my_userid:"",
            messages:{},
            switch_active:function(user_id){
                this.now_chat_userid = user_id;
                this.contacts.forEach(function(c){
                    if(c.friendId==user_id){
                        c.unReadMsg = 0;
                    }
                })

                SoucheIMRender.clearChatView();


                if(!hasLoadOnline[this.now_chat_userid]){
                    var lastDumpTime = souchedb.get("souche_talk_messages_time");
                    var loadFromLocal = false;
                    if(lastDumpTime){
                        if(new Date().getTime() - lastDumpTime*1<1000*60){
                            loadFromLocal = true;

                        }else{

                        }
                    }
                    if(loadFromLocal){
//                        SoucheIMData.restoreMessages();
                    }else{
                        SoucheIMData.restoreMessageFromOnline(this.my_userid,this.now_chat_userid)
                    }
                    hasLoadOnline[this.now_chat_userid] = true;
                }

            },
            /**
             * 添加一条最近联系人，如果已存在则忽略，但是未读会+1
             * @param user_id
             */
            addContact:function(user_id,unread){
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
                    SoucheIMRender.renderContacts()
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
             * @param from_user_id
             * @param content
             */
            addMessage:function(msg,addUnread){
                var from_user_id = msg.from;
                var content = msg.data
                var unreadCount = 1;
                if(from_user_id==this.now_chat_userid){
                    unreadCount = 0;
                }
                this.addContact(from_user_id,unreadCount)
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
                        if(this.messages[i]){

                        }
                    }
                }
                souchedb.set("souche_talk_messages",this.messages)
                souchedb.set("souche_talk_messages_time",new Date().getTime())
                console.log("dump message")
            },
            /**
             * 从本地恢复聊天记录
             */
            restoreMessages:function(){
                var ms = souchedb.get("souche_talk_messages");
                if(ms){
                    this.messages = ms;
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
    var SoucheIMRender = function() {
        /**
         * 检查m是否存在于ms中，用message中得timestramp检查
         * @param m
         * @param ms
         */
        var checkInArray = function(m,ms){
            var is_in = false;
            ms.forEach(function(_m){
                if(_m.timestramp== m.timestramp){
                    is_in = true;
                }
            })
            return is_in;
        }
        var lastRenderMessage = {};
        return {
            /**
             * 渲染最近联系人列表
             */
            renderContacts:function () {
                $(".contact-list .contacts").html(function () {
                    var html = "";
                    SoucheIMData.contacts.forEach(function (c) {
                        html += "<li class='contact-item "+(SoucheIMData.now_chat_userid==c.friendId?"active":"")+"' data-id='" + c.friendId + "'><span class='cont-name'>" + c.friendName + "</span>"+(c.unReadMsg?("<i class='info-num'>" + c.unReadMsg + "</i>"):"")+"</li>"
                    })
                    if(!SoucheIMData.contacts.length){
                        html="<li class=no-contact>暂无联系人</li>"
                    }
                    return html;
                }())
            },
            clearChatView:function(){
                $(".talk-histary").html("");
                lastRenderMessage = {};
            },
            /**
             * 渲染聊天窗口，根据now_user_id，不是全量渲染，使用message中得timestramp实现增量渲染。
             */
            renderChat:function () {
                var nowFromId = SoucheIMData.now_chat_userid;
                var messages = SoucheIMData.messages[nowFromId];
                if (!lastRenderMessage[nowFromId]) {
                    lastRenderMessage[nowFromId] = [];
                }
                if (messages&&messages.length) {
                    var this_time_render = 0;
                    messages.forEach(function (message) {
                        if(!checkInArray(message,lastRenderMessage[nowFromId])){
                            this_time_render++;
                            var html = '<li class="' + (message.is_me ? "my" : "shop") + '-cont clearfix">' +
                                (message.time?('<div class="time">' + message.time + '</div>'):'') +
                                '<div class="figure">' + message.user_name + '</div>' +
                                '<div class="talk-content"><i class="cont-arrow"></i>';
                            if(message.ext&&message.ext.messageType==3){
                                var carInfo = JSON.parse(message.ext.content);
                                html +='<a href="http://www.souche.com/pages/mobile/detail.html?carId='+carInfo.ID+'">http://www.souche.com/pages/mobile/detail.html?carId='+carInfo.ID+'</a>'+
                                    '<div class="car-box clearfix"><a class="car-img clearfix"><img src="'+carInfo.pictures+'"></a>'+
                                        '<div class="car-info">'+
                                            '<div class="car-title"><a href="http://www.souche.com/pages/mobile/detail.html?carId='+carInfo.ID+'">'+carInfo.carShortName+'</a></div>'+
                                            '<div class="car-price"><span>价格：</span><em>￥'+(carInfo.price/10000).toFixed(2)+'万</em></div>'+
                                            '<div class="car-time"><span>上牌</span><span>'+carInfo.registerDate+'</span></div>'+
                                            '<div class="car-area"><span>所属地：</span><span>'+carInfo.area+'</span></div>'+
                                        '</div>'+
                                    '</div>'
                            }else{
                                html +='    <p>' + message.content + '</p>'
                            }


                            html +='</div>' +'</li>';
                            var liItem = $(html)
                            liItem.css({opacity:0})
                            $(".talk-histary").append(liItem)
                            setTimeout(function(){
                                liItem.animate({
                                    opacity:1
                                },500,"swing")
                            },100)
                            lastRenderMessage[nowFromId].push(message);
                        }
                    })
                    if(this_time_render!=0){
                        $('.talk-wrap').animate({scrollTop:$('.talk-histary').height()},700);
                    }

                } else {
                    $(".talk-histary").html("")
                }
            }
        }
    }();
    var SoucheIM = function(){
        var config = {
            user_id:""
        }
        var is_offline = true;
        var dumpTimer;
        var renderChatTimer;
        return {
            init:function(_config){
                $.extend(config,_config);
                $("#talking-text").focus();
                SoucheIMData.my_userid = config.user_id;
                SoucheIMUtil.getRecentContacts(config.user_id,function(contacts){

//                    SoucheIMData.switch_active("cn_18767123511")
                    contacts.forEach(function(c){
                        SoucheIMData.addContact(c.friendId, c.unReadMsg);
                    })

                    if(config.talk_with){
                        SoucheIMData.addContact(config.talk_with,0)
                        SoucheIMData.switch_active(config.talk_with)
                        SoucheIMRender.renderContacts();
                    }
                    SoucheIMRender.renderContacts();
                    SoucheIMRender.renderChat();
                    renderChatTimer = setInterval(function(){
                        SoucheIMRender.renderChat();
                    },500)
                        var lastDumpTime = souchedb.get("souche_talk_messages_time");
                        var loadFromLocal = false;
                        if(lastDumpTime){
                            if(new Date().getTime() - lastDumpTime*1<1000*60){
                                loadFromLocal = true;

                            }else{

                            }
                        }
                        if(loadFromLocal) {
                            SoucheIMData.restoreMessages();
                        }


                    SoucheIMUtil.getLoginInfo(config.user_id.replace(/[^0-9]/g,''),function(user,pwd){
                        conn.open({
                            user : user,
                            pwd : pwd,
                            appKey : appkey
                        });
                    })

                })
                this._bind();
            },
            _bind:function(){
                $("#talk_form").on("submit",function(e){
                    e.preventDefault();
                    var content = $("#talking-text").val();
                    if(content==""){
                        alert("请输入聊天内容")
                        $("#talking-text").focus();
                        return
                    }
                    $("#talking-text").val("")
                    var carInfo  = {
                        ownerId:"18667932551",
                        brand:"本田",
                        carShortName:"2013款  歌诗图3.5-A\\/MT尊贵版京Ⅴ",
                        registerDate:"2014-01-01",
                        ID:"Kgs2WusYyg",
                        crawlSource:"0",
                        emissions:"国五",
                        price:"230000",
                        model:"2013款  歌诗图3.5-A\\/MT尊贵版京Ⅴ",
                        series:"歌诗图",
                        area:"北京 北京",
                        pictures:"http:\\/\\/cheniu.u.qiniudn.com\\/18667932551\\/9BFD626B6F6AE1A243D53EE1627FF69D\\/20141225162241"
                    }
                    var msg = {
                        to : SoucheIMData.now_chat_userid,
                        msg :content
                    }
                    var carId;
                    var matchResult = content.match(/carId=([^&]+)/);
                    if(matchResult){
                        carId = matchResult[1];
                        msg.ext =  {"content":JSON.stringify(carInfo),"messageType":"3"}
                    }
                    conn.sendTextMessage(msg);
                    SoucheIMData.addLocalMessage(msg)
                    SoucheIMUtil.sendMessage(config.user_id,SoucheIMData.now_chat_userid,content);
                })
                $(".contacts").on("click",".contact-item",function(e){
                    SoucheIMData.switch_active($(this).attr("data-id"))
                    SoucheIMRender.renderContacts();
                })
            },
            activeWindow:function(){

            },
            onOpen:function(){
                is_offline = true;

                dumpTimer = setInterval(function(){
                    SoucheIMData.dumpMessages();
                },2000)
            },
            leaveWindow:function(){
                is_offline = true;
//                clearInterval(renderChatTimer);
                clearInterval(dumpTimer);
                try{
                    window.parent.window.Souche.Sidebar.hideTalk()
                }catch(e){

                }
            }
        }
    }();

    return SoucheIM;
})
