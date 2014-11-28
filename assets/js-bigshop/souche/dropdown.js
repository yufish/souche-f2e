Souche.UI.CustomDropdown = function() {
    var select = function(id) {
        this.id = id;
        this.ele = typeof(id) != "string" ? $(id) : $("#" + this.id);
        this.init();
    };
    select.prototype = {
        init: function() {
            var self = this;
            var mouseOverStatus = 0;

            function checkShow() {
                var list = $(".sc-option-list", self.ele);
                if (mouseOverStatus) {
                    $(".sc-option-list").addClass("hidden");
                    $(".sc-option-list", self.ele).removeClass("hidden");

                    list.css({
                        top: 25
                    });
                    $(list[0].parentNode).css({
                        zIndex: Souche.Data.DropdownzIndex++
                    });

                } else {
                    $(".sc-option-list").addClass("hidden");
                    list.css({
                        top: 25
                    });
                }
            }
            $(document.body).click(function(e) {
                if (!$(e.target).closest(".sc-option").length) {
                    $(".sc-option-list", self.ele).addClass("hidden");
                    $(".sc-option-list").css({
                        top: 25
                    });
                }

            });
            $(".sc-option-hd", this.ele).click(function(e) {
                var list = $(".sc-option-list", self.ele);
                if ($(".sc-option-list", self.ele).hasClass("hidden")) {
                    $(".sc-option-list").addClass("hidden");
                    $(".sc-option-list", self.ele).removeClass("hidden");

                    list.css({
                        top: 25
                    });
                    $(list[0].parentNode).css({
                        zIndex: Souche.Data.DropdownzIndex++
                    });
                } else {
                    $(".sc-option-list").addClass("hidden");
                    list.css({
                        top: 25
                    });
                }

            });
            if ($(".sc-option-list li", this.ele).length > 10) {
                $(".sc-option-list", this.ele).css("height", 300);
            }

            // 自定义下拉select 当前只给点击操作启动
            // var openTimer, closeTimer;
            // $(this.ele).mouseenter(function() {
            //     mouseOverStatus = 1;
            //     clearTimeout(openTimer);
            //     clearTimeout(closeTimer);
            //     openTimer = setTimeout(function() {
            //         checkShow();
            //     }, 1000);

            // }).mouseleave(function() {
            //     mouseOverStatus = 0;
            //     clearTimeout(openTimer);
            //     clearTimeout(closeTimer);
            //     closeTimer = setTimeout(function() {
            //         checkShow();
            //     }, 500);
            // })

        }

    };
    return select;
}();

define(function() {
    return Souche.UI.CustomDropdown;
});