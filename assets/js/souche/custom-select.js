Souche.UI.CustomSelect = function() {
    var e = function(e, t) {
        this.id = e, this.ele = $("string" != typeof e ? e : "#" + this.id), this.config = {
            isAutoDrop: !0,
            placeholder: "请选择品牌",
            multi: !0,
            listContainer: ".sc-select-list .sc-popup-bd"
        }, $.extend(this.config, t), this.selected = [], this._init(), this._defaultHeadHeight = 30, this._enable = !0
    };
    return $.extend(e.prototype, {
        addOptions: function(e) {
            $(this.config.listContainer, this.ele).append(e);
            for (var t = 0; t < this.selected.length; t++) $(".sc-select-list .option[data-value='" + this.selected[t].key + "']").addClass("active")
        },
        removeSelected: function(e) {
            this._delKey(e), this._renderSelected()
        },
        removeAllOption: function() {
            $(this.config.listContainer, this.ele).html("")
        },
        showOptions: function() {
            this._enable && ($(".sc-select-list", this.ele).removeClass("hidden"), this.ele.addClass("sc-active"), $(this).trigger("show"))
        },
        hideOptions: function() {
            $(".sc-select-list", this.ele).addClass("hidden"), this.ele.removeClass("sc-active"), $(this).trigger("hide")
        },
        disable: function(e) {
            $(".sc-select-content", this.ele).html("<span class='placeholder'>" + e + "</span>"), this._enable = !1
        },
        enable: function() {
            this._enable = !0, this._renderSelected()
        }
    }), $.extend(e.prototype, {
        _init: function(e) {
            var t = this;
            Souche.Util.mixin(this.config, e), this._defaultHeadHeight = $(".sc-select-hd").height(), $(".sc-selected-item", t.ele).each(function(e, s) {
                t.selected.push({
                    key: $(s).attr("data-value"),
                    value: $(s).text().replace("x", "")
                })
            }), $(document.body).on("click", function() {
                t.hideOptions()
            }), this._bindClick(), this._bindSelect(), this.config.multi ? this._renderSelected() : this._renderSingleSelected()
        },
        _bindClick: function() {
            var e = this;
            $(".sc-select-hd", this.ele).click(function(t) {
                var s = $(".sc-select-list", e.ele);
                $(".sc-select-list", e.ele).hasClass("hidden") ? ($(".sc-select-list").addClass("hidden"), e.showOptions(), $(".sc-select-list", e.ele).css({
                    top: $(".sc-select-hd", e.ele).height() + 2
                }), e.config.isAutoDrop && e._autoDrop(s), $(".sc-select-list", e.ele).scrollTop(0), $(s[0].parentNode).css({
                    zIndex: Souche.Data.DropdownzIndex++
                })) : (e.hideOptions(), s.css({
                    top: 30
                })), t.stopPropagation()
            })
        },
        _bindSelect: function() {
            var e = this;
            $(".sc-select-list", e.ele).on("click", "a.option", function(t) {
                t.preventDefault();
                var s = $(this).attr("data-value"),
                    l = $(".value", this).html(),
                    i = $(this);
                e.config.multi ? (i.hasClass("active") ? (e._delKey(s), i.removeClass("active"), $(e).trigger("unselect", {
                    key: s,
                    value: l
                })) : (e._addKey(s, l), i.addClass("active"), $(e).trigger("select", {
                    key: s,
                    value: l
                })), e._renderSelected()) : (e.selected = [{
                    key: s,
                    value: l
                }], e._renderSingleSelected()), $(e).trigger("change", {
                    key: s,
                    value: l
                }), t.stopPropagation()
            }), $(".sc-select-list", e.ele).on("click", function(e) {
                e.stopPropagation()
            }), $(".close", e.ele).on("click", function() {
                e.hideOptions()
            }), $(".sc-select-list", e.ele).on("scroll", function(e) {
                e.stopPropagation()
            })
        },
        _delKey: function(e) {
            for (var t = this, s = 0; s < t.selected.length; s++) {
                var l = t.selected[s];
                l && l.key == e && t.selected.splice(s, 1)
            }
        },
        _addKey: function(e, t) {
            for (var s = this, l = !1, i = 0; i < s.selected.length; i++) {
                var c = s.selected[i];
                c && c.key == e && (l = !0)
            }
            l || s.selected.push({
                key: e,
                value: t
            })
        },
        _renderSelected: function() {
            for (var e = this, t = [], s = 0; s < e.selected.length; s++) t.push(e.selected[s].key);
            $(".selected_values", e.ele).val(t.join(",")), $(".sc-select-content", e.ele).html("");
            for (var s = 0; s < e.selected.length; s++) {
                var t = e.selected[s];
                $(".sc-select-content", e.ele).append("<div class=sc-selected-item data-value='" + t.key + "'>" + t.value + "<i class=sc-close>x</i></div>")
            }
            $(".sc-selected-item", e.ele).on("click", function(t) {
                for (var s = $(this).attr("data-value"), l = 0; l < e.selected.length; l++) {
                    var i = e.selected[l];
                    i && i.key == s && e.selected.splice(l, 1)
                }
                $(e).trigger("unselect", {
                    key: s
                }), e._renderSelected(), $(".sc-select-list a.option[data-value='" + s + "']", e.ele).removeClass("active"), t.stopPropagation()
            }), e.selected.length || $(".sc-select-content", e.ele).html("<span class='placeholder'>" + e.config.placeholder + "</span>"), $(".sc-select-list", e.ele).css({
                top: $(".sc-select-hd", e.ele).height() + 2
            })
        },
        _renderSingleSelected: function() {
            for (var e = this, t = [], s = 0; s < e.selected.length; s++) t.push(e.selected[s].key);
            $(".selected_values", e.ele).val(t.join(",")), $(".sc-select-content", this.ele).html(this.selected.length ? this.selected[0].value : "<span class='placeholder'>" + this.config.placeholder + "</span>"), this.hideOptions()
        },
        _autoDrop: function() {
            this.config
        }
    }), e
}(), define(function() {
    return Souche.UI.CustomSelect
});