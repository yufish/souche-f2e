var conn = new Easemob.im.Connection();
conn.init({
    https : false,
    //当连接成功时的回调方法
    onOpened : function() {
        console.log("open")
        conn.setPresence();
        handleOpen(conn);
    },
    //当连接关闭时的回调方法
    onClosed : function() {
        //handleClosed();
        console.log("close")
    },
    //收到文本消息时的回调方法
    onTextMessage : function(message) {
        console.log("text message")
        console.log(message)
        setTimeout(function(){
            SoucheIMData.addMessage(message.from,message.data);
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
        console.error(message)
        //handleError(message);
    }
});


var handleOpen = function(conn){
    conn.getRoster({
        success : function(roster) {
            //获取好友列表，并进行好友列表渲染，roster格式为：
            /** [
             {
                 jid:"asemoemo#chatdemoui_test1@easemob.com",
             name:"test1",
             subscription: "both"
             },
             {
                 jid:"asemoemo#chatdemoui_test2@easemob.com",
             name:"test2",
             subscription: "from"
             }
             ]
             */
            console.log(roster)
            //conn.setPresence();
        }
    });
}



var SoucheIMUtil = function(){
    var souche_token = "ScM9Eno7f2dl0vz"
    return {
        getRecentContacts:function(user_id,callback){
            $.ajax({
                url:contextPath+"/pages/app/thumbelina/messageAction/getChatList.json",
                data:{
                    token:souche_token,
                    user:user_id
                },
                dataType:"json",
                success:function(data){
                    if(data.code=="100000"){
                        callback(data.data.chatList);
                    }
                }
            })
        }
    }
}();
var SoucheIMData = function(){

    return {
        contacts:[],
        now_chat_userid:"admin",
        my_userid:"",
        messages:{},
        addContact:function(user_id){
            var is_in = false;
            var self = this;
            this.contacts.forEach(function(c,i){
                if(c.friendId==user_id){
                    is_in = true;
                    c.unReadMsg++;
                    self.contacts.unshift(self.contacts.splice(i,1)[0]);
                }
            })
            if(!is_in){
                this.contacts.unshift({
                    friendId:user_id,
                    friendName:user_id,
                    unReadMsg:1
                })
            }
            SoucheIMRender.renderContacts(this.contacts,this.now_chat_userid)
        },
        addMessage:function(from_user_id,content){
            this.addContact(from_user_id)
            if(!this.messages[from_user_id]){
                this.messages[from_user_id] = [];
            }
            var message = {
                user_id:from_user_id,
                user_name:from_user_id,
                content:content,
                time:moment().fromNow(),
                is_me:false,
                timestramp:new Date().getTime()+Math.random()
            }
            this.messages[from_user_id].push(message)
        },
        addLocalMessage:function(content){
            if(!this.messages[this.now_chat_userid]){
                this.messages[this.now_chat_userid] = [];
            }
            var message = {
                user_id:this.my_userid,
                user_name:"我",
                content:content,
                time:moment().fromNow(),
                is_me:true,
                timestramp:new Date().getTime()+Math.random()
            }
            this.messages[this.now_chat_userid].push(message)

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
    return {
        renderContacts:function () {
            $(".contact-list .contacts").html(function () {
                var html = "";
                SoucheIMData.contacts.forEach(function (c) {
                    html += "<li data-id='" + c.friendId + "'><span class='cont-name'>" + c.friendName + "</span><i class='info-num'>" + c.unReadMsg + "</i></li>"
                })
                return html;
            }())
        }
        ,
        renderChat:function () {
            var nowFromId = SoucheIMData.now_chat_userid;
            var messages = SoucheIMData.messages[nowFromId];
            var lastRenderMessage = $(".talk-histary")[0].lastMessages;
            if (!lastRenderMessage) {
                lastRenderMessage = $(".talk-histary")[0].lastMessages = [];
            }
            if (messages) {
                var html = "";
                messages.forEach(function (message) {
                    if(!checkInArray(message,lastRenderMessage)){
                        $(".talk-histary").append('<li class="' + (message.is_me ? "my" : "shop") + '-cont clearfix">' +
                            '<div class="time">' + message.time + '</div>' +
                            '<div class="figure">' + message.user_name + '</div>' +
                            '<div class="talk-content"><i class="cont-arrow"></i>' +
                            '    <p>' + message.content + '</p>' +
                            '</div>' +
                            '</li>')
                        $('.talk-wrap').animate({scrollTop:$('.talk-histary').height()},700);
                        lastRenderMessage.push(message);
                    }
                })
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
    return {
        init:function(_config){
            $.extend(config,_config);
            SoucheIMData.my_userid = config.user_id;
            SoucheIMUtil.getRecentContacts(config.user_id,function(contacts){
                contacts.push({
                    friendId:"cn_18667046361",
                    friendName:"cn_18667046361",
                    unReadMsg:1
                })
                SoucheIMData.contacts = contacts;
                SoucheIMRender.renderContacts();
                SoucheIMRender.renderChat();
                setInterval(function(){
                    SoucheIMRender.renderChat();
                },500)
                conn.open({
                    user : "cn_18667046650",
                    pwd : "123456",
                    appKey : "souche#souche"
                });
            })
            this._bind();
        },
        _bind:function(){
            $("#talk_form").on("submit",function(e){
                e.preventDefault();
                var content = $("#talking-text").val();
                SoucheIMData.addLocalMessage(content)
                $("#talking-text").val("")
                conn.sendTextMessage({
                    to : SoucheIMData.now_chat_userid,
                    msg :content
                });
            })
            $(".cont-name").on("click",".contact-list",function(e){
                SoucheIMData.now_chat_userid = $(this).attr("data-id")
            })
        }
    }
}();