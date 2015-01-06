$(function () {
  $('.news-wrapper .news-body .news-sub').dotdotdot();
  $('.news-wrapper .news-body .news-title').dotdotdot();

  $('#news-more').click(function (e) {
    $.getJSON('http://t.com/souche/index.php', {param1: 'value1'}, function(json, textStatus) {
        /*optional stuff to do after success */
        var s = '';
        for (var i in json) {
        	s += '<a class="news-wrapper">'
          		+ 	'<div class="news-img"><img src="http://img.souche.com/files/default/C649CDC11D50226618591EA9163BB9D8_60x60.jpg"></div>'
          		+ 	'<div class="news-body">'
            	+ 		'<h4 class="news-title">' + json[i].b + '</h4>'
            	+ 		'<p class="news-sub">一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九</p>'
          		+ 	'</div>'
          		+ '</a>'
        }
        var $s = $(s);
        $('#news-mod').append($s);
        $s.find('.news-sub').dotdotdot();
        $s.find('.news-title').dotdotdot();
    });
    return false;
  });
});