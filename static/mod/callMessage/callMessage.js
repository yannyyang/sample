var $ = require('common:ui/zepto');
var Tips = require('common:ui/tips');

function CallMessage(opt){
    this.options = $.extend({
        dom: $(__inline('./callMessage.tpl')),
        sfrom: "",
        bid: "",
        memberDomain: "", //接口domain
        autoOpen: false, //是否实例化后立即打开
        open: function() {},
        close: function() {},
        qloginCallback: function() {}
    }, opt || {});
    this.init();
}

CallMessage.prototype = {
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
    //获取基本信息
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
        var that = this;
        !this.config.showImgCaptcha && $("#qLoginFrame .J_imgcaptcha").remove();
        var qLoginFrame = $("#qLoginFrame");
        $(document).bind("qlogin_open", function(event) {
            qLoginFrame.css("display", "block");
        });
        $(document).bind("qlogin_close", function(event) {
            qLoginFrame.remove();
        });
        this.options.autoOpen && $(document).trigger("qlogin_open");

        this.bindEvent();       
    },

    //绑定事件
    bindEvent: function() {
        var that = this;

        function wrongTip (txt){
            var txt = (txt == "") ? "" : "<span>"+ txt +"</span>";
            $("#loginWrongTip").html(txt);
        }

        //右上角关闭按钮
        $("#loginClose").on("click", function(){
            $(document).trigger("qlogin_close");
            window.location.reload();
        });

        //刷图形验证码
        $("#refreshImg").on("click", function() {
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
                        wrongTip(data.errmsg);
                    }
                }
            })
        });
        $("#refreshImg").trigger("click");

        //格式验证
        function formatYz (){
            //判断手机号
            var mobile = $.trim($("#loginMobile").val());
            if (mobile == "") {
                wrongTip("请输入手机号码！");
                return false;
            }
            var formatMobile = /^1\d{10}$/.test(mobile);
            if (!formatMobile) {
                wrongTip("手机号码格式不正确！");
                return false;
            }

            //判断图形验证码
            if (that.config.showImgCaptcha) {
                var loginImgYzm = $.trim($("#loginImgYzm").val());
                if (loginImgYzm == "") {
                    wrongTip("请输入图形验证码！");
                    return false;
                }
            }
            wrongTip("");
            return true;
        }

        //发送短信
        $("#sendSms").bind("click", function(e) {

            var formatResult = formatYz();
            if (!formatResult) return;

            $.ajax({
                url: that.options.memberDomain + that.config.sendSmsUrl,
                type: "get",
                data: {
                    mobile: $("#loginMobile").val(),
                    imgcaptcha: that.config.showImgCaptcha ? $("#loginImgYzm").val() : "",
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
                                $("#sendSms").text("等待" + sec-- + "秒").attr("disabled", true);
                                setTimeout(arguments.callee, 1000);
                            } else {
                                $("#sendSms").text("发送验证码").removeAttr("disabled");
                                $("#refreshImg").trigger("click");
                            }
                        })();
                    } else {
                        wrongTip(data.errmsg);
                    }
                }
            })
        });

        //登陆提交
        $("#loginSubmit").on("click", function(event) {
            var formatResult = formatYz();
            if (!formatResult) return;

            //判断短信验证码
            var loginSms = $.trim($("#loginSms").val());
            if (loginSms == "") {
                wrongTip("请输入短信验证码！");
                return false;
            }
            wrongTip("");

            $(this).attr("disabled", true).text("正在提交");
            $.ajax({
                url: that.options.memberDomain + that.config.sQloginUrl,
                type: "get",
                data: {
                    mobile: $("#loginMobile").val(),
                    smscaptcha: loginSms,
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
                    if(data.status) {
                        $(document).trigger("qlogin_close");
                        if(that.options.qloginCallback) {
                            that.options.qloginCallback.call(window, that, data.data);
                        } else {
                            window.location.reload();
                        }
                    } else {
                        wrongTip(data.errmsg);
                    }
                },
                complete: function(){
                    $("#loginSubmit").removeAttr("disabled").text("登录");
                }
            })
        })

    },

    open: function() {
        $(document).trigger("qlogin_open");
    },

    close: function() {
        $(document).trigger("qlogin_close");
    }
}

return CallMessage;