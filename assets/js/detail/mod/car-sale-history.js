// 获取车辆过户历史的数据
define(['souche/util/tool'], function(Tool){
    var config = {
        // param: carId
        saleRecordUrl: contextPath + '/pages/carDetailTransferAction/transfer.json'
    };

    var _ele = {
        tabItem: $('.onsale-tab-item-history'),
        recordContent: $('#onsale_record .onsale_content')
    };

    var _view = {
        buildTransferInfo: function(data){
            var htmlStr = '';
            if( data.num >= 1 ){
                htmlStr += '<p class="record-num">共有'+data.num+'条过户记录</p>';
            }
            if( data.transferList && data.transferList.length > 0 ){
                htmlStr += '<table><tr><th>过户主体</th><th>过户时间</th><th>过户方式</th></tr>';
                for( var i=0; i<data.transferList.length; i++ ){
                    var item = data.transferList[i];
                    htmlStr += '<tr><td>'+item.nameName+'</td><td>'+item.date+'</td><td>'+item.transferTypeName+'</td></tr>'
                }
                htmlStr + '</table>';
            }
            // 有数量但是没有数据...
            else if( data.num >= 1 ){
                htmlStr += '<table class="record-none"><tr><th>过户主体</th><th>过户时间</th><th>过户方式</th></tr></table><div class="explain">注：该车登记证为补办，无详细过户记录</div>';
            }
            else{
                htmlStr += '<table class="record-none"><tr><th>过户主体</th><th>过户时间</th><th>过户方式</th></tr></table><div class="explain">注：该车上牌后第一次出售，无过户记录</div>';
            }
            return htmlStr;
        }
    };

    var _data = {
        getSaleRecord: function(carId, callback){
            var param = {
                carId: carId
            };
            $.getJSON( config.saleRecordUrl, param, callback );
        }
    }
    

    function init(_config){
        // 过户历史hidden时, 说明后端已经判定没有过户历史(或没有数据)
        if( _ele.tabItem.hasClass('hidden') ){
            return;
        }
        else{
            var urlParam = Tool.parseUrlParam();
            var carId = urlParam.carId;
            _data.getSaleRecord(carId, function(data, status){
                if(status == 'success' && data ){
                    var htmlStr = _view.buildTransferInfo(data);
                    var div = $('<div>');
                    div.html( htmlStr );
                    _ele.recordContent.append(div);
                }
                else{
                    _ele.recordContent.append( $('<h2>获取车辆过户历史的数据失败, 请刷新重试..</h2>') );
                }
            });
        }
    }

    return {
        init: init
    };
});