Souche = window.Souche || {};
Souche.Sidebar = (function() {
    $(document).ready(function() {
        //加载未读数
        // $.ajax({
        //     url: contextPath + "/pages/toolbarAction/selectToolbarCount.json",
        //     dataType: "json",
        //     success: function(data) {
        //         if (data.dayCarNum * 1 > 0) {
        //             $("#advisor_notice").html(data.dayCarNum).removeClass("hidden")
        //             $("#advisor_count").html(data.dayCarNum)
        //             if (!$.cookie("f2e_guwen_close")) {
        //                 $(".my-advisor-tip").removeClass("hidden")
        //             }
        //         }
        //         // if (data.buyer_car_recommand * 1 > 0) {
        //         //     $("#fav_notice").html(data).removeClass("hidden")
        //         // }

        //         // $("#yuyue_notice").html(data).removeClass("hidden")
        //         // $("#pricedown_notice").html(data).removeClass("hidden")
        //     }
        // })
        $(".advisor-tip-close").click(function(e) {
            e.preventDefault();
            $(".my-advisor-tip").addClass("hidden");
            $("#advisor_notice").addClass("hidden")
            $.cookie('f2e_guwen_close', '1', {
                expires: 1
            });
            e.stopPropagation();
        })
        var siderbarShow = false;
        var showSidebar = function(self) {

            $(".sidebar .side-box").removeClass("active")
            $(self.parentNode).addClass("active")
            if (!$("#toolbar").hasClass("sidebar-active")) {
                $("#toolbar").animate({
                    width: 905,
                    height: ($(window).height() - 20) > 500 ? 500 : ($(window).height() - 20)
                }, 500, function() {
                    siderbarShow = true;
                })
                $(".sidebar  iframe").css({
                    height: (($(window).height() - 20) > 500 ? 500 : ($(window).height() - 20)) - 32
                })
                $("#toolbar").addClass("sidebar-active")
                $(".sidebar").removeClass("active")
            }
            $(".toolbar-content iframe").attr("src", $(self).attr("href"));
            $(".toolbar-content .iframe-loading").removeClass("hidden");
            $(".toolbar-content iframe").load(function() {
                $(this).removeClass("hidden");
                $(".toolbar-content .iframe-loading").addClass("hidden");
            })
        }
        $(".sidebar").click(function(e) {
            e.stopPropagation();
        })
        $(".sidebar .side-trigger").click(function(e) {
            e.preventDefault();

            if ($(this).hasClass("collect-box")) {
                Souche.MiniLogin.checkLogin(function(){
                    showSidebar(this);
                })

            } else {

            }


        });
        $("#my-advisor").on("mouseenter", function() {
            $("#my-advisor").addClass("active")
        }).mouseleave(function() {
            $("#my-advisor").removeClass("active")
        });

        $(".sidebar").on("mouseenter", function() {
            if (!$(".sidebar").hasClass("sidebar-active")) {
                $(".sidebar").addClass("active")
            }
        }).mouseleave(function() {
            $(".sidebar").removeClass("active")
        });
        $(".toolbar-close").click(function() {
            $("#toolbar").animate({
                width: 52,
                height: 199
            }, 500, function() {

            })
            $("#toolbar").removeClass("sidebar-active")
            siderbarShow = false;
        });
        $(document.body).click(function() {
            if (siderbarShow) {
                $("#toolbar").animate({
                    width: 52,
                    height: 199
                }, 500, function() {

                })
                $("#toolbar").removeClass("sidebar-active")
                siderbarShow = false;
            }

        });
        $("#noreg-popup").on("click", function(e) {
            e.stopPropagation();
        })
        var Q_Buy_active = false;
        $(window).scroll(function() {
            if ($(window).scrollTop() > 0) {

                $("#toTop").show("slow");
            } else {
                $("#toTop").hide("slow");
            }
        });
        $("#toTop").click(function() {
            $("html,body").animate({
                scrollTop: 0
            });
        });
        // $("#toTop").mouseenter(function() {
        //     $(this).addClass("toTopActive");
        // }).mouseleave(function() {
        //     $(this).removeClass("toTopActive");
        // });
        // $("#erweima").mouseenter(function() {
        //     $(".erweima-small").addClass("erweima-active");
        //     $(".erweima-big").fadeIn(300);
        // }).mouseleave(function() {
        //     $(".erweima-small").removeClass("erweima-active");
        //     $(".erweima-big").hide();
        // });
        //建议
        // $("#suggest").mouseenter(function() {
        //     $('.suggest-tag').addClass("suggest-tag-active");
        // }).mouseleave(function() {
        //     $('.suggest-tag').removeClass("suggest-tag-active");
        // });
        // $(".suggest-tag").click(function() {
        //     $(".suggest-area").val('请填写反馈，我们会重视每一位用户的意见');
        //     if (!$('.suggest-remind').hasClass('hidden')) {
        //         $('.suggest-remind').addClass('hidden');
        //     }
        //     $('.suggest-popup').removeClass("hidden");
        //     if ($('.wrapGrayBg').length) {
        //         $('.wrapGrayBg').show();
        //     } else {
        //         $('<div class="wrapGrayBg" style="opacity: 0.7; display: block;"></div>').appendTo(document.body).css({
        //             opacity: 0.7
        //         })
        //     }

        // });

        // $(".suggest-close").click(function() {
        //     $(".suggest-popup").addClass("hidden");
        //     $(".suggest-result").addClass("hidden");
        //     $('.wrapGrayBg').hide();
        // });
        // var oldVal = $(".suggest-area").val();
        // var numLen = parseInt($(".suggest-num ins").text());
        // $(".suggest-area").focus(function() {
        //     var $this = $(this);
        //     $this.addClass('suggest-area-active');
        //     if ($this.val() == oldVal) {
        //         $this.val('');
        //     }
        // }).blur(function() {
        //     var $this = $(this);
        //     $this.removeClass('suggest-area-active');
        //     if ($this.val() == '') {
        //         $this.val(oldVal);
        //     }
        // }).keyup(function() {
        //     if (!$('.suggest-remind').hasClass('hidden')) {
        //         $('.suggest-remind').addClass('hidden');
        //     }
        //     var $this = $(this);
        //     var length = $this.val().length;
        //     if (length > numLen) {
        //         $(".suggest-num").html("您已超过<ins>" + (length - numLen) + "</ins>字");
        //         $(".suggest-submit").addClass("hidden");
        //         $(".suggest-no").removeClass("hidden");
        //     } else {
        //         $(".suggest-num").html("您还可以输入<ins>" + (numLen - length) + "</ins>字");
        //         $(".suggest-no").addClass("hidden");
        //         $(".suggest-submit").removeClass("hidden");
        //     }
        // });
        // $("#J_suggest_form").submit(function(event) {
        //     event.preventDefault();
        //     if ($('.suggest-area').val() == '' || $('.suggest-area').val() == $('.suggest-area').attr('default')) {
        //         $('.suggest-remind').removeClass("hidden");
        //         return;
        //     }
        //     $.ajax({
        //         url: $("#J_suggest_form").attr("action"),
        //         type: "post",
        //         data: $("#J_suggest_form").serialize(),
        //         success: function() {
        //             $(".suggest-popup").addClass("hidden");
        //             $(".suggest-result").removeClass("hidden");
        //         }
        //     })

        // });


    });

    // var bdTimer = setInterval(function() {
    //     if ($("#BDBridgeMess").length != 0) {
    //         clearInterval(bdTimer);
    //         $("#BdBPClose").unbind("click").click(function() {
    //             $("#BaiduBridgePigeon").hide();
    //         });
    //         if ($("#BaiduBridgePigeon").is(":visible")) {
    //             $("#BaiduBridgePigeon").hide();
    //             $("#BDBridgeIconWrap").unbind("click").click(function() {
    //                 $("#BaiduBridgePigeon, #BdBPBody, #BdBPFoot").show();
    //                 $("#BaiduBridgePigeon").height(320);
    //             });
    //         }
    //         if ($("#BDBridgeIconWrap").length != 0) {
    //             $("#BDBridgeIconWrap").mouseenter(function() {
    //                 $("#bridgehead").addClass("BDActive");
    //             }).mouseleave(function() {
    //                 $("#bridgehead").removeClass("BDActive");
    //             });
    //         }

    //     }
    // }, 100);


    //ie6 fixed 
    // if ((parseFloat($.browser.version) <= 6.0)) {
    //     var BDFixed = function() {
    //         $("#BDBridgeIconWrap").css({
    //             position: "absolute",
    //             top: $(window).scrollTop() + $(window).height() - 180,
    //             right: 0,
    //             left: "auto",
    //             bottom: "auto",
    //             "margin-bottom": 0
    //         });
    //         $("#floatLayer").css({
    //             position: "absolute",
    //             top: $(window).scrollTop() + $(window).height() - 125,
    //             right: 0
    //         });
    //         $("#loginInner").css({
    //             position: "absolute",
    //             top: $(window).scrollTop() + $(window).height() - 450
    //         });
    //         $(".apply_popup").css({
    //             position: "absolute",
    //             top: $(window).scrollTop() + $(window).height() - 450
    //         });
    //     };
    //     var timer = setInterval(function() {
    //         if ($("#BDBridgeIconWrap").length != 0) {
    //             clearInterval(timer);
    //             BDFixed();
    //             $(window).scroll(function() {
    //                 BDFixed();
    //             });
    //         }
    //     }, 100);
    // };

})();

// if (typeof(define) != "undefined") {
//     define(['souche'], function() {
//         return Souche.Sidebar;
//     })
// }