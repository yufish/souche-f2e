// 简单的滑块实现
;(function($, window) {

  var maxItem = $('[data-index]').length;

  var action = {
    moveTop: function() {
      if ($(this).data('index') == maxItem) return null;

      // 第六张跳过下一步
      if ($(this).attr('data-skip') === 'true') {
        action.goto(8);
        return;
      }
      $(this).removeClass().addClass('slide-top');
      $(this).next().removeClass().addClass('slide-active');
      action.displayBtn();
    },
    moveDown: function() {
      if ($(this).data('index') == 1) return null;
      $(this).removeClass().addClass('slide-bottom');
      $(this).prev().removeClass().addClass('slide-active');
      action.displayBtn();
    },
    move: function(e) {
      e.preventDefault();
      var $active = $('.slide-active');
      if ($active.data('index') == maxItem) return null;
      // 第六张跳过下一步
      if ($active.attr('data-skip') === 'true') {
        action.goto(8);
        return;
      }
      $active.removeClass().addClass('slide-top');
      $active.next().removeClass().addClass('slide-active');
      action.displayBtn();
    },
    displayBtn: function() {
      if ($('.slide-active').data('index') == maxItem) {
        $('#next').addClass('hidden');
      } else {
        $('#next').removeClass('hidden');
      }
    },
    init: function(current) {
      var $item = $('[data-index]');
      $item.filter(function(index) {
        return index > current;
      }).removeClass().addClass('slide-bt');
      $item.filter(function(index) {
        return index < current;
      }).removeClass().addClass('slide-t');
      action.displayBtn();
    },
    goto: function(num) {
      var $currentItem = $('.slide-active');
      var current = $currentItem.data('index');
      if (current == num) return null;
      $('[data-index]').eq(num - 1).removeClass().addClass('slide-active');
      action.init(num - 1);
      if (num < current) {
        $currentItem.removeClass().addClass('slide-bottom');
      } else {
        $currentItem.removeClass().addClass('slide-top');
      }
    }
  }

  $('#next').on('click', action.move);

    
  $('[data-index]').swipeDown(action.moveDown).swipeUp(action.moveTop);
    
  //- setTimeout(function() {
  //-   if (window.history && history.pushState) {
  //-     history.pushState(null, "", "slide?lan=en");
  //-   }
  //- }, 2000)

  $('#jump-btn').on('click', function(e) {
    e.preventDefault();
    var num = $(this).attr('data-num');
    if (num === "0") {
      $('#popup').html('').removeClass('hidden');
      setTimeout(function() {
        $('#popup').addClass('hidden');
      }, 1000)
    }
    if (num === "1") {
      action.goto(7);
      $('.section-form').removeClass('hidden');
      $('.section-result').addClass('hidden');
    }
  });

  $('.speaker').on('click', function(e) {
    e.preventDefault();
    var $audio = $('#audio');
    if ($audio.hasClass('playing')) {
      $audio.toggleClass('playing');
      document.getElementById('audio').pause();
      $(this).removeClass('playaround');
    } else {
      $audio.toggleClass('playing');
      document.getElementById('audio').play();
      $(this).addClass('playaround');
    }
  });


})(jQuery, window);

