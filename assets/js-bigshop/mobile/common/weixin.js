/**
 * Created by zilong on 2014/6/24.
 */

var isWeiXin = function() {
    var ua = navigator.userAgent.toLowerCase();
    return function () {
        return ua.indexOf("micromessenger") != -1;
    };
}
var WeiXinShare = function(title,img_url,link_url){
    link_url = link_url||window.location.href;
    try{
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.on('menu:share:timeline', function(argv){
                WeixinJSBridge.invoke('shareTimeline',{
                    "img_url":img_url,
                    "img_width":"120",
                    "img_height":"120",
                    "link":link_url,
                    "desc":title,
                    "title":title
                }, function(res){});
            });
            WeixinJSBridge.on('menu:share:appmessage', function(argv){
                WeixinJSBridge.invoke('sendAppMessage',{
                    "img_url":img_url,
                    "img_width":"120",
                    "img_height":"120",
                    "link":link_url,
                    "desc":title,
                    "title":title
                }, function(res){});
            });
        });
    }catch(e){
        console.log("not in weixin")
    }
};