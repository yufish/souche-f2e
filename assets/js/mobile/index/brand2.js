define(function() {

  var Brand = function() {

    var config = {
      'brandUrl': contextPath + '/pages/dicAction/loadRootLevel.json?type=car-subdivision',
      'seriesUrl': contextPath + '/pages/dicAction/loadRootLevelForCar.json'
    };

    var _build = {

      // 构建字母排序列表
      buildNum: function(arr) {
        var brandNum = '<div class="brand-num"><h2>拼音选品牌</h2>',
            i, len = arr.length;
                
        for (i = 0; i < len; i++) {
          if (i % 7 == 0) {
             brandNum += '<ul class="list">'; 
          }
          brandNum += '<li><a href="#brand' + arr[i] + '">' + arr[i] + '</a></li>';
          if (i % 7 == 6) {
              brandNum += '</ul>'
          }
        }

        brandNum += '</div>';

        return brandNum;
      },

      // 构建品牌列表
      buildItem: function(arr) {
        var buildItem = '', i, len = arr.length, rowItem = 4;

        for (var p in arr) {
          buildItem += '<div class="brand-item"><div class="title" id="brand' 
                    + p + '">' + p + '</div>';
          for (var i = 0; i < arr[p].length; i++) {
            if (i % rowItem == 0) {
                buildItem += '<ul class="list">';
            }
            buildItem += '<li class="item" data-code="' + arr[p][i].code 
                      + '"><img src="http://res.souche.com/files/carproduct/brand/'
                      + arr[p][i].code +'.png"><span>' 
                      + arr[p][i].name + '</span></li>';
            if (i % rowItem == 3) {
                buildItem += '</ul>'
            }
          }
          buildItem += '</ul></div>';
        }
        return buildItem;
      },

      // 获取二级车系
      buildSeries: function(obj, activeCode) {
        // var subStr = '<div class="sub"><div class="car"><span data－code＝"' 
        //           + activeCode + '">全部车系</span></div>';
        var subStr = '<div class="sub">';
        for (var p in obj) {
          subStr += '<div class="car-cat">'
                 + p + '</div><div class="car">';
          var arr = obj[p];
          for (var i = 0; i < arr.length; i++) {
              subStr += '<span data-code="' + arr[i].code + '">' 
                     + arr[i].enName + '</span>';
          }
          subStr += '</div>';
        }
        subStr += '</div>';
        return subStr;
      }

    };

    var _bind = function(cb) {
      var car = {};
      car.brand = '';
      car.brandName = '';
      car.series = '';
      car.seriesName = '';

      $(document).on('click', '#brand .back', function(e) {
        e.preventDefault();
        $('#brand').addClass('hidden');
      });

      // 点击品牌字母滑到对应的品牌 
      $(document).on('click', '#brand .brand-num a', function(e) {
        e.preventDefault();
        var brandName = $(this).attr('href');
        var height = $(brandName).position().top;
        $('#brand').animate({scrollTop: height}, 400);
      });

      // 获取品牌信息
      $(document).on('click', '#brand .list .item', function() {
        car.brand = $(this).attr('data-code');
        car.brandName = $(this).find('span').text();
        // cb(car.brand, car.brandName, car.series, car.seriesName);
      });

      // 获取车系信息
      $(document).one('click', '#brand .car span', function() {
        car.series = $(this).attr('data-code') ? $(this).attr('data-code') : '';
        car.seriesName = $(this).text();
        $('#brand .car span').removeClass('active');
        $(this).addClass('active');
        setTimeout(function() {
          $('#brand').addClass('hidden');
          $('.brand-item .sub').remove();
          $('.brand-item .item').removeClass('active');
        }, 500);
        cb(car.brand, car.brandName, car.series, car.seriesName);
      });

      // 不限品牌
      $(document).one('click', '#brand .brand-top-right', function() {
        car.brand = '';
        car.brandName = $(this).text();
        car.series = '';
        car.seriesName = '';
        $('#brand .car span').removeClass('active');
        $('#brand').addClass('hidden');
        cb(car.brand, car.brandName, car.series, car.seriesName);
      }); 
    };

    return {
      init: function() {
        var brand = [], len, letter, str, i, j, brandItem, letterArr = [];

        // 构建品牌页面
        $.getJSON(config.brandUrl, function(data) {
          len = data.items.length;
          for (i = 0; i < len; i++) {
              letter = data.items[i].name.substring(0, 1);
              brand[letter] = [];
              for (j = 0; j < len; j++) {
                  str = data.items[j].name.substring(0, 1);
                  brandItem = {
                      name: data.items[j].enName,
                      code:  data.items[j].code
                  }
                  if (str === letter ) {
                      brand[letter].push(brandItem);
                  }
              }
                 
          }
            
          //- 数组不使用for in
          for (var pop in brand) {
            if (brand.hasOwnProperty(pop)) {
                var num = pop;
            }
            letterArr.push(num);
          }

          var brandNum = _build.buildNum(letterArr);
          var buildItem = _build.buildItem(brand);

          $('body').append('<div id="brand" class="hidden"><div class="header" id="header-common">'
                                + '<header class="header"><a class="back" href="#">' 
                                + '<i class="header-back-icon"></i>返回</a></header></div>' 
                                + brandNum + buildItem + '</div>');

          // 获取车系时间
          $('.brand-item').on('click', '.item', function() {
            var code = $(this).attr('data-code');
            var $this = $(this);
            var obj;
            $.ajax({
              url: config.seriesUrl,
              dataType: "json",
              data: {
                  type: "car-subdivision",
                  code: code
               },
              success: function(data) {
                if (data) {
                  obj = data.codes;
                  $('.item').removeClass('active');
                  $this.addClass('active');
                  var subStr = _build.buildSeries(obj, code);
                  $('.brand-item .sub').remove();
                  $this.closest('.list').after(subStr);
                }
              }
            })
          });


            
        });
      },

      // 绑定事件，返回数据
      bind: function(cb) {
        _bind(cb);
      }

    }

  }();

  return Brand;

});


