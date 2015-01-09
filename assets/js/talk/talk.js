define([
    'talk/render',
    'talk/util',
    'talk/data',
    'talk/queue',
    'souche/util/sc-db',
    'lib/moment'
],function(
    SoucheIMRender,
    SoucheIMUtil,
    SoucheIMData,
    SoucheIMQueue,
    DB,
    Moment){
    var souchedb = new DB("souche");
    var appkey = "souche#souchetest";
    var conn = new Easemob.im.Connection();
    var state_connected = false;
    //黑名单，这些消息网站端不予处理
    var blackList = [ 'thumb_pushuser',  'thumb_deallist'   , 'thumbelina_dasouche']
    $("#talking-text").attr("placeholder","正在连接聊天服务器，请稍候")
    conn.init({
        https : false,
        //当连接成功时的回调方法
        onOpened : function() {
            state_connected = true;
            console.log("open")
            $("#talking-text").attr("placeholder","连接成功，开始聊天吧")
            conn.setPresence();
            SoucheIM.onOpen();
        },
        //当连接关闭时的回调方法
        onClosed : function() {
            console.log("close")
            state_connected = false;
            $("#talking-text").attr("placeholder","聊天结束，连接关闭")
            SoucheIM.onClose();
        },
        //收到文本消息时的回调方法
        onTextMessage : function(message) {
            console.log("text message")
            message.content = message.data;
            if(blackList.indexOf(message.from)!=-1) return;
            console.log(message)
            setTimeout(function(){
                SoucheIMData.addMessage(message,function(){
                    SoucheIMRender.renderContacts();
                });
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

    /**
     * IM主入口
     */
    var SoucheIM = function(){
        var config = {
            user_id:""
        }
        //记录是否已经从线上加载过聊天记录，第一次才调用。
        var hasLoadOnline = {}
        //备份的timer，如果断线，会停止备份
        var dumpTimer;
        //渲染聊天窗口的timer
        var renderChatTimer;
        return {
            init:function(_config){
                var self = this;
                $.extend(config,_config);
                $("#talking-text").focus();
                SoucheIMData.my_userid = config.user_id;

                //获取最近联系人列表
                SoucheIMUtil.getRecentContacts(config.user_id,function(contacts){
                    contacts.forEach(function(c){
                        SoucheIMData.addContact(c.friendId, c.unReadMsg,function(){
                            SoucheIMRender.renderContacts();
                        });
                    })
                    //如果默认指定了聊天对象，启动跟他的聊天
                    if(config.talk_with){
                        SoucheIMData.addContact(config.talk_with,0,function(){
                            SoucheIMRender.renderContacts()
                        })
                        self._switch_active(config.talk_with)
                        SoucheIMRender.renderContacts();
                    }
                    //如果默认指定了一个url，则发送此url
                    if(config.url){
                        self._send(config.url)
                    }
                    SoucheIMRender.renderContacts();
                    SoucheIMRender.renderChat();
                    //渲染聊天窗口
                    renderChatTimer = setInterval(function(){
                        SoucheIMRender.renderChat();
                    },500)
                    //去获取环信用户信息，然后开始链接环信
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
            /**
             * 绑定事件
             * @private
             */
            _bind:function(){
                var self = this;
                //提交消息
                $("#talk_form").on("submit",function(e){
                    e.preventDefault();
                    self._send($("#talking-text").val())
                })
                //切换联系人
                $(".contacts").on("click",".contact-item",function(e){
                    var id = $(this).attr("data-id");
                    if(id!=SoucheIMData.now_chat_userid){
                        self._switch_active(id)
                        SoucheIMRender.renderContacts();
                    }
                })
            },
            /**
             * 发送一条内容，最顶层的入口，就是提交表单的动作，可手动触发
             * @param content
             * @private
             */
            _send:function(content){
                if(content==""){
                    alert("请输入聊天内容")
                    $("#talking-text").focus();
                    return
                }

                $("#talking-text").val("")

                var msg = {
                    to : SoucheIMData.now_chat_userid,
                    msg :content
                }
                var carId;
                var matchResult = content.match(/carId=([^&]+)/);
                if(matchResult){
                    //如果包含有detail的url，则发送一辆车的信息出去
                    carId = matchResult[1];
                    SoucheIMUtil.getCarInfo(carId,function(carInfo){
                        msg.ext =  {"content":JSON.stringify(carInfo),"messageType":"3"}
                        SoucheIMQueue.putMessage(msg);
                        SoucheIMData.addLocalMessage(msg)
                        SoucheIMUtil.sendMessage(config.user_id,SoucheIMData.now_chat_userid,content);
                    })
                }else{
                    SoucheIMQueue.putMessage(msg);
                    SoucheIMData.addLocalMessage(msg)
                    SoucheIMUtil.sendMessage(config.user_id,SoucheIMData.now_chat_userid,content);
                }
            },
            /**
             * 切换当前正在聊天的联系人，如果是第一次切换到，则恢复聊天记录
             * 恢复聊天记录，是判断上次的dump时间，如果大于1分钟，则从线上恢复，否则恢复本地数据。
             * @param user_id
             * @private
             */
            _switch_active:function(user_id){
                SoucheIMData.now_chat_userid = user_id;
                SoucheIMData.contacts.forEach(function(c){
                    if(c.friendId==user_id){
                        c.unReadMsg = 0;
                    }
                })
                SoucheIMRender.clearChatView();
                if(!hasLoadOnline[SoucheIMData.now_chat_userid]){
                    var lastDumpTime = souchedb.get("souche_talk_messages_time_"+config.user_id+"_to_"+SoucheIMData.now_chat_userid);
                    var loadFromLocal = false;
                    if(lastDumpTime){
                        if(new Date().getTime() - lastDumpTime*1<3000){
                            loadFromLocal = true;
                        }else{

                        }
                    }
                    if(loadFromLocal){
                        SoucheIMData.restoreMessages(config.user_id,SoucheIMData.now_chat_userid);
                    }else{
                        SoucheIMData.restoreMessageFromOnline(config.user_id,SoucheIMData.now_chat_userid)
                    }
                    hasLoadOnline[SoucheIMData.now_chat_userid] = true;
                }

            },
            onOpen:function(){
                dumpTimer = setInterval(function(){
                    SoucheIMData.dumpMessages();
                },2000)
                SoucheIMQueue.begin(conn);
            },
            onClose:function(){
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
