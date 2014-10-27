
// ------------ some config ------------
var baseUrl= 'http://115.29.10.121:10086/soucheweb/pages/app/thumbelina/messageAction/';

var api = {
    sendMsg: baseUrl + 'send.json',
    getMsg: baseUrl + 'receive.json',
    getChatList: baseUrl + 'getChatList.json',
    deleteChat: baseUrl + 'deleteChat.json'
};


module.exports = api;