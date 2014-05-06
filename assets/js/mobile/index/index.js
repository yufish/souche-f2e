define(['mobile/common/checkUserLocal', 'mobile/common/header-index', 'mobile/lib/jquery.flexslider-min'], function (checkUserLocal, hIndex) {
    return {
        init: function (config) {
            hIndex.init();

            var phoneNum = checkUserLocal().phoneNum
            if (phoneNum) {
                $('#footer-user').removeClass('hidden').find('.username').text(phoneNum);
            }

            function showLogin() {
                var winW = $(window).width();
                var $popup = $('#login-popup');
                var scrollTop = $(window).scrollTop();
                $popup.removeClass('hidden').css({
                    left: (winW - $popup.width()) / 2,
                    top: scrollTop + 50
                })
            }

            function flexInit() {
                $('.flex-wrapper').css({
                    height: 'auto'
                })
                var flexslider = $('.flexslider').flexslider({
                    animation: "slide",
                    useCSS: false,
                    animationLoop: false,
                    slideshowSpeed: 2000,
                });
                $('.flex-next').parent().css({
                    right: 0
                });
                $('#first-row .flex-direction-nav li:first-child').click(function (e) {
                    e.stopPropagation();
                    flexslider.flexslider('prev');
                })
                $('#first-row .flex-direction-nav li:nth-child(2)').click(function (e) {
                    e.stopPropagation();
                    flexslider.flexslider('next');
                })

                $('#first-row .flex-wrapper').click(function () {
                    window.location.href = 'carcustom.html';
                })
            }

            if (!config.isLogin) {
                flexInit();
            }


            var flexHasInit = false;
            $('#first-row').on('click', '.page-corner', function () {
                var $self = $(this);
                $('.for-carcustom').fadeOut(function () {
                    if (flexHasInit) {
                        $('.flex-wrapper').show();
                    } else {
                        flexInit();
                        flexHasInit = true;
                    }
                    $self.addClass('back');
                });
            })
            $('#first-row').on('click', '.page-corner.back', function () {
                var $self = $(this);
                $self.removeClass('back');
                $('.flex-wrapper').fadeOut(function () {
                    $('.for-carcustom').show();
                });
            })

            ! function () {
                var $images = $('.for-carcustom .img-wrapper')
                var length = $images.length;
                var imgIndex = 0;
                var $rArr = $('.right-arrow'),
                    $lArr = $('.left-arrow');
                var duringClick = false;
                $rArr.click(function () {
                    if (duringClick) return;
                    duringClick = true;
                    $images.eq(imgIndex).fadeOut(function () {
                        imgIndex++
                        $images.eq(imgIndex).fadeIn();
                        checkArrow(imgIndex);
                        duringClick = false;
                    });
                });
                $lArr.click(function () {
                    if (duringClick) return;
                    duringClick = true;
                    $images.eq(imgIndex).fadeOut(function () {
                        imgIndex--;
                        $images.eq(imgIndex).fadeIn();
                        checkArrow(imgIndex);
                        duringClick = false;
                    });

                });

                function checkArrow(index) {
                    $lArr.show();
                    $rArr.show();
                    if (index == 0) $lArr.hide();
                    if (index == length - 1) $rArr.hide();
                }

                checkArrow(0);
            }();

            $('.box-bg').on('touchstart', function () {
                var touched = true;
                var $self = $(this);
                $self.one('touchend', function () {
                    touched = false;
                    $self.removeClass('scale');
                })
                setTimeout(function () {
                    if (touched) {
                        $self.addClass('scale');
                    }
                }, 300)
            })

            ! function () {
                var appleDevices = 'iphone ipad'.split(' ');
                var agent = navigator.userAgent.toLowerCase();
                if (agent.indexOf('micromessenger') !== -1) {
                    return;
                }
                var isApple = false;
                for (var i in appleDevices) {
                    if (agent.indexOf(appleDevices[i]) !== -1) {
                        isApple = true;
                        break;
                    }
                }
                if (!isApple) return;
                if (agent.indexOf('safari') == -1) {
                    return;
                }
                if (CookieUtil.getCookie('main-screen') == '1') {
                    return;
                }
                var _date = new Date();　　
                _date.setDate(_date.getDate() + 3650);　　
                _date.toGMTString();
                document.cookie = 'main-screen=1;expires=' + _date.toGMTString();

                $('head title').text('大搜车');
                var winWidth = $(window).width();
                var mainWidth = $('#to-main-screen').width();
                $('#to-main-screen')
                    .css({
                        left: (winWidth - mainWidth) / 2
                    })
                    .show();
                $('#to-main-screen .arrow-down').css({
                    left: (mainWidth - 10) / 2
                });

                $('#to-main-screen .close').click(function () {
                    $('#to-main-screen').hide();
                })
            }()

        }
    }
});