Souche.UI.Select = function() {
    var select = function(id, _config) {
        this.id = id;
        this.ele = typeof (id) != "string" ? $(id) : $("#" + this.id);
        this.config = {
            isAutoDrop : true,
            maxDisplayItems : 10
        }
        $.extend(this.config, _config);
        this._init();
    };
    /**
     * 自定义事件：change
     */
    select.prototype = {

        _init : function() {
            var self = this;

            this._bindClick();
            this._bindSelect();
            $(".sc-select-list").css({
                height : this.config.maxDisplayItems * 30
            })
            if($(".sc-select-list li", this.ele).length > 10) {
                $(".sc-select-list", this.ele).css("height", 300);
            }
            $(document.body).live("click", function() {
                $(".sc-select-list", self.ele).addClass("hidden");
                $(".sc-select-list").css({
                    top : 25
                });
            });
        },
        addOption : function(key, value) {
            $(".sc-select-list", this.ele).append("<li><a href='#' data-value='" + key + "'>" + value + "</a></li>")
        },
        removeOption : function(key) {
            $(".sc-select-list li a", this.ele).each(function(i, a) {
                if($(a).attr("data-value") == key) {
                    a.parentNode.parentNode.removeChild(a.parentNode)
                }
            })
        },
        removeAllOption : function() {
            $(".sc-select-list", this.ele).html("")
        },
        _bindClick : function() {
            var self = this;
            $(".sc-select-hd", this.ele).click(function(e) {
                var list = $(".sc-select-list", self.ele);
                if($(".sc-select-list", self.ele).hasClass("hidden")) {
                    $(".sc-select-list").addClass("hidden");
                    $(".sc-select-list", self.ele).removeClass("hidden");
                    if(self.config.isAutoDrop) {
                        self._autoDrop(list);
                    }
                    $(list[0].parentNode).css({
                        zIndex : Souche.Data.DropdownzIndex++
                    });
                } else {
                    $(".sc-select-list").addClass("hidden");
                    list.css({
                        top : 25
                    });
                }

                e.stopPropagation();
            });

        },
        _bindSelect : function() {
            var self = this;
            $(".sc-select-list li a", this.ele).live("click", function(e) {
                e.preventDefault();
                var key = $(this).attr("data-value");
                var value = this.innerHTML;
                $(self).trigger("change", {
                    key : key,
                    value : value,
                    ele : this
                })
                $(".sc-select-content", self.ele).html(value)
                $(".selected_value", self.ele).val(key)
            })
        },
        _autoDrop : function(list) {
            var c = this.config
            //自适应滚屏,求实现，如果select被覆盖，自动缩短其高度
            // if(list.offset().top+list.height()>$(window).scrollTop()+$(window).height()){
            //   list.css({
            //     height:c.optionHeight-list.offset().top-list.height()+23
            //   });

            // }else{
            //   list.css({
            //     top:25
            //   });
            // }
        }
    };
    return select;
}();
$(document).ready(function() {
    $("*[data-ui='select']").each(function(i, ele) {
        $(ele).css({
            zIndex : 1000 - i
        });
        new Souche.UI.Select(ele);
    });
});

define(function() {
    return Souche.UI.Select;
});
