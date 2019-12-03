if(pageConfig.checkLogin == 1){
require.async(['common:ui/zepto',"common:ui/dialog","common:ui/tips",'common:ui/template',"common:ui/iscroll"],
 function($,Dialog,Tips,Template,iScroll) {
    var fuc = {
        citylistScroll:'',
        init:function(){
            this.bindiScroll();
            this.bindDialog();
            this.bindEvent();   
            //城市选择页滚动
            this.citylistScroll.refresh();               
        },
        //初始化iScroll
        bindiScroll:function(){
            this.citylistScroll = new iScroll("J_citylist", {
                vScrollbar: false,
                vScroll: true,
                checkDOMChanges: true,
                useTransform: true,
                useTransition: true
            });
        },
        //初始化弹框
        bindDialog:function(){
            $('#J_new_user_dialog').dialog({
                customWraper: true
            });
            $('#J_notice_dialog').dialog({
                customWraper: true
            });
            if(pageConfig.bTakenFuDai == '0'){
                $('#J_new_user_dialog').dialog('open');
            }
        },
        bindEvent:function(){
            var self = this;
            var citylist = $("#J_citylist,#J_citybar,#J_character"),
                back = $("#J_city .top-l"),
                character = $("#J_character"),
                opencity = $("#J_select_city"),
                citytap = $(".j_cityname"),
                fixheight = -document.getElementById('J_citybar').offsetHeight;
            //购房金立即领取
            $('.J_getM_btn').click(function(){
                var _this = $(this);
                if(!_this.hasClass('grey_btn')){
                    var _money = _this.data("price"),
                        _type = _this.data("type");
                    self.getFudai(_type,function(){
                        var _n = $('#J_notice_dialog').find('.J-money-num'),
                            _t = $('#J_notice_dialog').find('.J-money-txt');
                        _n.text(_money);
                        _t.text('专属购房金');
                        $('#J_notice_dialog').dialog('open');

                        _this.text('已领取');
                        _this.addClass('grey_btn');
                    });
                }
            });
            //新人福袋立即领取
            $('.J_get_btn').click(function(){
                self.getFudai(10);
            });
            //关闭弹框
            $('.J_close_btn').click(function(){
                $('#J_new_user_dialog,#J_notice_dialog').dialog('close');
            });
            //城市选择页展开
            opencity.click(function() {
              citylist.removeClass('citylist-hide');
            });
            //城市选择页返回
            back.click(function() {
              citylist.addClass('citylist-hide');
            });

            //城市选择页锚点
            character.click(function(e) {
                var target = $(e.target).attr("data-target");

                self.citylistScroll.scrollToElement(target, 100);
                self.citylistScroll.scrollTo(0, fixheight, 0, true);
            });
            //选择城市,设置cookie ['hfcityid', 'cityid']
            citytap.click(function(e){
                var _id = $(this).data('cid');
                if(_id == pageConfig.currentCityId){
                    citylist.addClass('citylist-hide');
                } else {
                    self.setCookieCityId(_id,function(){
                        window.location.reload();
                    });
                }
            });
        },
        //领取购房金
        getFudai:function(type,fn){
            var self = this;
            var param = {
                'iType':type
            }
            Tips.loading("领取购房金...",false,true);
            self.getAjaxData(pageConfig.sFuDaiApiUrl,"GET",param,function(resdata){
                Tips.destroy();
                if(resdata.status == 1){
                    if(type == 10){
                        $('#J_new_user_dialog').dialog('close');
                        $('#J_notice_dialog').dialog('open');
                    }else {
                        fn && fn();
                    }  
                }else{
                    Tips.show(resdata.errmsg);
                }
            },function(){
                Tips.destroy();
                Tips.show('提交失败，请重新再试');
            });
        },
        //城市切换通过接口设置cookie
        setCookieCityId:function(id,fn){
            var self = this;
            var param = {
                'iCityID':id
            }
            self.getAjaxData(pageConfig.setCookieApiUrl,"GET",param,function(resdata){
                fn && fn();
            },function(){
                fn && fn();
            });
        },
        //异步提交封装
        getAjaxData:function(url,type,param,sucfn,errfn){
            $.ajax({
                url: url,
                type: type || "POST",
                data: param,
                dataType:"json",
                success:function(data) {
                    sucfn && sucfn(data);
                },
                error:function(e) {
                    if(typeof errfn != "undefined"){
                        errfn();
                    }else{
                        Tips.show('稍后再试');
                    }
                }
            });
        },
        //写cookies
        setCookie:function(c_name, value, expiredays){
            var exdate=new Date(),
                expiredays = expiredays || 1;
　　　　   exdate.setDate(exdate.getDate() + expiredays);
　　　　   document.cookie=c_name+ "=" + escape(value) + ";domain=" + (pageConfig.baseDomain ? ";domain=" + pageConfig.baseDomain : "") + ";path=/;expires=" + exdate.toGMTString();
        },
        //读取cookies
        getCookie:function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        //删除cookies
        delCookie:function(name){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=this.getCookie(name);
            if(cval!=null)
                document.cookie= name + "=" + cval + (pageConfig.baseDomain ? ";domain=" + pageConfig.baseDomain : "") + ";path=/;expires=" + exp.toGMTString();
        }
    }
    fuc.init();
});
}else if(pageConfig.checkLogin == -1){//loading js
    //判断客户端版本号4.1后的支持城市定位
    PALifeOpen.config({
        goBack: function() { // 用户点击平安金管家APP的界面导航栏返回按钮时，会触发调用
            return true; // 直接回退到平安金管家APP的客户端界面
        }
    });
    var uaInfo = window.navigator.userAgent.match(/PARS\/([\d.]+)/);
    var cityName = '';
    function getCV() {  
        if (uaInfo && uaInfo.length > 0) {
            return parseInt(uaInfo[1]);
        } else {
            return 0;
        }
    }
    //获取用户手机号
    NativeJSPatch.patch('getEncryptUserPhone');
    Native.getEncryptUserPhone('getPhoneCallback',getPhoneCallback);
    
    function getPhoneCallback(phone){
        if(getCV() >= 410){
            PALifeOpen.invoke(
                'location',
                'getLocation',
                {},
                function success(rsp) {
                    if (rsp && rsp.ret == 0) {
                        cityName = rsp.data.city;
                    }
                    loadingAjax(phone, cityName);
                },
                function error(e) {
                    loadingAjax(phone, cityName);
                    console.log(e);
                }
            );
        } else {
            loadingAjax(phone, cityName);
        }
    } 

    function loadingAjax(phone, cityName) {
        require.async(["common:ui/zepto"] , function($) {
            $.ajax({
                url:pageConfig.loadingUrl,
                data:{'mobile':phone,'cityName':cityName},
                type:'post',
                cache:false,
                success:function(data){
                    if(data.status == 1){
                       window.location.reload();
                    }else{
                        window.location.href = pageConfig.errorUrl+'?errno='+data.errno; 
                    }
                }
            });
        });
    }
} 