var Index = (function() {
    var _config = {};

    function searchActive() {
        $('.search-box').css({
            display: 'block'
        });
        $('.search-icon').css({
            display: 'none'
        });
        $('.search-icon-2').css({
            display: 'block'
        });
        $('#keyword').focus();
    }

    function searchHidden() {
        $('.search-box').css({
            display: 'none'
        });
        $('.search-icon').css({
            display: 'block'
        });
        $('.search-icon-2').css({
            display: 'none'
        });
    }
    return {
        init: function(config) {
            for (var i in config) {
                _config[i] = config[i];
            }

            $('.search-icon').click(function(e) {
                searchActive();
            })
            $('.search-icon-2').click(function(e) {
                searchHidden();
            });
            $('.cancel-icon').click(function(e) {
                $('#keyword').val('');
                $('#keyword').focus();
            })
            $('#search-form').submit(function(e) {
                if ($('#keyword').val().trim() == '') {
                    searchHidden();
                    e.preventDefault();
                }
            });
            $('#search-btn').click(function(e) {
                if ($('#keyword').val().trim() == '') {
                    $('keyword').val('');
                } else {
                    $('#search-form').submit();
                }
            });

            $('.back-icon').click(function() {
                if (document.referrer.indexOf("souche") != -1) {
                    history.back();
                } else {
                    window.location.href = 'index.html';
                }
            })
            $('#first-row .slides img').click(function() {
                window.location.href = 'carcustom.html';
            });

            $('#first-row').flexslider({
                animation: "slide",
                useCSS: false,
                animationLoop: false,
                slideshowSpeed: 2000,

            })
            $('.flex-next').parent().css({
                right: 0
            });
            $('#first-row .flex-direction-nav li').click(function(e) {
                if (e.target == this) {
                    $(this).find('a').trigger('click');
                }
            })

            $('#go-carcustom').click(function() {
                window.location.href = 'carcustom.html';
            })

            $('.box-bg').on('touchstart', function() {
                var touched = true;
                var $self = $(this);
                $self.one('touchend', function() {
                    touched = false;
                    $self.removeClass('scale');
                })
                setTimeout(function() {
                    if (touched) {
                        $self.addClass('scale');
                    }
                }, 300)
            })


            $(document).ready(function() {
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
                CookieUtil.init();
                if (CookieUtil.getCookie('main-screen') == '1') {
                    return;
                }
                document.cookie = 'main-screen=1'

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

                $('#to-main-screen .close').click(function() {
                    $('#to-main-screen').hide();
                })
            })

        },

    }

})();