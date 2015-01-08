define(function(){
    /**
     * 消息队列，主要是用于未连接成功的时候承载，链接成功后再开始发送，提高体验。
     */
    var SoucheMessageQueue = function(){
        var queue = [];
        return {
            /**
             * 启动发送，在连接成功后调用
             * @param conn
             */
            begin:function(conn){
                setInterval(function(){
                    if(!queue.length) return;
                    queue.forEach(function(msg){
                        conn.sendTextMessage(msg);
                    })
                    queue = [];
                },500)
            },
            /**
             * 添加消息，任何时候可以调用
             * @param msg
             */
            putMessage:function(msg){
                queue.push(msg);
            }
        }
    }();
    return SoucheMessageQueue;
})