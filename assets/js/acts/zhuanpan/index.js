define(['acts/zhuanpan/zhuanpan'], function(zhuanpan) {
    var _config = null;
    var phoneReg = /^1[34578][0-9]{9}$/;
    var LTE_IE9_REG = /MSIE\ [6789].0/i;

    // 版本 >= 9 的IE  不支持transition, 用flash代替
    var isLowIE = LTE_IE9_REG.test(navigator.userAgent);
    if (isLowIE) {
        $('.zhuanpan-popup .close').addClass('hidden');
    }
    // 开始转: 显示flash ele
    // 弹出结果提示: hide flash


    var _view = {
        readyPop: function() {
            $('.mask').removeClass('hidden');
            $('.zhuanpan-popup').removeClass('hidden');
        },
        readyHide: function() {
            $('.mask').addClass('hidden');
            $('.zhuanpan-popup').addClass('hidden');
        }

    };
    var _data = {
        getPrize: function(cb) {
            $.getJSON(_config.getPrize, cb);
        }
    };
    var prizeGot = false;

    var _event = {
        bind: function() {
            $('#start-turn').on('click', _event.startHandler);
            $('.zhuanpan-popup .close').on('click', _event.closePop);
            $('#zhuanpan-form').on('submit', _event.checkPhone);
        },
        closePop: function() {
            _view.readyHide();
            $('.wrong').addClass('hidden');
            $('.zhongjiang').addClass('hidden');
            $('.choujiang').addClass('hidden');
            $('#flash-ctn').addClass('hidden');
        },
        startHandler: function() {
            _view.readyPop();
            if (prizeGot) {
                $('.wrong').removeClass('hidden');
                return;
            }
            $('.choujiang').removeClass('hidden');
        },
        checkPhone: function(e) {
            e.preventDefault();
            var phone = $.trim($('#zhuanpan-phone').val());
            if (phoneReg.test(phone)) {
                Souche.PhoneRegister(phone, _event.goGet);
            } else {
                alert('请填写正确的手机号码');
            }
            return;
        },
        goGet: function() {
            prizeGot = true;
            _event.closePop();
            if (isLowIE) {
                // 显示flash
                $('#flash-ctn').removeClass('hidden');
            } else {
                zhuanpan.reset();
            }

            _data.getPrize(function(data, status) {

                if (status === 'success') {
                    // test & dev
                    // data.code = 200;
                    // data.prize = zhuanpan.randomPrize();

                    if (data.code == 401) {
                        // 提示重复抽奖
                        $('#flash-ctn').addClass('hidden');
                        _view.readyPop();
                        $('.wrong').removeClass('hidden');
                    } else if (data.prize > 0 && data.prize <= 5) {
                        var prizeText = '';
                        $('#prize-text').text(zhuanConfig.angles[data.prize].name);
                        var time = 0;
                        if (isLowIE) {
                            time = 1500;
                        } else {
                            time = zhuanpan.startZhuan(data.prize);
                        }
                        setTimeout(function() {
                            $('#flash-ctn').addClass('hidden');
                            _view.readyPop();
                            $('.zhongjiang').removeClass('hidden');
                        }, time + 1000);
                    }
                }
            })
        }

    };

    var zhuanConfig = {
        _class: {
            pointer: 'pointer',
            table: 'table'
        },
        angles: {
            // 大虫
            4: {
                name: '"大虫"挂件',
                start: 0,
                end: 72
            },
            // 奖金
            5: {
                name: '500元现金大奖',
                start: 72,
                end: 144
            },
            // 急救包
            1: {
                name: '车载多功能应急救援包',
                start: 144,
                end: 216
            },
            // 公仔
            2: {
                name: '夜来喵公仔',
                start: 216,
                end: 288
            },
            // 竹炭
            3: {
                name: '汽车竹炭玩具',
                start: 288,
                end: 360
            }
        }
    };

    function init(config) {
        _config = config;
        zhuanpan.init(zhuanConfig);

        _event.bind();
    }

    return {
        init: init
    };
});