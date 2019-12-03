require.async("common:zepto", function($) {
    var fuc = {
        
        init:function() {
            this.bindEvent();
            this.regEvent();
        },
        bindEvent: function() {

            require.async('common:dialog',function(Dialog) {
                //实例化弹框组件
                var dialog = new Dialog({
                    dom: '#popThanks',
                    autoOpen: false,
                    title: "感谢您的祝福，一点心意不成敬意!",
                    width: '80%',
                    height: 'auto'
                });

                $(document).bind("popup_thanks_open", function(event) {
                    dialog.open();
                });

                $(document).bind('popup_thanks_close', function(){
                    dialog.close();
                    // window.location.reload();
                });

            });

            $(".btn_agreement").bind("tap", function(){
                $(document).trigger("popup_thanks_close");
                $(document).trigger("popup_agreement_open");
            });
            
        },
        regEvent: function(){
            //发送短信验证码
            $("#sendIdentifyCode").bind('tap',function(){
                var sendUrl = $("#sendMSURL").val(),
                    $send = $('#sendIdentifyCode');
                if(!$("#sendIdentifyCode").hasClass("disabled")){
                    if(fuc.validMobile()) {
                        $.ajax({
                            url: sendUrl,
                            type:"post",
                            data: {
                                mobile: $("#mobileInfo").val(),
                                bid: $("#bid").val(),
                                token: $("#token").val()
                            },
                            success: function(data) {
                                $send.attr("disabled","disabled").addClass("disabled");
                                if(data.status) {
                                    var SECOND = 60;
                                    (function(){
                                        if(SECOND){
                                            $send.attr("disabled", "disabled").addClass("disabled").text(SECOND-- + "秒后重新发送");
                                            setTimeout(arguments.callee, 1000);
                                        }else{
                                            $send.removeAttr("disabled").removeClass("disabled").text("免费发送验证码");
                                        }
                                    })();
                                } else {
                                    $send.removeAttr("disabled").removeClass("disabled");
                                    $(".text_warn").removeClass("hide");
                                    $(".text_warn span").text(data.errmsg);
                                }
                            }
                        })
                    }
                }
                
            });

            // 点击确认按钮
            $(".btn_reg").bind('tap', function(){
                var param = {
                        sMobile: $("#mobileInfo").val(),
                        sCode: $("#identifyCode").val(),
                        iBlessID: $("#blessId").val(),
                        openid: $("#openId").val(),
                        userId: $("#userId").val()
                    },
                    rewardUrl = $("#rewardUrl").val(),
                    $btnReg = $(".btn_reg"),
                    $btnSend = $(".btn_send_verify_code");

                if(fuc.validMobile() && fuc.validIdentifyCode()) {

                    $.ajax({
                        url: rewardUrl,
                        type:"post",
                        data: param,
                        success: function(data) {  
                            if(data.status) {
                                $btnReg.attr("disabled", "disabled").addClass("disabled");
                                var href = data.data['succUrl'],
                                    type = data.data['iType'],
                                    userId = data.data['userId'];
                                window.location.href = href+"?iType="+type + "&uId=" + userId;
                            } else {
                                $btnReg.removeAttr("disabled").removeClass("disabled");
                                $btnSend.removeAttr("disabled").removeClass("disabled").text("免费发送验证码");
                                $(".text_warn").removeClass("hide");
                                $(".text_warn span").text(data.errmsg);

                            }
                        }
                    })
                }



            });

        },
        validMobile: function(){
            var sMobile = $("#mobileInfo").val();
            if(!sMobile.match(/^((1[3-9][0-9])|200)[0-9]{8}$/g)) {
                this.setMobileInputError("请输入正确的手机号码");
            } else {
                this.setMobileInputSuccess();
                return true;
            }
        },
        validIdentifyCode: function(){
            var identifyCode = $("#identifyCode").val();
            if(identifyCode == "") {
                this.setsCaptchaInputError("请输入正确的验证码");
            } else {
                this.setsCaptchaInputSuccess();
                return true;
            }
        },
        setMobileInputSuccess: function() {
            $(".text_warn").addClass("hide");
            $(".text_warn span").text("");
        },
        setMobileInputError: function(msg) {
            $(".text_warn").removeClass("hide");
            $(".text_warn span").text(msg);
        },
        setsCaptchaInputSuccess: function() {
            $(".text_warn").addClass("hide");
            $(".text_warn span").text("");
        },
        setsCaptchaInputError: function(msg) {
            $(".text_warn").removeClass("hide");
            $(".text_warn span").text(msg);
        }
    }

    fuc.init();
});