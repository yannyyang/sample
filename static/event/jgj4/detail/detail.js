
require.async(['common:ui/zepto/zepto.js','common:ui/iscroll/iscroll.js','common:third-party/swiper','common:ui/dialog','common:ui/tips'],function($,iScroll,Swiper, Dialog,Tips){
    var currentBtn;
    var timer;
    var picView = {
        init:function(){
            picView.urlAjax();
            // picView.bind();
        },
        urlAjax:function(){
             //swiper banner
            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationType: 'fraction',
                preloadImages:false,
                lazyLoading : true,
                loop: true
            }); 

        }
    };
    picView.init();

    var fuc = {
        timer:'',
        init: function(){
            this.initDialogs();
            this.bindEvent();
            this.dialogEvent();
            this.mapEvent();
            //this.getCash();
            this.callPhoneEvent();
        },
        bindEvent: function() {
            var self = this;
            this.layoutEvent();
            //领取现金
            $('#J_get_money').on('click',function(){
                self.getCash();
            })
            // tab切换
            $('.mod_tit_ul li').on('tap',function(){
                var index = $(this).index(),
                    tabLi = $(this).parents('.common_style').find('.mod_tit_ul li'),
                    pagLi = $(this).parents('.common_style').find('.mod_page_ul>li');
                tabLi.removeClass('p_on').eq(index).addClass('p_on');
                pagLi.removeClass('di_cur').eq(index).addClass('di_cur');
            });
            // 免责声明
            $('.disclaimer-core').height($(window).height() - 107);
            var disclaimerCon = $('.disclaimer-mask');

            $('body').on('click','.agreemen_text',function(){
                disclaimerCon.show();
            })
            $(document).on('click','.disclaimer-close',function(){
                disclaimerCon.hide();
            });
        },
        layoutEvent: function() {//户型介绍
            // $(".details-door-contant").width($(window).width());
            var _dlWidth =$(".house_type_items").width();
            var _length =$(".house_type_items").length;
            $(".house_type_items").width(_dlWidth);            
            $(".house_type_ul").width(_dlWidth*_length+(_length-1)*15);
            if($('#details-door-contant').length > 0){
                var doorScroll= new iScroll("details-door-contant",{
                    hScrollbar:false, 
                    vScrollbar:false,
                    vScroll:false,
                    checkDOMChanges:true,
                    onBeforeScrollStart: function ( e ) {//解决iScroll横向滚动区域无法拉动页面的问题
                        if ( this.absDistX > (this.absDistY + 5 ) ) {
                            // user is scrolling the x axis, so prevent the browsers' native scrolling
                            e.preventDefault();
                        }
                    },
                    //解决第一次无法滑动的问题
                    onTouchEnd: function () {
                      var self = this;
                      if (self.touchEndTimeId) {
                        clearTimeout(self.touchEndTimeId);
                      }

                      self.touchEndTimeId = setTimeout(function () {
                        self.absDistX = 0;
                        self.absDistX = 0;
                      }, 600);
                    }
                });
                doorScroll.refresh();
             }
            
        },
        mapEvent: function() {
            //百度地图
            var map = new BMap.Map("J_map");    // 创建Map实例
            var point= new BMap.Point(pageConfig.lng, pageConfig.lat);
            map.centerAndZoom(point, 14);  // 初始化地图,设置中心点坐标和地图级别
            map.disableDragging();//禁用地图拖拽
            map.disablePinchToZoom();//禁用双指操作缩放

            var opts = {
              position : point,    // 指定文本标注所在的地理位置
              offset   : new BMap.Size(-40, -30)    //设置文本偏移量
            }
            var label = new BMap.Label(pageConfig.houseName, opts);  // 创建文本标注对象
                label.setStyle({
                     color : "white",
                     fontSize : "12px",
                     height : "24px",
                     lineHeight : "24px",
                     border:0,
                     backgroundColor:'#f7683d',
                     borderRadius:'4px',
                     padding:'0 10px'

                 });
            map.addOverlay(label); 
        },
        //电话
        callPhoneEvent: function() {
            $('#J_call').on('click',function(){
                $('#J_phone').dialog('open');
            });
            $('#J_callPhone').on('click',function(){
                var tel = $(this).data('tel');
                window.location.href = 'tel:' + tel;
                $('#J_phone').dialog('close');
            });
            $('#J_cancel_callPhone').on('click',function(){
                $('#J_phone').dialog('close');
            });
        },
        //领取现金
        getCash: function() {
            $('#J_loading').dialog('open');
            $.ajax({
                url: pageConfig.sMoneyUrl,
                type: "GET",
                data: {
                    iLouPanID : pageConfig.iLoupanID
                },
                success: function(data){
                    setTimeout(function(){
                    if (data.status == 1){
                        //埋点
                        var aa = globalLog.getArgusObj();
                        bb = $.extend(aa, {"self_event_type": "JGJ_H_AJAX_LGFJSUC"});
                        globalLog.send(bb);
                        $('#J_loading').dialog('close');
                        window.location = pageConfig.sResultUrl;
                    } else{
                        if(data.errno == 'not_open_wangcai'){
                            $('#J_loading').dialog('close');
                            window.location = pageConfig.sOpenWangCaiPageUrl; 
                        }else {
                            $('#J_loading').dialog('close');
                            Tips.show(data.errmsg);
                        }
                    }
                    },2000);
                }
            });
            
        },
        initDialogs: function() {
            $('#J_loading').dialog({
                customWraper: true
            });

            $('#J_prize').dialog({
                customWraper: true
            });

            $('#J-notice-dialog').dialog({
                customWraper: true
            });

            $('#J_phone').dialog({
                customWraper: true
            }); 
        },
        dialogEvent: function() {
            var self = this;
            //关闭现金弹窗
            $(document).on('click','#J_prize a',function(){
                $('#J_prize').dialog('instance').close();
            })

            //预约看房
            $('.bookroom_btn').click(function() {
                if(!$(this).hasClass('disabled')){
                    self.lpId = $(this).data('lpid');
                    self.lpName = $(this).data('lpname');
                    $('#J_input_dxyzm').val('');
                    clearTimeout(self.timer);
                    $('#J_sendyzm_btn').removeClass('disable').text('发送验证码');
                    self.showDialog('#J_reserve');
                }
            });
            //发送短信验证码
            $('#J_sendyzm_btn').click(function() {
                if(!$(this).hasClass('disable')){
                    self.sendMessageyy();
                }
            });
            //提交预约
            $('#J_reserve_confirm').click(function() {
                if(self.formValid()){
                    self.closeDialog();
                    self.reserveSubmit();                    
                }
            });
            //提交预约
            $('#J_try_again').click(function() {
                $('#J_input_dxyzm').val('');
                clearTimeout(self.timer);
                $('#J_sendyzm_btn').removeClass('disable').text('发送验证码');
                self.showDialog('#J_reserve');
            });
            //关闭弹框按钮
            $('.J-close-btn').click(function() {
                $('#J-notice-dialog').dialog('close');
            });

            $('.dialog_close').click(function(){
                $('.page_mask').hide();
                $('.xf_detail_dialog').hide();
            });
            $('.cancel_btn').click(function(){
                $('.page_mask').hide();
                $('.xf_detail_dialog').hide();
            });
            $('.change_price').click(function(event){
                currentBtn=$(this);
                $('.dynamic_dialog .title').text('变价通知我');
                $('.dynamic_dialog .tips').text('变价消息会通过短信通知到您');
                $('.J_dynamic_form')[0].reset();//清空表单值
                $('.error_text').css('visibility','hidden');//隐藏报错信息
                clearTimeout(timer);
                $("#sendIdentifyCode").removeAttr("disabled").removeClass().text("获取验证码").addClass("btn_send_verify_code");//重置倒计时
                $('.page_mask').show();
                $('.dynamic_dialog').show();
            });
            $('.on_sale').click(function(event){
                currentBtn=$(this);
                $('.dynamic_dialog .title').text('开盘通知我');
                $('.dynamic_dialog .tips').text('开盘消息会通过短信通知到您');
                $('.J_dynamic_form')[0].reset();//清空表单值
                $('.error_text').css('visibility','hidden');//隐藏报错信息
                clearTimeout(timer);
                $("#sendIdentifyCode").removeAttr("disabled").removeClass().text("获取验证码").addClass("btn_send_verify_code");//重置倒计时
                $('.page_mask').show();
                $('.dynamic_dialog').show();
            });
            /*$('.activity_text').click(function(event){  //优惠
                currentBtn=$(this);
                $('.J_djhd_form')[0].reset();//清空表单值
                $('.error_text').css('visibility','hidden');//隐藏报错信息
                clearTimeout(timer);
                $("#sendYouhuiCode").removeAttr("disabled").removeClass().text("获取验证码").addClass("djhd_num_code");
                //重置倒计时
                $('.page_mask').show();
                $('.djhd_dialog').show();
            });*/

            $('.dynamic_sure_btn').click(function(){
                var flag_num=true,
                    flag_code=true;
                var numVal=$('.phone_num_input').val();
                var codeVal=$('.verify_code_input').val();

                if(/^1[3|4|5|7|8]\d{9}$/.test(numVal)){//验证手机号码
                    flag_num=true;
                    $('.error_text').css('visibility','hidden');
                }else{
                    flag_num=false;
                };
                if( /^\d{6}$/.test(codeVal)){//验证校验码
                    flag_code=true;
                    $('.error_text').css('visibility','hidden');
                }else{
                    flag_code=false;
                };

                if(!flag_num){
                    $('.error_text').html('<i></i>请输入正确的手机号码');
                    $('.error_text').css('visibility','visible');
                    return;
                }else if(!flag_code){
                    $('.error_text').html('<i></i>请输入正确的验证码');
                    $('.error_text').css('visibility','visible');
                    return;
                }else{
                    $('.error_text').css('visibility','hidden');
                    var param={
                        iLoupanID:$('#J_loupan').val(),
                        sType:Number(currentBtn.attr('data-type')),
                        sMobile:$('#J_dongtai_tel').val(),
                        code:$('#J_captcha').val()
                    };
                    $.ajax({
                        url:pageConfig.dongtaiUrl + '?sMobile=' + param.sMobile + '&sType=' + param.sType + '&iLoupanID=' + param.iLoupanID + '&code=' + param.code,
                        dataType:"jsonp",
                        jsonp:"callback",
                        success:function(data){
                            if(!data.hasError){
                                $('.page_mask').hide();
                                $('.dynamic_dialog').hide();
                                // alert('提交成功');
                            }else{
                                $('.error_text').html('<i></i>' + data.error);
                                $('.error_text').css('visibility','visible');
                            };
                        }
                    });
                };
                
                
            });


            $("#sendIdentifyCode").click(function(){//变价和开盘通知发送验证码
                var flag_num=true;
                var numVal=$('.phone_num_input').val();

                if(/^1[3|4|5|7|8]\d{9}$/.test(numVal)){//验证手机号码
                    flag_num=true;
                    $('.error_text').css('visibility','hidden');
                }else{
                    flag_num=false;
                    $('.error_text').html('<i></i>请输入正确的手机号码');
                    $('.error_text').css('visibility','visible');
                };

            if(!$(this).hasClass('btn_sended_verify_code')){
                    if(flag_num){
                        var param = {
                            'sMobile':$('#J_dongtai_tel').val(),
                            'iLoupanID':$('#J_loupan').val(),
                            'sType':Number(currentBtn.attr('data-type'))
                        }
                        $.ajax({
                            url:pageConfig.sendCodeUrl + '?sMobile=' + param.sMobile + '&sType=' + param.sType + '&iLoupanID=' + param.iLoupanID,
                            dataType:"jsonp",
                            jsonp:"callback",
                            success:function(data){
                                if(!data.hasError){
                                    var SECOND = 120;
                                     var $send = $("#sendIdentifyCode");
                                    //120秒
                                     (function(){
                                         if(SECOND){
                                             $send.attr("disabled", "disabled").removeClass().addClass("btn_sended_verify_code").text("重新发送("+SECOND--+"秒)");
                                                timer=setTimeout(arguments.callee, 1000);
                                         }else{
                                             $send.removeAttr("disabled").removeClass().text("获取验证码").addClass("btn_send_verify_code");
                                         } 
                                     })();
                                }else{
                                    $('.error_text').html('<i></i>' + data.error);
                                    $('.error_text').css('visibility','visible');
                                };
                            }
                        });
                    };
                 };
            });

            $("#sendYouhuiCode").click(function(){//优惠发送验证码
                var flag_num=true;
                var numVal=$('.djhd_num_input').val();
                if(/^1[3|4|5|7|8]\d{9}$/.test(numVal)){//验证手机号码
                    flag_num=true;
                    $('.error_text').css('visibility','hidden');
                }else{
                    flag_num=false;
                    $('.error_text').html('<i></i>请输入正确的手机号码');
                    $('.error_text').css('visibility','visible');
                };

            if(!$(this).hasClass('btn_sended_verify_code')){
                    if(flag_num){
                        $.ajax({
                            url:pageConfig.sendCodeUrl,
                            type:'post',
                            data:{
                                'sMobile':$('#J_hd_tel').val(),
                                'iLoupanID':$('#J_loupan').val(),
                                'sType':Number(currentBtn.attr('data-type')),
                            },
                            dataType:'json',
                            success:function(data){
                                 console.log(data);
                                if(!data.hasError){
                                    var SECOND = 120;
                                     var $send = $("#sendYouhuiCode");
                                    //120秒
                                     (function(){
                                         if(SECOND){
                                             $send.attr("disabled", "disabled").removeClass().addClass("btn_sended_verify_code").text("重新发送("+SECOND--+"秒)");
                                                timer=setTimeout(arguments.callee, 1000);
                                         }else{
                                             $send.removeAttr("disabled").removeClass().text("获取验证码").addClass("djhd_num_code");
                                         } 
                                     })();
                                }else{
                                    $('.error_text').html('<i></i>' + data.error);
                                    $('.error_text').css('visibility','visible');
                                };
                            }
                        });
                    };
                 };
            });

            $('.djhd_sure_btn').click(function(){
                var flag_phoneNum=true,
                    flag_name=true;
                    flag_code=true;
                var phoneNumVal=$('.djhd_num_input').val();
                var nameVal=$('.name_input').val();
                var codeVal=$('.djhd_code_input').val();

                if(/^1[3|4|5|7|8]\d{9}$/.test(phoneNumVal)){//验证手机号码
                    flag_phoneNum=true;
                    $('.error_text').css('visibility','hidden');
                }else{
                    flag_phoneNum=false;
                };
                if(/^[\u4e00-\u9fa5a-zA-Z]{1,20}$/.test(nameVal)){//验证姓名为英文和中文，长度不超过20
                    flag_name=true;
                    $('.error_text').css('visibility','hidden');
                }else{
                    flag_name=false;
                };
                if( /^\d{6}$/.test(codeVal)){//验证校验码
                    flag_code=true;
                    $('.error_text').css('visibility','hidden');
                }else{
                    flag_code=false;
                };
                if(!flag_name){
                    $('.error_text').html('<i></i>请输入正确的姓名');
                    $('.error_text').css('visibility','visible');
                    return;
                }else if(!flag_phoneNum){
                    $('.error_text').html('<i></i>请输入正确的手机号码');
                    $('.error_text').css('visibility','visible');
                    return;
                }else if(!flag_code){
                    $('.error_text').html('<i></i>请输入正确的验证码');
                    $('.error_text').css('visibility','visible');
                    return;
                }else{
                    $('.error_text').css('visibility','hidden');
                    $.ajax({
                        url:pageConfig.youhuiUrl,
                        type:'post',
                        data:{'name':$('#J_name').val(),'phone':$('#J_hd_tel').val(),'code':$('#J_hd_code').val(),'sType':Number(currentBtn.attr('data-type')),},
                        dataType:'json',
                        success:function(data){
                            $('.page_mask').hide();
                            $('.djhd_dialog').hide();
                            if(data.success){
                                alert('提交成功');
                            }else{
                                alert(data.error);
                            };
                        }

                    });
                };
            });
            
            // 看房团弹框
            var enrollBtn = $('.kft_btn');

            enrollBtn.on('click',function(e){
                e.preventDefault();

                $('.ApplyTextBg').show();
                $('.applySub').attr('data_id',$(this).attr('data_id'));
                $('.ApplyTextTit h2').html($(this).find('span').attr('data_sTitle'));
            });

            $('.ApplyTextBg').bind("touchmove",function(event){
                event.preventDefault();
            });

        },
        featureEvent: function() {
            if($('.house_feature').is(":hidden")){
                $('.pagination_style').addClass('no_video');
            }else{
                $('.pagination_style').removeClass('no_video');
            };
        },
        //验证码
        sendMessageyy: function() {
            var self = this;
            var param = {
                'sMobile':$('#J_input_tel').val().trim(),
                'iLoupanID':pageConfig.iLoupanID,
                'sType':3,
            }
            if(self.validMobileyy()){
                $.ajax({
                    url: pageConfig.sYySmsUrl,
                    type:"POST",
                    data:param,
                    dataType:"json",
                    success:function(resdata) {
                        if(resdata.status==1){
                            self.controlTime($('#J_sendyzm_btn'), 60);
                        }else{
                            Tips.show(resdata.errmsg);
                        }
                    },
                    error:function(e) {
                        Tips.show('发送失败，请重新再试');
                    }
                }); 
            }
        },
        //预约看房
        reserveSubmit:function(){
            var self = this;
            var param = {
                'iLoupanID':pageConfig.iLoupanID,
                'sType':3,
                'sName':$('#J_input_name').val().trim(),
                'sMobile':$('#J_input_tel').val().trim(),
                'sCode':$('#J_input_dxyzm').val().trim()
            }
            Tips.loading("预约看房...",false,true);
            $.ajax({
                url: pageConfig.sYyUrl,
                type:"POST",
                data:param,
                dataType:"json",
                success:function(resdata) {
                    Tips.destroy();
                    if(resdata.status==1){
                        //埋点
                        var aa = globalLog.getArgusObj(),
                        bb = $.extend(aa, {"self_event_type": "JGJ_H_AJAX_YYKFSUC","el_data":{mbl: param.sMobile}});
                        globalLog.send(bb);
                        self.showDialog('#J_reserve_success');
                    }else{
                        //埋点
                        var aa = globalLog.getArgusObj(),
                        bb = $.extend(aa, {"self_event_type": "JGJ_H_AJAX_YYKFERROR","el_data":{ERR_MSG: resdata.errmsg}});
                        globalLog.send(bb);
                        $('#J_reserve_fail').find('.txt2').text(resdata.errmsg);
                        self.showDialog('#J_reserve_fail');
                    }
                },
                error:function(e) {
                    Tips.destroy();
                    Tips.show('提交失败，请重新再试');
                }
            });
        },
        //统一显示弹框方法
        showDialog:function(id){
            $(id).removeClass('hide').siblings().addClass('hide');
            $('#J-notice-dialog').dialog('open');
        },
        //关闭弹框
        closeDialog:function(){
            $('#J-notice-dialog').dialog('close');
        },
        //看房验证
        formValid:function(){
            var self = this;
            var name = $('#J_input_name').val().trim();
            var tel = $('#J_input_tel').val().trim();
            var dxyzm = $('#J_input_dxyzm').val().trim(); 
            if(name == ''){
                Tips.show('请输入姓名');
                return false;
            }
            if(name.length < 2 || name.length > 30 || !/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/.test(name) ){
                Tips.error('请输入正确的姓名');
                return false;
            }
            if(!self.validMobileyy()){
                return self.validMobileyy();
            }
            if(dxyzm == ''){
                Tips.show('请输入短信验证码');
                return false;
            }
            return true;
        },
        //手机号验证
        validMobileyy:function(){
            var tel = $('#J_input_tel').val().trim();
            if(tel == ''){
                Tips.show('请输入手机号码');
                return false;
            }
            if(!/^1\d{10}$/.test(tel)){
                Tips.show("请输入正确手机号码");
                return false;
            }
            return true;
        },
        // 控制时间为60秒
        controlTime: function(sendbtn, wait) {
            var self = this;
            if (wait == 0) {
                sendbtn.removeClass('disable').text('发送验证码');
                return;
            } else {
                sendbtn.addClass('disable');
                sendbtn.text("请等待" + wait + "秒");
                wait--;
            }
            self.timer = setTimeout(function() {
                self.controlTime(sendbtn, wait);
            }, 1000)
        }
    };
    fuc.init();    
});