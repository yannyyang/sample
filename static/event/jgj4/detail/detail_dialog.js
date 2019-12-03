require.async(['common:ui/zepto/zepto.js'],function($){
    var applyApi = pageConfig.applyApi,
        sName,sMobile,sNum,iLineID;
    var html = '<div class="ApplyTextBg">'
            +'<div class="applySucceed ApplyText">'
            +'<span class="close"></span>'
                +'<div class="ApplyImg">'
                +'</div>'
                +'<p class="succeedAlert">报名成功，稍后相关客服会和你联系</p>'
                +'<div class="kfApply" style="margin-top:0;">'
                    +'<span class="applyOk">'
                        +'知道了'
                    +'</span>'
                +'</div>'
            +'</div>'
        +'<div class="ApplyText applyshow">'
            +'<!-- 头部tit -->'
            +'<div class="ApplyTextTit">'
                +'<h2></h2>'
                // +'<p class="sTitle">7-20看房团</p>'
                +'<span class="close"></span>'
            +'</div>'
            +'<!-- 表单部分 -->'
            +'<div class="ApplyTextForm">'
                +'<div class="group">'
                    // +'<label for="user">真实姓名</label>'
                    +'<span class="user-name">'
                    +'</span>'
                    +'<input type="text" id="userName" placeholder="请输入姓名">'
                    +'<span class="not_name">未填写姓名'
                    +'</span>'
                +'</div>'
                +'<div class="group">'
                    // +'<label for="phone">手机号码</label>'
                    +'<span class="user-name user-mob">'
                    +'</span>'
                    +'<input type="text" id="userPhoneNum" placeholder="请输入手机号">'
                    +'<span class="not_mob">未填写手机号码'
                    +'</span>'
                +'</div>'
                +'<div class="group">'
                    +'<span class="user-name user-add">'
                    +'</span>'
                    +'<div class="select_copy">'
                    +'</div>'
                    +'<select class="select" id="userNum">'
                        +'<option class="opt" value="" selected="selected" >请填写看房人数</option>'
                        +'<option class="opt" value="1">1</option>'
                        +'<option class="opt" value="2">2</option>'
                        +'<option class="opt" value="3">3</option>'
                        +'<option class="opt" value="4">4</option>'
                        +'<option class="opt" value="5">5</option>'
                        +'<option class="opt" value="6">6</option>'
                        +'<option class="opt" value="7">7</option>'
                        +'<option class="opt" value="8">8</option>'
                        +'<option class="opt" value="9">9</option>'
                    +'</select>'
                    +'<span class="not_num">请填写看房人数'
                    +'</span>'
                +'</div>'
                +'<div class="group group_code">'
                    // +'<label for="phone">手机号码</label>'
                    +'<span class="user-name user-code">'
                    +'</span>'
                    +'<input type="text" id="userCode" placeholder="请输入验证码">'
                    +'<a href="javascript:;" class="kft_send_code" id="kftSendcode" >获取验证码</a>'
                    +'<span class="not_code">验证码错误'
                    +'</span>'
                +'</div>'
                // +'<p class= "kferr_box">'
                //     +'<span class="kferr"></span>'
                // +'</p>'
                +'<div class="angent_text">'
                    +'<a href="#" class="angent_img">'
                    +'<input type="checkbox" checked="checked"/>'
                    +'</a>'
                    +'<p>我已经阅读并同意<a href="#" class="agreemen_text">《好房看房团活动声明》</a>'
                        +'<span class="angerr_ware">请同意《好房看房团活动声明》！'
                        +'</span>'
                    +'</p>'
                +'</div>'
                +'<div class="kfApply" style="margin-top:0;">'
                    +'<span class="applySub">'
                        +'立即报名'
                    +'</span>'
                +'</div>'
            +'</div>'
        +'</div>'
    +'</div>';
    $('body').append(html);

    /*弹框关闭按钮*/
    $(document).on('click','.close',function (event){
        event.stopPropagation();
        $('.ApplyTextBg').hide();
        $('#userName,#userPhoneNum,#userNum').val('');
        //$('.kferr').html('');
        $('.not_mob,.not_name').hide();
        //$('.kferr_box').css('visibility','hidden');
        if ($('.applySucceed').is(":hidden")) {
            $('.applySucceed').hide();
            $('.applyshow').show();
        };
    })
    /*$(window).scroll(function () {
        $('.ApplyTextBg').css({
            'top':$(this).scrollTop()
        })
        var top = parseInt($('.ApplyTextBg').css('top'));
        if (top > $(document).height() - $(this).height()) {
            top = $(document).height() - $(this).height();
            $('.ApplyTextBg').css('top',top);
        };
        
    });*/
    /* 阅读协议*/
    $('body').on('click','.angent_img',function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('.angerr_ware').hide();
        }else{
            $(this).addClass('active');
        }
    })
    /*单击确定*/
    $('body').on('click','.applyOk',function (){
        $('.applyOk').html('知道了');
        $('.applySucceed,.ApplyTextBg').hide();
        $('.applyshow').show();
    })

    var time = setInterval(function (){
        if ($('.Common').height() > 100) {
            clearInterval(time);
            // $('.ApplyTextBg').height($('body').height());
            $('.ApplyText').css('top',$(window).height()/2);
        };
    },30);

    /*获取验证码*/
    $('body').on('click','.kft_send_code',function(){
        var flag_num=true;
        var userName,userPhoneNum,userNum,iLineID;
        userName = $('#userName').val().trim();
        userPhoneNum = $('#userPhoneNum').val().trim();
        userNum = $('#userNum').val();
        iLineID = $('.applySub').attr('data_id');
        if($('.angent_img input').is(':checked')){
            if (!/^[\u4e00-\u9fa5a-zA-Z]{1,10}$/.test(userName) || userName == '') {
            $('.not_name').show();
            //$('.kferr_box').css('visibility','visible');
            }else if(!/^1[3|4|5|7|8]\d{9}$/.test(userPhoneNum) || userPhoneNum == '') {
                $('.not_mob').show();
                //$('.kferr_box').css('visibility','visible');
            }else if(userNum == ''){
                $('.not_num').show();
            }else{
                if(!$(this).hasClass('.kft_send_code')){
                    if(flag_num){
                        $.ajax({
                                url:pageConfig.sendCodeUrl,
                                type:'post',
                                data:{
                                    'sMobile': userPhoneNum,
                                    'iLoupanID': iLineID, //此看房团发送验证码传的参数是线路ID
                                    'sType':4
                                },
                                dataType:'json',
                                success:function(data){
                                    // console.log(data);
                                    if(!data.hasError){
                                        var SECOND = 120;
                                        var $send = $("#kftSendcode");
                                        //120秒
                                        (function(){
                                            if(SECOND){
                                                 $send.attr("disabled", "disabled").removeClass().addClass("kft_send_code").text("重新发送("+SECOND--+"秒)");
                                                timer=setTimeout(arguments.callee, 1000);
                                            }else{
                                                $send.removeAttr("disabled").removeClass().text("获取验证码").addClass("kft_send_code");
                                            } 
                                        })();
                                    }else{
                                    $('.not_code').html(data.error);
                                    $('.not_code').css('visibility','visible');
                                    };
                                }
                             });
                        };
                    };
                }
            }else{
                $(".angerr_ware").show();
        }
    });
    //点击报名
    $('body').on('click','.applySub',function (){
        var flag_code=true;
        var userName,userPhoneNum,userNum,iLineID ,userCode;
        userName = $('#userName').val().trim();
        userPhoneNum = $('#userPhoneNum').val().trim();
        userNum = $('#userNum').val();
        userCode = $('#userCode').val();
        iLineID = $(this).attr('data_id');
        var aa = globalLog.getArgusObj();
        bb = $.extend(aa, {"self_event_type": "CLICK_KFTBM","el_data":{mbl: userPhoneNum}});
        globalLog.send(bb);
        // if($('.angent_img input').is(':checked')){
        //     if (!/^[\u4e00-\u9fa5a-zA-Z]{1,10}$/.test(userName) || userName == '') {
        //     $('.not_name').show();
        //     //$('.kferr_box').css('visibility','visible');
        //     }else if(!/^1[3|4|5|7|8]\d{9}$/.test(userPhoneNum) || userPhoneNum == '') {
        //         $('.not_mob').show();
        //         //$('.kferr_box').css('visibility','visible');
        //     }else if(userNum == ''){
        //         $('.not_num').show();
        //     }else{
        //         if(!$('.applySub').hasClass('disabled')){
        //             ajaxApplyApi(applyApi,userName,userPhoneNum,userNum,iLineID);
        //             $('.applySub').addClass('disabled');        
        //         }

        //     }
        // }else{
        //     $(".angerr_ware").show();
        // }
        if( /^\d{6}$/.test(userCode)){//验证校验码
            flag_code=true;
            $('.not_code').css('visibility','hidden');
        }else{
            flag_code=false;
        };

        if(!flag_code){
            $('.not_code').html('<i></i>请输入正确的验证码');
            $('.not_code').css('visibility','visible');
            return;
        }else{
            $('.not_code').css('visibility','hidden');
            if(!$('.applySub').hasClass('disabled')){
                ajaxApplyApi(applyApi,userName,userPhoneNum,userNum,iLineID,userCode);
                $('.applySub').addClass('disabled');
            }        
        }

    });
})


