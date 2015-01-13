define(function() {

  var default = {
    eles: ['#J_brand', '#J_model', '#J_year'],
    type: "",
  }

  var config = {
    'brandUrl': contextPath + '/pages/dicAction/loadRootLevel.json?type=car-subdivision',
    'seriesUrl': contextPath + '/pages/dicAction/loadRootLevelForCar.json',
    'modelUrl': contextPath + '/pages/dicAction/loadNextLevel.json?type=car-subdivision'
  };

  var _util = {

    // 对象自有属性的长度
    objSize = function(obj) {
      if ($.isPlainObject(obj)) {
        var count = 0;

        if (Object.keys) {
          count = Object.keys(obj).length;
        } else {
          for (var key in obj) if (obj.hasOwnProperty(key)) count++;
        }
        return count;
      } else {
        console.warn('传入的必须是纯对象')
      }
    }

  };

  // 品牌对象 {'a': {name: xxx, code: xxx}}
  var brand = (fucntion() {
    var brand = {};

    $.getJSON(config.brandUrl, function(data) {
      var data = data.items, len = data.length;

      for (var i = 0; i < len; i++) {
        letter = data[i].name.substring(0, 1);
        brand[letter] = [];

        for (var j = 0; j < len; j++) {
          str = data[j].name.substring(0, 1);

          if (letter === str) {
            brand[letter].push({
              name: data[j].enName,
              code: data[j].code
            })
          }
        }
      }
    });

    return brand;
  })();

  var _data = {

    // 字母排序
    letter = function() {
      var letterArr = [];

      for (var p in brand) {
        if (brand.hasOwnProperty(p)) {
          letterArr.push(p);
        }
      }
      return letterArr;
    },

    // 车系
    series = function(code, cb) {
      $.getJSON(config.seriesUrl, {type: "car-subdivision", code: code }, cb);
    },

    // 车型
    model = function(code, cb) {
      $.getJSON(config.modelUrl, {code: code }, function(data) {
        var obj = {}, data = data.items;

        for (var i = 0, len = data.length; i < len; i ++) {
          var t = data[i].name.slice(0,4);
          var d = data[i].name.trim();
          var c = data[i].code;

          if (!obj[t]) {
            obj[t] = [];
          }
          obj[t].push({title: d, code: c});
        }
        cb(obj)
      });
    }

    // 年份
    date = function() {

    }

  };


  var _build = {

    // 构建字母排序列表
    Num: function(arr) {
      var brandNum = '<div class="brand-num"><h2>拼音选品牌</h2>',
          i, len = arr.length;
              
      for (i = 0; i < len; i++) {
        if (i % 7 == 0) {
           brandNum += '<ul class="list">'; 
        }
        brandNum += '<li><a href="#brand' + arr[i] + '" data-brand="num">' + arr[i] + '</a></li>';
        if (i % 7 == 6) {
            brandNum += '</ul>'
        }
      }

      brandNum += '</div>';
      return brandNum;
    },

    // 构建品牌列表
    brand: function(obj) {
      var buildItem = '', ROWITEM = 4, len = _util.objSize(obj);

      for (var p in obj) {
        buildItem += '<div class="brand-item"><div class="title" id="brand' 
                  + p + '">' + p + '</div>';
        for (var i = 0; i < obj[p].length; i++) {
          if (i % ROWITEM == 0) {
              buildItem += '<ul class="list">';
          }
          buildItem += '<li class="item" data-brand="brand" data-code="' + obj[p][i].code 
                    + '"><img src="http://res.souche.com/files/carproduct/brand/'
                    + obj[p][i].code +'.png"><span>' 
                    + obj[p][i].name + '</span></li>';
          if (i % ROWITEM == 3) {
              buildItem += '</ul>'
          }
        }
        buildItem += '</ul></div>';
      }
      return buildItem;
    },

    // 获取二级车系
    series: function(obj, activeCode, b) {
      if (b === true) {
        var subStr = '<div class="sub"><div class="car"><span data-code＝"' 
                + activeCode + '">全部车系</span></div>';  
      } else {
        var subStr = '<div class="sub">';   
      }
      
      for (var p in obj) {
        subStr += '<div class="car-cat">' + p + '</div><div class="car">';
        var arr = obj[p];
        for (var i = 0; i < arr.length; i++) {
            subStr += '<span data-brand="series" data-code="' + arr[i].code + '">' 
                   + arr[i].enName + '</span>';
        }
        subStr += '</div>';
      }
      subStr += '</div>';
      return subStr;
    },

    // 车型
    model: function(obj) {
      var str = '';

      for (var p in obj) {
        str += '<div class="item">';
        for (var i = 0, arr = obj[p], len = arr.length; i < len; i ++) {
          str += '<li data-code="' +  arr[i].code + '">' +  arr[i].title + '<span class="left-arrow"></span></li>'
        }
        str += '</div>';
      }
      $('#model').html(str);
    },

    // 年份
    date: function (year) {
      var n = new Date().getFullYear();
      var year = '';

      year += '<option value="">年</option>'

      for (var j = y; j < n + 1; j ++) {
        year += '<option value="' + j + '">' + j + '年</option>';
      }
      return year;
    }

  };

  function Brand(option) {
    this.option = $.extend({}, default, option);
    this.init();
  }

  Brand.version = 1.0.0;

  Brand.prototype.init = function() {
    var opt = this.option;

    // 增加禁止点击class
    $(opt.eles[1]).addClass('no-active').text('请先选择品牌车系');
    $(opt.eles[2]).addClass('no-active');

    var str = '<div id="brand" class="hidden"><div class="header" id="header-common">'
                  + '<header class="header"><a class="back" href="#">' 
                  + '<i class="header-back-icon"></i>返回</a></header></div>' ;
    var num = _build.num(_data.letter);
    var brand = _build.brand(brand);
    str += num + item + '</div>';
    $('body').append(str).append($('#models')); 
  };

  Brand.prototype.trigger = function() {
    var opt = this.option;

    $(opt.eles[0]).on('click', function() {
      $(opt.eles[1]).removeClass('no-active').text('');
      $('#models').empty();
      $('#brand').removeClass('hidden');
    });

    $(opt.eles[1]).on('click', function() {
      if ($(this).hasClass('no-active')) return null;
      $(opt.eles[1]).removeClass('hidden');
    });

  };

  Brand.prototype.bind = function() {
    var car = {
      brand: '',
      brandName: '',
      series: '',
      seriesName: ''
    }, $root = $(document);

    // 返回
    $root.on('click', '#brand .back', function(e) {
      e.preventDefault();
      $('#brand').addClass('hidden');
    });

    // 点击品牌字母滑到对应的品牌 
    $root.on('click', '[data-brand="num"]', function(e) {
      e.preventDefault();
      var brandName = $(this).attr('href');
      var height = $(brandName).position().top;
      $('#brand').animate({scrollTop: height}, 400);
    });

    // 获取品牌信息
    $root.on('click', '[data-brand="brand"]', function() {
      car.brand = $(this).attr('data-code');
      car.brandName = $(this).find('span').text();

      // 获取车系
      var code = car.brand, $this = $(this), obj;
      
      // _getSeries(function(data) {
      //   obj = data.codes;
      //   $('#brand .list .item').removeClass('active');
      //   $this.addClass('active');
      //   var subStr = _build.buildSeries(obj, code, b);
      //   $('.brand-item .sub').remove();
      //   $this.closest('.list').after(subStr);
      // });

    });

    // 获取车系信息
    $root.one('click', '[data-brand="series"]', function() {
      car.series = $(this).attr('data-code') || '';
      car.seriesName = $(this).text();
      $('#brand .car span').removeClass('active');
      $(this).addClass('active');
      setTimeout(function() {
        $('#brand').addClass('hidden');
        $('.brand-item .sub').remove();
        $('.brand-item .item').removeClass('active');
      }, 500);
      cb(car.brand, car.brandName, car.series, car.seriesName);

      
      // 车型信息
      _build.model();
      
    });
  };


  return {
    init: new Brand(option);
  }

});