;(function() {
  
  // 选品牌 ＋ 车型
  require(['mobile/index/brand2'], function (Brand){
  
    $('#slide-brand').on('click', function() {
      $('#brand').removeClass('hidden');
      Brand.init();

      function brandInfo(b, bn, s, sn) {
        $('#slide-brand').attr('data-brand', b).attr('data-series', s)
              .text(bn + ' ' + sn);
        $('#slide-model').removeClass('no-active');
        $('#car-models').empty();

        var modelUrl = contextPath + '/pages/dicAction/loadNextLevel.json?type=car-subdivision';

        $.getJSON(modelUrl, { code: s }, function(data) {
          var obj = {};
          var data = data.items;
          for (var i = 0, len = data.length; i < len; i ++) {
            var t = data[i].name.slice(0,4);
            var d = data[i].name.trim();
            var c = data[i].code;
            if (!obj[t]) {
              obj[t] = [];
            }
            obj[t].push({title: d, code: c});
          }
          createModel(obj);
        });

        // 车型弹窗
        function createModel(obj) {
          $('#car-models').empty();
          var str = '';
          for (var p in obj) {
            // str += '<div class="item"><h4>' + p + '</h4>';
            str += '<div class="item">';
            for (var i = 0, arr = obj[p], len = arr.length; i < len; i ++) {
              str += '<li data-code="' +  arr[i].code + '">' +  arr[i].title + '<span class="left-arrow"></span></li>'
            }
            str += '</div>'
          }
          $('#car-models').append(str);
        }

      }

      Brand.bind(brandInfo);
    });

    // 年月
    function createDate(y) {
      var n = new Date().getFullYear();
      var $form = $('#slide-form');
      var $year = $form.find('#slide-time');
      var year = '';

      year += '<option value=""></option>'

      for (var j = y; j < n + 1; j ++) {
        year += '<option value="' + j + '">' + j + '</option>';
      }

      $year.html(year);
    }
    
    $('#slide-model').on('click', function() {
      if ($(this).hasClass('no-active')) return;
      $('#car-models').removeClass('hidden');

      $('#car-models').on('click', '.item li', function() {
          if ($(this).hasClass('no-active')) return;
          $('#car-models .item li').removeClass('active');
          $(this).addClass('active');
          $('#slide-model').attr('data-code', $(this).attr('data-code'));
          $('#slide-model').text($(this).text())
          setTimeout(function() {
              $('#car-models').addClass('hidden');
          }, 500);
          var y = parseInt($(this).text()) - 1;
          createDate(y);
      })
    });

    $('#slide-btn').on('click', function(e) {
      e.preventDefault();

      if (!$('#slide-brand').attr('data-brand') || !$('#slide-model').attr('data-code')
          || $('#slide-time').val() == '' || $('#slide-mile').val() == '') {
        
        $('#popup').html('<div class="content"><p>爱车信息缺失</p><p>你真的有诚意为TA点赞吗？</p><a id="slide-back" class="btn">补充爱车信息</a></div>')
            .removeClass('hidden');
        return;
      }

      var mileStr = $("#slide-mile").val();
      var mileNum = Number(mileStr);
      // 判断是否为NaN
      if((Boolean(mileNum) == false && mileNum !=0) || mileNum < 0 || mileStr == '' ){
        $('#popup').html('<div class="content"><p>请正确填写车辆行驶里程</p><a id="slide-back" class="btn">补充爱车信息</a></div>')
            .removeClass('hidden');
        return;
      }

      var brand = $('#slide-brand').text();
      var arr = brand.split(' ');

      var obj = {
        brand: arr[0],
        series: arr[1],
        model: $('#slide-model').text(),
        year: $('#slide-time').val(),
        mileage: $('#slide-mile').val()
        // openId: "mizhengdi"
        // brand_code: $('#slide-brand').attr('data-brand'),
        // series_code: $('#slide-brand').attr('data-series'),
        // model_code: $('#slide-model').attr('data-code')
      }

      $.ajax({
        url: contextPath + '/pages/acts/mobile/warmDiffuseAction/evaluate.json',
        data: obj,
        // dataType: json,
        success: function(data) {
          data = JSON.parse(data);
          if (data) {
            if (data.code == '200') {
              var car = data.operateUserInfo;
              $('.section-form').addClass('hidden');
              var year = new Date().getFullYear() - car.regDate;
              $('.section-result').html('<div class="text diff"><p class="mb10">我拥有了自己的' +
                  car.brand + ' ' + car.series + '</p><p>' + car.mileage + '万公里的车轮印迹 </p><p>也见证了' + 
                  year + '年来 </p><p>汽车带来的幸福记忆… </p></div>')
                .removeClass('hidden');
              $('#form-result').html('<p>TA已为我的家庭奉献了</p><p> <span>' + car.wreckRate + 
                '%</span></p><p class="mb10">的青春（汽车的折损率</p>' + 
                '<p>然而汽车的耗损，</p>' + 
                '<p class="mb10">也见证了幸福感的与日俱增</p>' +
                '<p>怎能为那些难免的磕碰</p>' +
                '<p class="mb10">忘却Ta曾经为你遮风挡雨的日子</p>' +
                '<p>怎能因那些难免的争吵</p>' +
                '<p class="mb10">忽视父母带给你无与伦比的关爱</p>' +
                '<p>我来自山川湖海</p>' +
                '<p>唯有家庭与爱不可辜负</p>').removeClass('hidden');
              $('#jump-btn').html('举手之劳 传递亲情').attr('data-num', '0');
              $('#btn-link').html('<a class="btn btn-success" href="' + contextPath + '/pages/mobile/index.html?tab=4">我!要!卖!车!</a>');
            }

            if (data.code == '300') {
              $('#popup').html('<div class="content"><p>暂时不支持估价！</p><a id="slide-back" class="btn">重新填写表单</a></div>')
                  .removeClass('hidden');
              $('#btn-link').html('<a class="btn btn-failure" href="' + contextPath + '/pages/mobile/index.html?tab=2">看看我的dream car</a>');
            }
          }
        }
      })

    })

    $(document).on('click', '#slide-back', function() {
      $('#popup').addClass('hidden');
    })
  
  });

})();

$(function() {
  $('#animation').addClass('bounce-in');
  $('#next').addClass('next-bounce-in');
})