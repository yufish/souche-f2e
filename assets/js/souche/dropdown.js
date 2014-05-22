Souche.UI.CustomDropdown = function() {
    var select = function(id) {
        this.id = id;
        this.ele = typeof(id) != "string" ? $(id) : $("#" + this.id);
        this.init();
    };
    select.prototype = {
        init: function() {
            var self = this;
            $(".sc-option-hd", this.ele).click(function(e) {
                var list = $(".sc-option-list", self.ele);
                if ($(".sc-option-list", self.ele).hasClass("hidden")) {
                    $(".sc-option-list").addClass("hidden");
                    $(".sc-option-list", self.ele).removeClass("hidden");
                    if (list.offset().top + list.height() > $(window).scrollTop() + $(window).height()) {
                        list.css({
                            top: $(window).scrollTop() + $(window).height() - list.offset().top - list.height() + 23
                        });

                    } else {
                        list.css({
                            top: 30
                        });
                    }
                    $(list[0].parentNode).css({
                        zIndex: Souche.Data.DropdownzIndex++
                    });
                } else {
                    $(".sc-option-list").addClass("hidden");
                    list.css({
                        top: 30
                    });
                }

                e.stopPropagation();
            });
            if ($(".sc-option-list li", this.ele).length > 10) {
                $(".sc-option-list", this.ele).css("height", 300);
            }
            $(document.body).click(function() {
                $(".sc-option-list", self.ele).addClass("hidden");
                $(".sc-option-list").css({
                    top: 30
                });
            });
        }
    };
    return select;
}();

define(function() {
    return Souche.UI.CustomDropdown;
});