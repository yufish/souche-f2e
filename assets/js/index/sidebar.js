Souche = window.Souche || {};
Souche.Sidebar = (function() {
    var siderbarShow = false;

    $(document).ready(function() {
        $("#talk_with").on("click",function(e){
            Souche.Sidebar.showTalk($(this).attr("data-userid"));
        })
        $(".advisor-tip-close").click(function(e) {
            e.preventDefault();
            $(".my-advisor-tip").addClass("hidden");
            $("#advisor_notice").addClass("hidden")
            $.cookie('f2e_guwen_close', '1', {
                expires: 1
            });
            e.stopPropagation();
        })


        $(".sidebar").click(function(e) {
            e.stopPropagation();
        })
        $(".sidebar .side-trigger").click(function(e) {
            e.preventDefault();
            Souche.stats&&Souche.stats.add_click($(this).attr("click_type"))
            var self = this;
            if ($(this).hasClass("suggest-box")) {
                Souche.Sidebar.showSidebar(self);
            }else if($(this).hasClass("reserve-box")) {
                Souche.MiniLogin.checkLogin(function(isLogin) {
                    Souche.Sidebar.showSidebar(self);
                },false,true)
            } else {
                Souche.MiniLogin.checkLogin(function(isLogin) {
                    Souche.Sidebar.showSidebar(self);
                })
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
                height: 309
            }, 500, function() {

            })
            $("#toolbar").removeClass("sidebar-active")
            siderbarShow = false;
        });
        $(document.body).click(function() {
            if (siderbarShow) {
                $("#toolbar").animate({
                    width: 52,
                    height: 309
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
        $(document.body).on("mousemove",function(){
            Souche.Sidebar.hideMessageTip();
        })
        if(window.Souche_user_id){
            $.ajax({
                url:contextPath+"/pages/chatAction/getTotalUnreadCount.json",
                dataType:"json",
                data:{
                    user:"buyer_"+Souche_user_id
                },
                success:function(data){
                    console.log(data.totalCount)
                    if(data&&data.totalCount>0){
                        $(".unreadtip").removeClass("hidden")
                    }
                }

            })
        }

    });
    var pageTitle = document.title;
    var tipDotCount = 1;
    var tipTimer;
    var hasNewMessage;

    return {
        showTalk:function(user_id){
            var href = $("#sidebar-talk").attr("href")
            if(href.indexOf("talk_with")!=-1){
                href=href.replace(/talk_with=.+/,"talk_with="+user_id)
            }else{
                href=href+"?talk_with="+user_id
            }
            $("#sidebar-talk").attr("href",href)
            Souche.MiniLogin.checkLogin(function(isLogin) {
                Souche.Sidebar.showSidebar($("#sidebar-talk")[0])
            },false,true)

        },
        hideMessageTip:function(){
            if(tipTimer) clearInterval(tipTimer)
            document.title =  pageTitle
        },
        newMessageTip:function(){
            clearInterval(tipTimer)
            hasNewMessage = true;
            tipTimer = setInterval(function(){
                if(tipDotCount==1){
                    tipDotCount = 0;
                }else{
                    tipDotCount=1;
                }
                document.title = (tipDotCount==1?"☏":"☎")+"您有新消息 | "+pageTitle
            },50)

        },
        hideTalk:function(){
            $("#toolbar").animate({
                width: 52,
                height: 309
            }, 500, function() {

            })
            $("#toolbar").removeClass("sidebar-active")
            siderbarShow = false;
        },
        showSidebar:function(self) {

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
    }
})();
