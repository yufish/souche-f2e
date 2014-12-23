$(function(){
  var level = $(".level-act").attr("value");
  levelWidth = level*16+"px";
    
  $(".level-act").css({width:levelWidth});
});


if(typeof $.cookie == "function") {
var checkUserLocal = function () {
    var phoneReg = /^1[3458][0-9]{9}$/;

    var username = $.cookie('username')
    if (phoneReg.test(username)) {
        return {
            'phoneNum': username
        };
    }
    var noregisteruser = $.cookie('noregisteruser');
    if (phoneReg.test(noregisteruser)) {
        return {
            phoneNum: noregisteruser
        };
    }
    var crmid=$.cookie('crmid');
    if (phoneReg.test(crmid)) {
        return {
            phoneNum: crmid
        };
    }
    return {
        phoneNum: undefined
    }
  }
}

var obj = JSON.parse(sessionStorage.getItem('evaluate_obj')) || {};
var actionUrl = contextPath + '/pages/mobile/sellCarAction/savaSellCar.json';

var sellObj = {
  brand: obj.brand_code || '',
  series: obj.series_code || '',
  mobile: obj.mobile || ''
};


var phoneNum = checkUserLocal().phoneNum;

$('.concat .sell').on('click', function() {
  var str = '';

  if (!sellObj.mobile && !phoneNum) {
    str += '<p>补充您的手机号，开始卖车！</p>'
        + '<input id="e-mobile" type="tel" placeholder="请输入您的手机号">';
  } else {
    var pm = sellObj.mobile || phoneNum;
    str += '<p>确定以此号码作为联系方式！</p>'
          + '<input id="e-mobile" type="tel" value="' + pm + '">';
  }

  str += '<button id="e-submit">确定</button><a class="e-close"></a>'

  $('.e-popup').html(str);
  $('#e-popup').removeClass('hidden');

});

$(document).on('click', '#e-submit', function() {
  var phoneReg = /^1[34578][0-9]{9}$/;
  var phoneNum = $('#e-mobile').val();
  if(!phoneReg.test(phoneNum)){
    alert('手机号填写错误，请输入正确的手机号码');
    return;
  }

  sellObj.mobile = phoneNum;

  $.ajax({
    url: actionUrl,
    data: sellObj,
    dataType: "json",
    success:function(data) {
      if(data.errorMessage){
        alert(data.errorMessage)
      } else {
        var str = '<h6>您的卖车需求提交成功！</h6><p>工作人员会在24小时内与您联系，'
                + '沟通具体卖车需求，如有疑问可咨询：4008-010－010</p><button class="e-close">我知道了</button>';
        $('.e-popup').html(str);
        $('.concat .sell').css({background:'#f5f5f5',color:'#333',borderColor: '#ccc'}).text('提交成功').off('click');
      }
    }
  })

});

$(document).on('click', '.e-close', function() {
  $('#e-popup').addClass('hidden');
});