function ajaxApplyApi(url,name,mobile,num,id,code){
    $('.loadingBox').show();
    $.ajax({
        type: "post",
        url: url,
        data: {
            'sName':name,
            'sMobile':mobile,
            'iLineID':id,
            'iPeopleNum':num,
            'sSmsCode':code,
            'sType':4,
        },
        dataType: "json",
        success: function(data){
            // console.log(data);
            $('.applySub').removeClass('disabled');
            $('.loadingBox').hide();
            if (data.iStatus == 0) {
                $('.ApplyImg').removeClass('kft_chenggong_img').addClass('kft_shibai_img');
                $('.applySucceed').show();
                $('.succeedAlert').html(data.aData.errMsg);
                $('.applyshow').hide();
                $('#userName').val('')
                $('#userPhoneNum').val('');
                $('#userNum').val('');
            }else{
                var aa = globalLog.getArgusObj();
                bb = $.extend(aa, {"self_event_type": "KFTBM_SUCC","el_data":{mbl: mobile}});
                globalLog.send(bb);
                $('.ApplyImg').removeClass('kft_shibai_img').addClass('kft_chenggong_img');
                $('.applySucceed').show();
                $('.succeedAlert').html(data.aData.errMsg);
                $('.applyshow').hide();
                $('#userName').val('')
                $('#userPhoneNum').val('');
                $('#userNum').val('');
            }
        },
        error: function(){
            $('.ApplyImg').removeClass('kft_chenggong_img').addClass('kft_shibai_img');
            $('.applySucceed').show();
            $('.succeedAlert').html('报名失败！');
            $('.applyshow').hide();
            $('#userName').val('')
            $('#userPhoneNum').val('');
            $('.applyOk').html('重新报名');
        }
    });
}
