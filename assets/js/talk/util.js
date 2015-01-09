define(function(){
    /**
     * 工具类，主要是对网络操作，获取一些信息等
     */
    var SoucheIMUtil = function(){
        var souche_token = "ScM9Eno7f2dl0vz"
        var username_cache = {

        }
        return {
            /**
             * 获取历史聊天记录
             * @param user_id
             * @param friend_id
             * @param callback
             */
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
                        id:user_id.replace(/buyer_|cn_|cheniu_/g,'')
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
            },
            /**
             * 获取车辆基本信息
             * @param carId
             * @param callback
             */
            getCarInfo:function(carId,callback){
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
                $.ajax({
                    url:contextPath+"/pages/carAction/getCar.json",
                    dataType:"json",
                    data:{
                        carId:carId
                    },
                    success:function(data){

                        data.item.ID = carId;
                        data.item.carShortName = data.item.model;
                        data.item.price = data.item.price*10000;

                        callback(data.item)
                    }
                })
            }
        }
    }();
    return SoucheIMUtil;
})