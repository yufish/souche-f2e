define(function(){
    var CONG_4_SELF='您真是太腻害了, 赢得红包';
    var CONG_4_OTHER='您帮$1赢得红包';

    var SUBTITLE_4_SELF = '赶快分享给身边的朋友吧， 筹集到更多红包抵车价哦。 要记得请他们吃饭哦~'
    var SUBTITLE_4_OTHER = '您可以分享给身边朋友, 帮TA筹集更多红包抵车价, 当然赶紧想想让TA请您吃什么好.'

    var shareUrl = null;

    // 所有文案
    // $1 活动url
    // $2 获得的金额
    var likeShareTitle = '大搜车#点赞分享筹红包#';
    var miaoshaShareTitle = '#大搜车0元秒新车#';
    var ADS_TEXT = {
        // 秒杀的结果
        miaosha: {
            fail: '“人固有一秒，或秒到这辆车，或秒到其他车”。别放弃！快来看看别的车，这次千万不能被别人抢走啊！',
            suc: '首先，我想感谢CCTV、感谢MTV、感谢ChannelV，还要感谢我的车迷，感谢所有支持我的人，没有你们的支持没有今天的我，这辆【$3】是属于你们的。'
        },
        // 点赞的结果
        like: {
            // 自己点赞
            // self貌似是关键字了...
            own: {
                1:"今天走了狗屎运啊！点赞筹红包就筹了1元！是朋友的就赶紧给我上啊！考验亲情友情爱情各种情的时候到了！点赞即可！",
                50: "还不错嘛！点一个赞就抵了$2元的购车红包。别嘴上说我是个好人，帮我筹红包才算数！点赞即可！",
                500: "别问我挖掘机技术哪家强！我只知道点个赞就瞬间变了$2元购车红包！快来帮我点赞筹红包吧！点赞即可！",
                3333: "好激动！动了一下手指就筹到了$2元的购车红包，同学们and老少爷们乡亲们，快快抬起你们的手指，帮我一起抢红包啊！点赞即可！",
                repeat: '天辣！目前为止我已经筹到了$2块钱的购车红包啦！大家快加把劲啊！帮我筹到红包的兄弟姐妹大爷大婶都有机会来坐我的爱车哦！点赞即可！'
            },
            // 帮别人点赞
            help: {
                1: '俗话说：1元难倒英雄汉。俗话也说：差1元买不到车的人不能叫英雄汉。帮朋友赢了1元购车红包，你们说朋友请我吃鲍鱼好还是茶叶蛋好呢？想想就有点小激动呢！想让我朋友请客的，帮忙点赞即可',
                50: '别看我平时不言不语，关键时刻给朋友点赞筹红包必须走起！$2元红包瞬间妥妥到手！你们是不是也帮我朋友一把，点赞即可！',
                500: '我人这么好我会告诉你吗？平时我就是这么默默无闻的给朋友无私奉献。瞬间帮朋友筹集了$2元的购车红包！你们也给我朋友无私奉献吧，点赞即可!',
                3333: '动了一下手指就帮朋友筹到了$2元的购车红包。怪就只怪自己平时人太帅/美、心太好，心灵又美手又巧。帅哥美女们赶快帮下我朋友，点赞即可！',
                repeat: '天辣！目前为止我朋友已经筹到了$2块钱的购车红包啦！大家快加把劲啊！帮我朋友筹到红包的兄弟姐妹大爷大婶都有机会来坐我朋友的爱车哦！点赞即可！'
            }
        }
    };
    // 部分相同的文案
    ADS_TEXT.like.own['100'] = ADS_TEXT.like.own['50'];
    ADS_TEXT.like.own['300'] = ADS_TEXT.like.own['50'];
    ADS_TEXT.like.own['1000'] = ADS_TEXT.like.own['500'];

    ADS_TEXT.like.help['100'] = ADS_TEXT.like.help['50'];
    ADS_TEXT.like.help['300'] = ADS_TEXT.like.help['50'];
    ADS_TEXT.like.help['1000'] = ADS_TEXT.like.help['500'];




    var sharePop = $('.popup.share-like');
    var Ele = {
        carImg: sharePop.find('.car-img'),
        carTitle: sharePop.find('.car-name'),
        carPrice: sharePop.find('.car-price .price-num'),
        shareText: sharePop.find('#share-text')
    };

    var  _view = {
        renderPopup: function(carBox, type, result){

            var code = result.code;

            var shareConf = {};
            // 秒杀成功分享
            if( type === 'miaosha' ){
                var shareConf = {
                    title: miaoshaShareTitle,
                    url: 'http://1113.souche.com/',
                    pic: carBox.find('.car-pic img').attr('src')
                };
                Ele.shareText = $('#share-miaosha-text');
                var shareText = ADS_TEXT.miaosha.suc.replace('$3', $.trim(carBox.find('.car-title').text()) );
                Ele.shareText.val( shareText );

                _view.configShare( shareConf );
                $('.share-miaosha').addClass('active');
            }
            // 点赞结果展示和分享
            else if(type === 'like'){
                if( code == 200 ){
                    // title 必须是设置的, 否则会使用当前页title
                    shareConf.title = likeShareTitle;
                    // url必须是设置的, 否则会指向当前页url
                    shareConf.url = result.shareUrl;
                    
                    var text='';
                    var money = result.money || 0;
                    $('.popup.share-like .money-num').html(money);
                    // 自己点赞的文案
                    $('.share-congrate').text( CONG_4_SELF );
                    $('.share-encourage').text(SUBTITLE_4_SELF);
                    text = ADS_TEXT.like.own[money].replace('$2', money);
                    Ele.shareText.val( text );
                    _view.renderCommon(carBox, shareConf);
                }
                else if(code == 202){
                    shareConf.title = likeShareTitle;
                    shareConf.url = result.shareUrl;

                    var money = result.money;
                    
                    var text = ADS_TEXT.like.own.repeat.replace('$2', money);
                    Ele.shareText = $('#share-repeat-text');
                    Ele.shareText.val( text );
                    $('.share-repeat .pop-subtitle').text('想筹集更多红包就去召唤小伙伴吧！');


                    _view.configShare(shareConf);
                    $('.share-repeat').addClass('active');
                }
                
            }
            else if( type == 'help-like'){
                if( code == 200 ){
                    shareConf.title = likeShareTitle;
                    // 直接从页面里拿url
                    shareConf.url = window.location.href;
                    var text='';
                    var money = result.money || 0;
                    $('.popup.share-like .money-num').html(money);
                    var other = carBox.find('.who-asked').text();
                    $('.share-congrate').text(CONG_4_OTHER.replace('$1', other || 'TA'));
                    $('.share-encourage').text(SUBTITLE_4_OTHER);
                    text = ADS_TEXT.like.help[money].replace('$2', money);
                    Ele.shareText.val( text );

                    _view.renderCommon(carBox, shareConf);
                }
                else if(code == 202){
                    shareConf.title = likeShareTitle;
                    shareConf.url = window.location.href;
                    
                    var money = result.money;

                    var text = ADS_TEXT.like.help.repeat.replace('$2', money);
                    Ele.shareText = $('#share-repeat-text');
                    Ele.shareText.val( text );
                    $('.share-repeat .pop-subtitle').text('您对朋友真是太热心了，您可以继续分享帮TA筹红包！');


                    _view.configShare(shareConf);
                    $('.share-repeat').addClass('active');
                }
            }

            
        },
        renderCommon: function(carBox, shareConf){
            // get and fill
            var car = {
                img: carBox.find('.car-pic img').attr('src'),
                title: $.trim(carBox.find('.car-title').text()),
                link: carBox.find('.car-title').attr('href'),
                price: $.trim(carBox.find('.price .price-num').text())
            };
            Ele.carImg.attr('src', car.img);
            Ele.carTitle.text(car.title);
            Ele.carTitle.attr('href', car.link);
            Ele.carPrice.text(car.price);

            // 配置一遍分享内容
            _view.configShare(shareConf);
            sharePop.addClass('active');
        },
        configShare: function(shareConf){
            window.jiathis_config = $.extend({
                summary: Ele.shareText.val(),
                // banner图片
                pic: 'http://assets.souche.com/assets/images/double11/share-pic.png'
            }, shareConf);
        }
    };

    var _event = {
        bind: function(){
            $('.popup .pop-close').on('click', _event.closePop);
            $('.share-miaosha').find('.pop-close').on('click', _event.closePop);
            // 用户自己修改文案后再更新一遍summary
            $('#share-miaosha-text, #share-text, #share-repeat-text').on('blur', function(){
                window.jiathis_config.summary = Ele.shareText.val();
            });
        },
        closePop: function(){
            var popUp = $(this).parents('.popup');
            popUp.removeClass('active');
        }
    };

    function init(){
        _event.bind();
    }

    function popup( carCtn, type, result ){
        _view.renderPopup(carCtn, type, result);
    }

    return {
        init: init,
        popup: popup
    };
})