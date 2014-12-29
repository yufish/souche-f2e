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
        console.log(message)
    },
    //收到表情消息时的回调方法
    onEmotionMessage : function(message) {
        console.log(message)
        //handleEmotion(message);
    },
    //收到图片消息时的回调方法
    onPictureMessage : function(message) {
        console.log(message)
        //handlePictureMessage(message);
    },
    //收到音频消息的回调方法
    onAudioMessage : function(message) {
        console.log(message)
        //handleAudioMessage(message);
    },
    onLocationMessage : function(message) {
        console.log(message)
        //handleLocationMessage(message);
    },
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
conn.open({
    user : "buyer_18667046650",
    pwd : "ShiningChan@souche!thumbelina#",
    //连接时提供appkey
    appKey : "souche#souchetest"
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
        },
    });
}


var SoucheIM = function(){
    var souche_token = "ScM9Eno7f2dl0vz"
    return {
        getRecentContacts:function(user_id){
            $.ajax({
                url:contextPath+"/pages/app/thumbelina/messageAction/getChatList.json",
                data:{
                    token:souche_token,
                    user:user_id
                },
                dataType:"json",
                success:function(data){

                }
            })
        }
    }
}();