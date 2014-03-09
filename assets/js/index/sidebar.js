(function(){
  $(document).ready(function(){
    var Q_Buy_active = false;
    $(window).scroll(function(){
      if($(window).scrollTop() > $(window).height()){
        $("#toTop").show();
      }else{
        $("#toTop").hide();
      }
    });
    $("#toTop").click(function(){
      $("html,body").animate({scrollTop:0});
    });
    $("#toTop").mouseenter(function(){
      $(this).addClass("toTopActive");
    }).mouseleave(function(){
      $(this).removeClass("toTopActive");
    });
    $("#erweima").mouseenter(function(){
      $(".erweima-small").addClass("erweima-active");
      $(".erweima-big").fadeIn(300);
    }).mouseleave(function(){
      $(".erweima-small").removeClass("erweima-active");
      $(".erweima-big").hide();
    });
    //建议
    $("#suggest").mouseenter(function(){
      $('.suggest-tag').addClass("suggest-tag-active");
    }).mouseleave(function(){
      $('.suggest-tag').removeClass("suggest-tag-active");
    });
    $(".suggest-tag").click(function(){
      $(".suggest-area").val('在这里输入您的建议，感谢您对大搜车的帮助！');
      if(!$('.suggest-remind').hasClass('hidden')){
        $('.suggest-remind').addClass('hidden');
      }
      $('.suggest-popup').removeClass("hidden");
      $('.wrapGrayBg').show();
    });

    $(".suggest-close").click(function(){
      $(".suggest-popup").addClass("hidden");
      $('.wrapGrayBg').hide();
    });
    var oldVal = $(".suggest-area").val();
    var numLen = parseInt($(".suggest-num ins").text());
    $(".suggest-area").focus(function(){
      var $this = $(this);
      $this.addClass('suggest-area-active');
      if($this.val() == oldVal){
        $this.val('');
      }
    }).blur(function(){
      var $this = $(this);
      $this.removeClass('suggest-area-active');
      if($this.val() == ''){
        $this.val(oldVal);
      }
    }).keyup(function(){
      if(!$('.suggest-remind').hasClass('hidden')){
        $('.suggest-remind').addClass('hidden');
      }
      var $this = $(this);
      var length = $this.val().length;
      if(length > numLen){
        $(".suggest-num").html("您已超过<ins>"+(length-numLen)+"</ins>字");
        $(".suggest-submit").addClass("hidden");
        $(".suggest-no").removeClass("hidden");
      }else{
        $(".suggest-num").html("您还可以输入<ins>"+(numLen - length)+"</ins>字");
        $(".suggest-no").addClass("hidden");
        $(".suggest-submit").removeClass("hidden");
      }
    });
    $("#J_suggest_form").submit(function(event){
      event.preventDefault();
      if($('.suggest-area').val()==''||$('.suggest-area').val()==$('.suggest-area').attr('default')){
        $('.suggest-remind').removeClass("hidden");
        return ;
      }
      $.ajax({
        url:$("#J_suggest_form").action,
        type:"post",
        data:$("#J_suggest_form").serialize(),
        success:function(){
          $(".suggest-popup").addClass("hidden");
          $(".suggest-result").removeClass("hidden");
          setTimeout(function(){
            $(".suggest-result").addClass("hidden");
            $('.wrapGrayBg').hide();
          },1000);
        }
      })
      
    });
    
    

  });

var bdTimer = setInterval(function(){
  if($("#BDBridgeMess").length != 0){
    clearInterval(bdTimer);
    $("#BdBPClose").unbind("click").click(function(){
      $("#BaiduBridgePigeon").hide();         
    });
    if($("#BaiduBridgePigeon").is(":visible")){
      $("#BaiduBridgePigeon").hide();
      $("#BDBridgeIconWrap").unbind("click").click(function(){
        $("#BaiduBridgePigeon, #BdBPBody, #BdBPFoot").show();
        $("#BaiduBridgePigeon").height(320);
      });
    }
    if($("#BDBridgeIconWrap").length != 0){
      $("#BDBridgeIconWrap").mouseenter(function(){
        $("#bridgehead").addClass("BDActive");
      }).mouseleave(function(){
        $("#bridgehead").removeClass("BDActive");
      });
    }
    
  }
},100);

  //ie6 fixed 
  if((parseFloat($.browser.version) <= 6.0)){
    var BDFixed = function(){
      $("#BDBridgeIconWrap").css({
        position:"absolute",
        top:$(window).scrollTop()+$(window).height()-180,
        right:0,
        left:"auto",
        bottom:"auto", 
        "margin-bottom":0
      });
      $("#floatLayer").css({
        position:"absolute",
        top:$(window).scrollTop()+$(window).height()-125,
        right:0
      });
      $("#loginInner").css({
        position:"absolute",
        top:$(window).scrollTop()+$(window).height()-450
      });
      $(".apply_popup").css({
        position:"absolute",
        top:$(window).scrollTop()+$(window).height()-450
      });
    };
    var timer = setInterval(function(){
      if($("#BDBridgeIconWrap").length != 0){
        clearInterval(timer);
        BDFixed();
        $(window).scroll(function(){
          BDFixed();
        });     
      }
    },100);
    
    
    
  }
  
})();


