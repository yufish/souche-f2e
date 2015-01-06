var ytNews = function () {
    console.log('ytNews start');

    var config = {
        news_api: '',
        lock: false,
        page: 1,
        pageSize: 2
    }

    return {
        init: function (_config) {
            console.log('ytNews init');
            config.news_api = _config.news_api? _config.news_api: 'test.json';
            config.page = _config.firstPage? _config.firstPage: 1;
            config.pageSize = _config.pageSize? _config.pageSize: 2;
            config.item_url = _config.item_url? _config.item_url: 'http://f2e.souche.com/demo/chunyan/yt.news';

            this._create();
            this._bind();
        },

        _create: function () {
            console.log('ytNews _create');
        },

        _bind: function () {
            console.log('ytNews _bind');
            $(function() {
                $('#news-more').click(function (e) {
                    getJson();
                    return false;
                });
            })

            function getJson () {
                if (config.lock == false) {
                    config.lock = true;
                    $.getJSON(config.news_api, {page: config.page + 1, pageSize: config.pageSize}, function(json, textStatus) {
                        /*optional stuff to do after success */
                        if (json.msg == 'ok') {
                            var s = '';
                            for (var i in json.items) {
                                s += '<a class="news-wrapper" href="' + config.item_url + '?id=' + json.items[i].id + '">'
                                    +   '<div class="news-img"><img src="' + json.items[i].image + '"></div>'
                                    +   '<div class="news-body">'
                                    +       '<h4 class="news-title">' + json.items[i].title + '</h4>'
                                    +       '<p class="news-sub">' + json.items[i].subtitle + '</p>'
                                    +   '</div>'
                                    + '</a>'
                            }
                            var $s = $(s);
                            $('#news-mod').append($s);
                            config.page++;
                            config.lock = false;
                            // $s.find('.news-sub').dotdotdot();
                            // $s.find('.news-title').dotdotdot();
                        }
                    });
                }
            }
        }
    }
}