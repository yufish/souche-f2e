define("contrast/carContrast", [], function() {
    var e = {},
        t = {},
        n = {},
        r = 4,
        i = [],
        s = !1,
        o = '<th width=\'\' class=\'title carname\'><div style="width:239px"><a></a><i class=\'close-contrast hidden\'></i><span class=\'more-detail\'></span></div></th><td class=\'pic\'><div style="width:240px"></div></td><td class=\'price-s\'><div style="width:240px"></div></td><td class=\'price-n\'><div style="width:240px"></div></td><td class=\'price-v\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td width=\'\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td width=\'\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td width=\'\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td width=\'\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td width=\'\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td width=\'\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td width=\'\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td width=\'\'><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td><td><div style="width:240px"></div></td>',
        u = function() {
            $(".close-contrast").live("click", function(e) {
                var n = $(this).parent(),
                    r = n.index();
                return n.deleteContent = h, $.ajax({
                    type: "POST",
                    url: t.api_deleteContrast,
                    data: {
                        cid: $(this).attr("cid")
                    },
                    dataType: "json",
                    context: n
                }).done(function(e) {
                    e.result == 2 && (this.deleteContent(this.parent().index()), delete n.deleteContent)
                }), e.stopPropagation(), !1
            });
            var e = !1,
                n, s, u, f = $(".contrast-table").offset().top,
                l = $(".contrast-table").offset().left,
                p = $(".carname").width(),
                d = $(".carname").height(),
                v = $(".carname").offset().left,
                m = v,
                g = $(".car-title").offset().left + $(".car-title").width(),
                b = $(".carname").offset().top,
                w = $(".carname").offset().top + $(".carname").height(),
                E, S, T;
            E = [], $(".more-detail").live("mousedown", function(t) {
                t.stopPropagation(), t.preventDefault(), n = t.pageX, s = t.pageY, e = !0, u = $(this).parent().parent().clone(), u.css({
                    opacity: .8,
                    position: "absolute",
                    cursor: "pointer",
                    top: t.pageY - 20 + "px",
                    left: t.pageX - 100 + "px"
                }), document.body.appendChild(u[0]), document.body.onselectstart = document.body.ondrag = function() {
                    return !1
                }, E = [];
                for (var i = 0; i <= r; i++) E.push(v + i * p - $(document).scrollLeft());
                T = $(this).parent().parent().index();
                if (T == 0) return;
                for (var i = 0; i < E.length; i++) t.pageX < E[i] + p && t.pageX > E[i] && S !== i && (S = i);
                return !1
            }), $(window).scroll(function(e) {
                var t = $(document).scrollTop();
                t > f + $(".car-title").height() ? $(".contrast-table .basic-info:eq(0)").css({
                    position: "fixed",
                    top: "0px",
                    backgroundColor: "white"
                }) : $(".contrast-table .basic-info:eq(0)").css({
                    position: "",
                    top: "",
                    left: "",
                    backgroundColor: "white"
                }), $(".contrast-table .basic-info:eq(0)").css("left", l - $(document).scrollLeft())
            }), $(document).mousemove(function(t) {
                if (e) {
                    y = t.pageY, x = t.pageX;
                    if (x < g && x > v) {
                        u.css({
                            top: y - 20 + "px",
                            left: x - 100 + "px"
                        });
                        for (var n = 0; n < E.length; n++) x - $(document).scrollLeft() < E[n] + p && x - $(document).scrollLeft() > E[n] && S != n && n != T - 1 && n <= r && (S = n, $(".tempalte").remove(), S !== T && c($(o), S, !0))
                    }
                }
            }), $(document).mouseup(function() {
                if (e) {
                    u.remove(), e = !1;
                    if ($(".tempalte").length != 0) {
                        $(".tempalte").remove(), document.body.onselectstart = document.body.ondrag = null;
                        var n = $(".carname"),
                            r = n.length;
                        if (T === 0) return;
                        var s = a(T);
                        c(s, S, !1), i = [];
                        for (var o = 0; o < $(".close-contrast").length; o++) i.push($(".close-contrast").eq(o).attr("cid"));
                        i = i.toString(), $.ajax({
                            type: "POST",
                            url: t.api_updateContrastSeq,
                            data: {
                                ids: i
                            },
                            dataType: "json",
                            context: self
                        }).done(function(e) {})
                    }
                }
            }), $(".contrast-title input").change(function() {
                var e, n, n = $(".contrast-title input")[0].checked.toString(),
                    e = $(".contrast-title input")[1].checked.toString();
                window.location = t.api_contrastUrl + "?repeat=" + n + "&optimal=" + e
            }), $(".carname a").live("mouseenter", function() {
                $(this).addClass("carNameHover")
            }).live("mouseout", function() {
                $(this).removeClass("carNameHover")
            })
        },
        a = function(e) {
            var t = $(),
                e = e;
            return $("table tr").each(function(n, r) {
                if ($(r).find("td,th").length != 0) {
                    var i = $(r).children()[e];
                    t.push(i)
                }
            }), t
        },
        f = function(e) {
            var t = e.find("a");
            if (t.length != 0) return {
                content: t.text(),
                type: "a"
            };
            var n = e.find("span");
            if (n.length != 0) return {
                content: n.text(),
                type: "span"
            };
            var r = e.find("img");
            return r.length != 0 ? {
                content: r,
                type: "img"
            } : {
                content: e.text(),
                type: ""
            }
        },
        l = function(e, t) {
            if (t)
                if (t.type === "img") {
                    var n = e.find(t.type);
                    n.length != 0 ? e.find(t.type).attr("src", t.content.attr("src")) : e.html("<img src='" + t.content.attr("src") + "' width='215px' height='1240px'>")
                } else t.type === "a" || t.type === "span" ? e.find(t.type).text(t.content) : e.text("");
            else {
                var r = f(e).type;
                r === "img" ? e.find(r).remove() : r === "a" || r === "span" ? e.find(r).text("") : e.text("")
            }
        },
        c = function(e, t, n) {
            var r = t,
                i = 0;
            t != undefined ? $("table tr").each(function(t, s) {
                $(s).find("td,th").length != 0 && (n ? ($(s).find(".tempalte").remove(), $(e[i]).addClass("tempalte"), $(s.children[r]).after($(e[i]))) : $(s.children[r]).after($(e[i])), i++)
            }) : $("table tr").each(function(t, n) {
                $(n).find("td,th").length != 0 && $(n).find("td,th").length != 0 && $(n).append($(e[i++]))
            })
        },
        h = function(e) {
            var t = a(e);
            t.remove(), r--, $(".table-name").width($(".basic-info").width() - 17)
        },
        p = function(e) {
            $.extend(t, e), r = t.carNum, $(".table-name").width($(".basic-info").width() - 17), u()
        };
    return e.init = p, e
});