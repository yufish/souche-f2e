var config = {
    'brandUrl': contextPath + '/pages/dicAction/loadRootLevel.json?type=car-subdivision',
    'seriesUrl': contextPath + '/pages/dicAction/loadRootLevelForCar.json'
}

var _view = {
    buildNum: function(arr) {
        var brandNum = '<div class="brand-num"><h2>拼音选品牌</h2><ul class="list">';
        var i,
            len = arr.length;
        for (i = 0; i < len; i++) {
            brandNum += '<li><a href="#brand' + arr[i] + '">' + arr[i] + '</a></li>'
        }

        brandNum += '</ul></div>';

        return brandNum;
    },


    buildItem: function(arr) {
        var buildItem = '';
        var i;
        var len = arr.length;
        var rowItem = 4;
        for (var p in arr) {
            buildItem += '<div class="brand-item"><div class="title" id="brand' + p 
                        + '">' + p + '</div>';
            for (var i = 0; i < arr[p].length; i++) {
                if (i % rowItem == 0) {
                    buildItem += '<ul class="list">';
                }
                buildItem += '<li class="item" data-code="' + arr[p][i].code 
                            + '"><img src="http://res.souche.com/files/carproduct/brand/' + 
                            +  arr[p][i].code +'.png"><span>' 
                            + arr[p][i].name + '</span></li>';
                if (i % rowItem == 3) {
                    buildItem += '</ul>'
                }
            }
            buildItem += '</ul></div>';
        }
        return buildItem;
    },

    buildSeries: function(obj, activeCode) {
        var subStr = '<div class="sub"><div class="car"><span data－code＝"' 
                    + activeCode + '">全部车系</span></div>';
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

var brand = [], len, letter, str, i, j, brandItem, letterArr = [];
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
        letterArr.push(num)
        
    }

    var brandNum = _view.buildNum(letterArr);
    var buildItem = _view.buildItem(brand);
    $('body').append('<div id="brand" class="hidden">' + brandNum + buildItem + '</div>');


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
                    var subStr = _view.buildSeries(obj, code);
                    $('.brand-item .sub').remove();
                    $this.closest('.list').after(subStr);
                }
            }
        })
    })
    
});
