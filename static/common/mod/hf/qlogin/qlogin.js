var $ = require('../../ui/zepto/zepto.js');
var Dialog = require('../../ui/dialog/dialog.js');
var Tips = require('../../ui/tips/tips.js');

function Qlogin(opt){
    this.options = $.extend({
        dom: $(__inline('./qlogin.tpl')),
        sfrom: "",
        bid: "",
        memberDomain: "", //接口domain
        autoOpen: false, //是否实例化后立即打开
        showAgree: true,
        dialogWidth: "",
        dialogHeight: "",
        open: function() {},
        close: function() {},
        qloginCallback: function() {}
    }, opt || {});

    this.init();
}

Qlogin.prototype = {
    config: {
        getConfigUrl: "/v2/api/h5/user/widget/qconfig",
        sImgcaptchaUrl: "/v2/api/common/imgcaptcha",
        sendSmsUrl: "/v2/api/h5/user/widget/smscaptcha",
        sQloginUrl: "/v2/api/h5/user/widget/qlogin"
    },
    init: function() {
        this.options.dom.appendTo(document.body);
        this.getConfig();
    },

    getConfig: function() {
        var that = this;
        $.ajax({
            url: that.options.memberDomain + that.config.getConfigUrl,
            type: "get",
            data: {
                bid: that.options.bid,
                domain: window.location.protocol + "//" + window.location.host,
                crossdomain: 1
            },
            xhrFields: {
               withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                if(data.status) {
                    that.config.token = data.data._token;
                    that.config.showImgCaptcha = data.data.showImgCaptcha;
                    that.completeConfig();
                } else {
                    Tips.error("加载失败，请重新尝试！");
                }
            }
        })
    },

    completeConfig: function() {
        this.createDialog();
        !this.config.showImgCaptcha && $("#qLoginFrame .imgcaptcha").remove();
        this.options.autoOpen && $(document).trigger("qlogin_open");
        this.bindEvent();       
    },

    createDialog: function() {
        var that = this;
        that.dialog = new Dialog({
            dom: "#qLoginFrame",
            autoOpen: false,
            title: "",
            width: that.options.dialogWidth ? that.options.dialogWidth : 280,
            height: that.options.dialogHeight ? that.options.dialogHeight : (that.config.showImgCaptcha ? 330 : 260)
        });

        $(".ui-dialog-header").remove();

        $(document).bind("qlogin_open", function(event) {
            that.dialog.open();
        });

        $(document).bind("qlogin_close", function(event) {
            that.dialog.close();
        });
    },

    bindEvent: function() {
        var that = this;
        _bindInputFocus();
        _bindRefreshImg();
        $("#refreshImg").trigger("tap");
        _bindSendSms();
        _bindAgree();
        _bindSubmit();

        function _bindAgree() {
            if(that.options.showAgree) {
                $(".agree_check").show();
                $("#agreement").change(function(e) {
                    var dom = e.target;
                    if(!dom.checked) {
                        $("#submit").addClass("disabled");
                    } else {
                        $("#submit").removeClass("disabled");
                    }
                })
            } else {
                $(".agree_check").hide();
            }
        }

        function _bindInputFocus() {
            $("#qLoginFrame").delegate("input", "focus", function(e) {
                var dom = $(e.target);
                dom.removeClass("error").parent().next().removeClass("error");
                $("#serverStatus").removeClass("error");
            })
        }

        function _bindRefreshImg() {
            $("#refreshImg").bind("tap", function(e) {
                $.ajax({
                    url: that.options.memberDomain + that.config.sImgcaptchaUrl,
                    type:"get",
                    data: {
                        bid: 81,
                        version: "1.0",
                        crossdomain: 1
                    },
                    xhrFields: {
                       withCredentials: true
                    },
                    crossDomain: true,
                    success: function(data) {
                        if(data.status) {
                            $("#refreshImg").attr("src", data.data.captchaUrl);
                        } else {
                            $("#smscaptchaStatus").css("display", "none");
                            $("#serverStatus").text(data.errmsg).addClass("error");
                        }
                    }
                })              
            });
        }

        function _bindSendSms() {
            $("#sendSms").bind("tap", function(e) {
                if(!$("#sendSms").hasClass("disabled")) {
                    if(frontValid("mobile") && (that.config.showImgCaptcha ? frontValid("imgcaptcha") : true)) {
                        $.ajax({
                            url: that.options.memberDomain + that.config.sendSmsUrl,
                            type: "get",
                            data: {
                                mobile: $("#mobile").val(),
                                imgcaptcha: that.config.showImgCaptcha ? $("#imgcaptcha").val() : "",
                                bid: that.options.bid,
                                _token: that.config.token,
                                domain: window.location.protocol + "//" + window.location.host,
                                crossdomain: 1
                            },
                            xhrFields: {
                               withCredentials: true
                            },
                            crossDomain: true,
                            success: function(data) {
                                if(data.status) {
                                    that.config.token = data.data._token;
                                    var sec = 60;
                                    (function() {
                                        if(sec) {
                                            $("#sendSms").text("等待" + sec-- + "秒").removeClass("disabled").addClass("disabled");
                                            setTimeout(arguments.callee, 1000);
                                        } else {
                                            $("#sendSms").text("发送验证码").removeClass("disabled");
                                            $("#refreshImg").trigger("tap");
                                        }
                                    })();
                                } else {
                                    $("#smscaptchaStatus").css("display", "none");
                                    $("#serverStatus").text(data.errmsg).addClass("error");
                                }
                            }
                        })
                    }
                }
            });
        }

        function _bindSubmit() {
            $("#submit").bind("tap", function(e) {
                if(!$("#submit").hasClass("disabled")) {
                    if(frontValid("mobile") && (that.config.showImgCaptcha ? frontValid("imgcaptcha") : true) && frontValid("smscaptcha")) {
                        $("#submit").addClass("disabled").text("正在提交");
                        $.ajax({
                            url: that.options.memberDomain + that.config.sQloginUrl,
                            type: "get",
                            data: {
                                mobile: $("#mobile").val(),
                                smscaptcha: $("#smscaptcha").val(),
                                bid: that.options.bid,
                                _token: that.config.token,
                                sfrom: that.options.sfrom,
                                crossdomain: 1
                            },
                            xhrFields: {
                               withCredentials: true
                            },
                            crossDomain: true,
                            success: function(data) {
                                $("#submit").removeClass("disabled").text("提交");
                                if(data.status) {
                                    if(that.options.qloginCallback) {
                                        that.options.qloginCallback.call(window, that.dialog, data.data);
                                    } else {
                                        window.location.reload();
                                    }
                                } else {
                                    $("#smscaptchaStatus").css("display", "none");
                                    $("#serverStatus").text(data.errmsg).addClass("error");
                                }
                            }
                        })                      
                    }
                }
            })
        }
        function frontValid(dom) {
            if($("#" + dom).val() && (dom == "mobile" ? !!$("#" + dom).val().match(/^1\d{10}$/) : true)) {
                $("#" + dom + "Status").removeClass("error");
                $("#" + dom).removeClass("error");
                return true;
            } else {
                $("#" + dom + "Status").addClass("error");
                $("#" + dom).addClass("error");
                return false;
            }
        }
    },

    open: function() {
        $(document).trigger("qlogin_open");
    },

    close: function() {
        $(document).trigger("qlogin_close");
    }
}

return Qlogin;