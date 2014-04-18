(function() {
    var tpl =
        "     <div class=\"advisor-unfold\">" +
        "        <div class=\"wrapper-bg\">" +
        "        <span class=\"advisor-close\"></span>" +
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
        " <input id = \"unfold-phone\" placeholder=\"输入你的手机号\" type=\"text\"/>" +
        "             <div class=\"input-error-wrapper clearfix\">" +
        "             <div class=\"input-error-tip hidden\"><span class=\"error-icon\"></span>请输入正确的手机号</div>" +
        "             </div>" +
        "             <input id=\"unfold-submit\" type=\"submit\"/>" +
        "          </form>" +
        "        </div>" +
        "        </div>" +
        "     </div>";
    var phoneReg = /^1[3458][0-9]{9}$/;
    $.ajax({
        url: contextPath + "/pages/toolbarAction/newUserTip.json",
        dataType: "json",
        success: function(data) {
            // if (code == 200) {
            $(document.body).append(tpl.replace("{{message}}", data.message))
            $(".advisor-unfold").animate({
                width: 820,
                height: 402
            })
            $("#advisor-form").on("submit", function(e) {
                e.preventDefault();
                if (!phoneReg.test($("#unfold-phone").val())) {
                    $(".advisor-unfold .input-error-tip").removeClass("hidden")
                    return;
                }
                $.ajax({
                    url: contextPath + "/pages/toolbarAction/newUserLogin.json",
                    dataType: "json",
                    success: function() {
                        window.location.href = contextPath + "/pages/onsale/match_car_list.html"
                    }
                })
            })
            // }
        }
    })
})();