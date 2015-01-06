$(function () {
    var lock = false;
    var page = 1;
    // $('.news-wrapper .news-body .news-sub').dotdotdot();
    // $('.news-wrapper .news-body .news-title').dotdotdot();

    $('#news-more').click(function (e) {
        if (lock == false) {
            lock = true;
            $.getJSON(
                // 'http://115.29.10.121:12080/json/news/list.json',
                'test.json',
                {page: page+1, pageSize: 2}, function(json, textStatus) {
                /*optional stuff to do after success */
                if (json.msg == 'ok') {
                    var s = '';
                    for (var i in json.items) {
                        s += '<a class="news-wrapper" href="http://f2e.souche.com/demo/chunyan/yt.news?id=' + json.items[i].id + '">'
                            +   '<div class="news-img"><img src="' + json.items[i].image + '"></div>'
                            +   '<div class="news-body">'
                            +       '<h4 class="news-title">' + json.items[i].title + '</h4>'
                            +       '<p class="news-sub">' + json.items[i].subtitle + '</p>'
                            +   '</div>'
                            + '</a>'
                    }
                    var $s = $(s);
                    $('#news-mod').append($s);
                    page++;
                    lock = false;
                    // $s.find('.news-sub').dotdotdot();
                    // $s.find('.news-title').dotdotdot();
                }
            });
        }
        return false;
    });
});