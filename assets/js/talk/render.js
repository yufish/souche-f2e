define(['talk/util','talk/data'],function(SoucheIMUtil,SoucheIMData){
    /**
     * 渲染界面
     */
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
            /**
             * 清空聊天界面，重新渲染
             */
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
                                html +='<div style="width:400px;"><a target="_blank" href="http://www.souche.com/pages/choosecarpage/choose-car-detail.html?carId='+carInfo.ID+'">'+message.content+'</a>'+
                                    '<div class="car-box clearfix"><a class="car-img clearfix" target="_blank" href="http://www.souche.com/pages/choosecarpage/choose-car-detail.html?carId='+carInfo.ID+'"><img src="'+carInfo.pictures+'"></a>'+
                                    '<div class="car-info">'+
                                    '<div class="car-title"><a target="_blank" href="http://www.souche.com/pages/choosecarpage/choose-car-detail.html?carId='+carInfo.ID+'">'+carInfo.model+'</a></div>'+
                                    '<div class="car-price"><span>价格：</span><em>￥'+(carInfo.price/10000).toFixed(2)+'万</em></div>'+
                                    '<div class="car-time"><span>上牌：</span><span>'+carInfo.registerDate+'</span></div>'+
                                    '<div class="car-area"><span>所属地：</span><span>'+carInfo.area+'</span></div>'+
                                    '</div>'+
                                    '</div></div>'
                            }else if(message.ext&&message.ext.messageType==2){
                                console.log(message)
                                html +='    <p><img src="' + message.img + '"/></p>'
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
    return SoucheIMRender;
})