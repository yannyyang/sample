/**
 * dropload
 */
var $ = Zepto = require('common:ui/zepto');
!
function(a) {
        "use strict";
        function e(a) {
                a.touches || (a.touches = a.originalEvent.touches)
        }
        function f(a, d) {
                d._startY = a.touches[0].pageY,
                d.opts.scrollArea == window ? (d._meHeight = b.height(), d._childrenHeight = c.height()) : (d._meHeight = d.$element.height(), d._childrenHeight = d.$element.children().height()),
                d._scrollTop = d.$scrollArea.scrollTop()
        }
        function g(b, c) {
                c._curY = b.touches[0].pageY,
                c._moveY = c._curY - c._startY,
                c._moveY > 0 ? c.direction = "down": c._moveY < 0 && (c.direction = "up");
                var d = Math.abs(c._moveY);
                "" != c.opts.loadUpFn && c._scrollTop <= 0 && "down" == c.direction && (b.preventDefault(), c.insertDOM || (c.$element.prepend('<div class="' + c.opts.domUp.domClass + '"></div>'), c.insertDOM = !0), c.$domUp = a("." + c.opts.domUp.domClass), j(c.$domUp, 0), d <= c.opts.distance ? (c._offsetY = d, c.$domUp.html("").append(c.opts.domUp.domRefresh)) : d > c.opts.distance && d <= 2 * c.opts.distance ? (c._offsetY = c.opts.distance + .5 * (d - c.opts.distance), c.$domUp.html("").append(c.opts.domUp.domUpdate)) : c._offsetY = c.opts.distance + .5 * c.opts.distance + .2 * (d - 2 * c.opts.distance), c.$domUp.css({
                        height: c._offsetY
                })),
                "" != c.opts.loadDownFn && c._childrenHeight <= c._meHeight + c._scrollTop && "up" == c.direction && (b.preventDefault(), c.insertDOM || (c.$element.append('<div class="' + c.opts.domDown.domClass + '"></div>'), c.insertDOM = !0), c.$domDown = a("." + c.opts.domDown.domClass), j(c.$domDown, 0), d <= c.opts.distance ? (c._offsetY = d, c.$domDown.html("").append(c.opts.domDown.domRefresh)) : d > c.opts.distance && d <= 2 * c.opts.distance ? (c._offsetY = c.opts.distance + .5 * (d - c.opts.distance), c.$domDown.html("").append(c.opts.domDown.domUpdate)) : c._offsetY = c.opts.distance + .5 * c.opts.distance + .2 * (d - 2 * c.opts.distance), c.$domDown.css({
                        height: c._offsetY
                }), c.$scrollArea.scrollTop(c._offsetY + c._scrollTop))
        }
        function h(b) {
                var c = Math.abs(b._moveY);
                b.insertDOM && ("down" == b.direction ? (b.$domResult = b.$domUp, b.domLoad = b.opts.domUp.domLoad) : "up" == b.direction && (b.$domResult = b.$domDown, b.domLoad = b.opts.domDown.domLoad), j(b.$domResult, 300), c > b.opts.distance ? (b.$domResult.css({
                        height: b.$domResult.children().height()
                }), b.$domResult.html("").append(b.domLoad), i(b)) : b.$domResult.css({
                        height: "0"
                }).on("webkitTransitionEnd",
                function() {
                        b.insertDOM = !1,
                        a(this).remove()
                }), b._moveY = 0)
        }
        function i(a) {
                a.loading = !0,
                "" != a.opts.loadUpFn && "down" == a.direction ? a.opts.loadUpFn(a) : "" != a.opts.loadDownFn && "up" == a.direction && a.opts.loadDownFn(a)
        }
        function j(a, b) {
                a.css({
                        "-webkit-transition": "all " + b + "ms",
                        transition: "all " + b + "ms"
                })
        }
        var d, b = a(window),
        c = a(document);
        a.fn.dropload = function(a) {
                return new d(this, a)
        },
        d = function(b, c) {
                var d = this;
                d.$element = a(b),
                d.insertDOM = !1,
                d.loading = !1,
                d.isLock = !1,
                d.init(c)
        },
        d.prototype.init = function(c) {
                var d = this;
                d.opts = a.extend({},
                {
                        scrollArea: d.$element,
                        domUp: {
                                domClass: "dropload-up",
                                domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
                                domUpdate: '<div class="dropload-update">↑释放更新</div>',
                                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
                        },
                        domDown: {
                                domClass: "dropload-down",
                                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                                domUpdate: '<div class="dropload-update">↓释放加载</div>',
                                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div><div id="loading"></div>',
                                domNoData: '<div class="dropload-noData">暂无数据</div>'

                        },
                        distance: 50,
                        loadUpFn: "",
                        loadDownFn: ""
                },
                c),
                d.$scrollArea = d.opts.scrollArea == window ? b: d.opts.scrollArea,
                d.$element.on("touchstart",
                function(a) {
                        d.loading || d.isLock || (e(a), f(a, d))
                }),
                d.$element.on("touchmove",
                function(a) {
                        d.loading || d.isLock || (e(a, d), g(a, d))
                }),
                d.$element.on("touchend",
                function() {
                        d.loading || d.isLock || h(d)
                })
        },
        d.prototype.lock = function() {
                var a = this;
                a.isLock = !0
        },
        d.prototype.unlock = function() {
                var a = this;
                a.isLock = !1
        },
        d.prototype.noData = function() {
                var a = this;
                a.isData = !0
        },
        d.prototype.resetload = function() {
                var b = this;
                b.$domResult && b.$domResult.css({
                        height: "0"
                }).on("webkitTransitionEnd",
                function() {
                        b.loading = !1,
                        b.insertDOM = !1,
                        a(this).remove()
                })
        }
} (window.Zepto || window.jQuery);