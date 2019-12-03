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
                    dom: '#popReg',
                    autoOpen: false,
                    title: "活动报名信息",
                    width: '80%',
                    height: 'auto'
                });

                $(document).bind("popup_reg_open", function(event) {
                    dialog.open();
                });

                $(document).bind('popup_reg_close', function(){
                    dialog.close();
                });


            });
        },
        regEvent: function(){
            //发送短信验证码
            $("#sendIdentifyCode").bind('tap',function(){
                var sendUrl = $("#sendMSURL").val(),
                    $send = $('#sendIdentifyCode'),
                    $btnReg = $(".btn_reg");
                if(!$("#sendIdentifyCode").hasClass("disabled")){
                    if(fuc.validName() && fuc.validMobile()) {
                        $.ajax({
                            url: sendUrl,
                            type:"post",
                            data: {
                                mobile: $("#mobileInfo").val(),
                                bid: $("#bid").val(),
                                token: $("#token").val()
                            },
                            success: function(data) {
                                console.log(data);
                                $("#sendIdentifyCode").addClass("disabled");
                                if(data.status) {
                                    var SECOND = 60;
                                    // fuc.setMobileInputSuccess();
                                    (function(){
                                        if(SECOND){
                                            $send.addClass("disabled").text(SECOND-- + "秒后重新发送");
                                            // $btnReg.attr("disabled","disabled").addClass("btn_sended");
                                            setTimeout(arguments.callee, 1000);
                                        }else{
                                            $send.removeClass("disabled").text("免费发送验证码");
                                            // $btnReg.removeAttr("disabled").removeClass("disabled");
                                        }
                                    })();
                                } else {
                                    // $btnReg.removeAttr("disabled").removeClass("disabled");
                                    $send.removeClass("disabled");
                                    alert(data.errmsg);
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
                        sUserName: $("#name").val(),
                        sMobile: $("#mobileInfo").val(),
                        sCode: $("#identifyCode").val(),
                        iHouseID: $("#houseId").val(),
                        openid: $("#openId").val()
                    },
                    regUrl = $("#regUrl").val(),
                    $btnReg = $(".btn_reg");

                if(fuc.validName() && fuc.validMobile() && fuc.validIdentifyCode()) {
                    $.ajax({
                        url: regUrl,
                        type:"post",
                        data: param,
                        success: function(data) {                           
                            if(data.status) {
                                $btnReg.attr("disabled", "disabled").addClass("disabled");
                                var href= data.data['homeUrl'] + "?detailtype=1";
                                // console.log(href);
                                window.location.href = href;
                            } else {
                                $(".text_warn").removeClass("hide");
                                $(".text_warn span").text(data.errmsg);
                                // if(data.sErrCode == "pension_mobile_used"){
                                //     var href= data.aData['url'];
                                //     window.location.href = href;
                                //     console.log(data);
                                // } else{
                                //     $("#identifyCodeValidInfo").addClass('visible').text(data.aErrInfo);
                                // }

                            }
                        }
                    })
                }



            });

        },
        validName: function(){
            var sName = $("#name").val();
            // if(sName == "") {
            //     this.setNameInputError("请输入预约人姓名");
            // } else {
            //     this.setNameInputSuccess();
            //     return true;
            // }

            // if(sName.match(/[u4e00-u9fa5]/g)){
            //     this.setNameInputError("请输入预约人姓名");
            //     // nameState = false;
            // }else{
            //     this.setNameInputSuccess();
            //     // nameState = true; 
            //     return true;             
            // }

            if(sName != ""){ //[\u4e00-\u9fa5]
                if(sName.match(/[u4e00-u9fa5]/g)){
                    this.setNameInputError("请输入中文姓名");
                    // nameState = false;
                }else{
                    if(sName.length>5){
                        this.setNameInputError("请输入正确的中文姓名");
                    }else{
                        this.setNameInputSuccess();
                        return true;
                    }
                                  
                }
            }else{
                this.setNameInputError("请输入预约人姓名");
                // nameState = false;
            }


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
        setNameInputSuccess: function() {
            $(".text_warn").addClass("hide");
            $(".text_warn span").text("");
            // $(".text_warn").removeClass("visible").text("");
        },
        setNameInputError: function(msg) {
            $(".text_warn").removeClass("hide");
            $(".text_warn span").text(msg);
            // $("#mobileValidInfo").addClass("visible").text(msg);
        },
        setMobileInputSuccess: function() {
            $(".text_warn").addClass("hide");
            $(".text_warn span").text("");
            // $(".text_warn").removeClass("visible").text("");
        },
        setMobileInputError: function(msg) {
            $(".text_warn").removeClass("hide");
            $(".text_warn span").text(msg);
            // $("#mobileValidInfo").addClass("visible").text(msg);
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