(function () {
    var tpl =
        "     <div class=\"advisor-unfold\">" +
        "        <div class=\"wrapper-bg\">" +
        "        <a class=\"advisor-close\" click_type='advisor-close'></a>" +
        "        <div class=\"unfold-title\">" +
        "           <span>你最近浏览过</span>" +
        "           <em>{{message}}</em>" +
        "           <p>根据你的浏览记录，大搜车买车顾问为你精选了5辆车：</p>" +
        "        </div>" +
        "        <div class=\"frosted\">" +
        "           <img src=\"http://res.souche.com/assets/images/common/frosted.png\" > " +
        " </div>" +
        "        <div class=\"unfolf-form\">" +
        "          <form class=\"unfold\" id='advisor-form'>" +
        "             <p>输入手机号码，立即查看为我精选的车</p > " +
        " <input id = \"unfold-phone\" placeholder=\"输入你的手机号\" type=\"text\" name='phone'/>" +
        "             <div class=\"input-error-wrapper clearfix\">" +
        "             <div class=\"input-error-tip hidden\"><span class=\"error-icon\"></span>请输入正确的手机号</div>" +
        "             </div>" +
        "             <input id=\"unfold-submit\" type=\"submit\" click_type=\"newusertip\"/>" +
        "          </form>" +
        "        </div>" +
        "        </div>" +
        "     </div>";
    var phoneReg = /^1[3458][0-9]{9}$/;
    $.ajax({
        url: contextPath + "/pages/toolbarAction/newUserTip.json",
        dataType: "json",
        type: "get",
        success: function (data) {
            if (data.code == 200) {
                $(document.body).append(tpl.replace("{{message}}", data.message))
                $(".advisor-close").click(function () {
                    $(".advisor-unfold").animate({
                        width: 0,
                        height: 0,
                        bottom: 430,
                        right: -50
                    }, 700)
                })
                $(".advisor-unfold").animate({
                    width: 900,
                    height: 442,
                    bottom: 0,
                    right: 0
                }, 700)
                $("#advisor-form").on("submit", function (e) {
                    e.preventDefault();
                    if (!phoneReg.test($("#unfold-phone").val())) {
                        $(".advisor-unfold .input-error-tip").removeClass("hidden")
                        return;
                    } else {
                        $(".advisor-unfold .input-error-tip").addClass("hidden")
                    }
                    $.ajax({
                        url: contextPath + "/pages/toolbarAction/newUserLogin.json",
                        data: {
                            'phone': $("#unfold-phone").val()
                        },
                        dataType: "json",
                        success: function () {
                            window.location.href = contextPath + "/pages/onsale/match_car_list.html"
                        }
                    })
                })
            }
        }
    })
})();