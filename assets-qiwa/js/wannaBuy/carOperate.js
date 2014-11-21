// 车辆列表 车辆item的操作
define(function(){
    var config = {};
    var phoneReg = /^1[3458][0-9]{9}$/;
    
    var _event = {
        bind: function(){
            //降价通知提交
            $("#qiugou-form").submit(_event.qiugouFormHandler);
            
            $("#qiugou-popup .apply_close").click(_event.qiugouPopupClose);

            //快速求购同步提交
            $("#F_buy_submit").click(_event.faseQiugouHandler);

            // 添加到对比
            $(".carConstrast").on("click", _event.addContrast);

            // 用户输入一系列筛选条件后, 如果没有匹配, 会生成一个.list-noResult
            // 提供订阅
            $("#list-noResult-submit").on("click", _event.subscibe);        
        },
        qiugouFormHandler: function(e) {
            e.preventDefault();
            if(!phoneReg.test($("#qiugou-phone").val())) {
                $(".warning", this).removeClass("hidden");
                return;
            } else {
                Souche.PhoneRegister($("#qiugou-phone").val(), function() {
                    //同步提交form，需要跳转到新的页面
                    $("#F_buy_top_form").submit();
                })
            }
        },
        qiugouPopupClose: function() {
            $("#qiugou-popup").addClass("hidden");
            $(".qiugou-wrapGrayBg").hide();
        },
        faseQiugouHandler: function(e) {
            //校验 true,false
            if($('#F_buybrand').val() == "" && $("#F_buyage").val() == "0-100" && $('#F_buyprice').val() == "0-100000000") {
                $('#F_buy_top_form .error_remind').html("请至少选择一个条件").show();
                return false;
            }
            e.preventDefault();

            Souche.checkPhoneExist(function(is_login) {

                if(is_login) {
                    //同步提交form，需要跳转到新的页面
                    $("#F_buy_top_form").submit();
                    $(".historyRecord").removeClass("hidden");
                } else {
                    $("#qiugou-popup").removeClass("hidden");
                    $(".qiugou-wrapGrayBg").show();
                }
            })
        },
        addContrast: function(e) {
            
            var carid = $(this).find("input").attr("carid")||$(this).attr("carid");
            var contrastId = $(this).find("input").attr("contrastid")||$(this).attr("contrastid");

            var self;
            if(e.target.tagName !="INPUT"){
               self = $(this); 
            }
            else
            {
                self = $(this);
                $(this).find("input")[0].checked=!$(this).find("input")[0].checked;
            }
            self.e = e;
            Souche.MiniLogin.checkLogin(function(){
                if(!self.find("input")[0].checked) {
                    if(!!carid) {
                        $.ajax({
                            type : "POST",
                            url : config.addContrast,
                            data: {
                                carId: carid
                            },
                            dataType : "json",
                            context : self
                        }).done(function(data) {
                            if(data.result == 2) {
                                self.find("input").attr("checked", 'true');
                                self.addClass('added');

                                var cloneElement = self.clone();
                                cloneElement.css({
                                    opacity : 0.8,
                                    position : 'absolute',
                                    top : this.e.pageY + 'px',
                                    left : this.e.pageX + 'px',
                                    backgroundColor : "#BCEE68"
                                }).html("加入对比");

                                var endX = $(".side-box .contrast-img").offset().left;
                                var endY = $(".side-box .contrast-img").offset().top;

                                document.body.appendChild(cloneElement[0]);
                                cloneElement.animate({
                                    top : endY,
                                    left : endX
                                }, 500, function() {
                                    cloneElement.remove();
                                });

                                self.find("input").attr("contrastid", data.contrastId);
                                return;
                            }
                            if(data.result == -1) {
                                self.find(".contrast-waring").html("对比已添加！你不需要继续添加。").removeClass("hidden");
                                self.find("input").attr("checked", 'true');
                                window.setTimeout(function() {
                                    self.find(".contrast-waring").addClass("hidden");
                                }, 2000);
                                return;
                            }
                            if(data.result == 1) {
                                $(this).find(".contrast-waring").html("对比栏已满！你可以删除不需要的车辆，再继续添加。").removeClass("hidden");
                                window.setTimeout(function() {
                                    self.find(".contrast-waring").addClass("hidden");
                                }, 2000);
                                return;
                            }
                            $(this).find(".contrast-waring").html("加入对比失败，请刷新页面。").removeClass("hidden");
                            window.setTimeout(function() {
                                self.find(".contrast-waring").addClass("hidden");
                            }, 2000);
                        });
                    } else {
                        alert("数据不合法");
                    }
                } else {

                }
            })

            return false;
        },
        subscibe: function(e) {
            e.preventDefault();
            if($("#list-noResult-phone").length == 0) {
                $("#no-result-form").submit();
                return;
            }
            if(!/^1[3458][0-9]{9}$/.test($("#list-noResult-phone").val())) {
                $("#no-result-form .input-error-tip").removeClass("hidden")
                return;
            } else {
                $("#no-result-form .input-error-tip").addClass("hidden")
            }
            Souche.PhoneRegister($("#list-noResult-phone").val(), function() {
                $("#no-result-form").submit();
            })
        }
    }

    function init(_config){
        $.extend(config, _config);
        _event.bind();
    }

    return {
        init: init
    };

});