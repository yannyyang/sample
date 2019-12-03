require.async(['common:zepto','common:ui/dialog','common:ui/tips'], function($, Dialog, Tips) {
	var fuc = {
		init: function () {
			this.shareEvent();
		},
        shareEvent: function(){
            var _this = this;
            $(".share_btn").on("click", function(){
                
                if (shareData.type == 'anydoor') {
                    require.async("common:hf/anydoor", function(Anydoor){
                        var getPos = new Anydoor({
                            needMore: false,
                            share: true,
                            shareSuccCallback: function(data) { //登录成功后的回调
                                Tips.show("分享成功");
                            },
                            shareErrCallback: function(error) { //登录失败后的回调
                                Tips.error(JSON.stringify(error));
                            }
                        });
                    });
                } else if (pageConfig.type == 'weixin') {
                    $(".share_mask").removeClass('hide');
                    require.async(['./jweixin-1.0.0.js'], function() {
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId:pageConfig.appId , // 必填，公众号的唯一标识
                            timestamp:pageConfig.timestamp , // 必填，生成签名的时间戳
                            nonceStr:pageConfig.nonceStr, // 必填，生成签名的随机串
                            signature:pageConfig.signature,// 必填，签名
                            jsApiList: [
                                "ready",
                                "onMenuShareAppMessage",
                                "onMenuShareTimeline"
                            ] // 必填，需要使用的JS接口列表
                        });
                        wx.ready(function(){
                            // 分享到朋友圈
                            wx.onMenuShareTimeline({
                                "title": pageConfig.title ,//定义分享标题
                                "imgUrl": pageConfig.imgUrl ,//图片
                                "link": pageConfig.link //分享链接
                            });
                            wx.onMenuShareAppMessage({
                                "title": shareData.title, // 分享标题
                                "desc": shareData.desc, // 分享描述
                                "link": shareData.link, // 分享链接
                                "imgUrl": shareData.imgUrl, // 分享图标
                                "type": '', // 分享类型,music、video或link，不填默认为link
                                "dataUrl": ''// 如果type是music或video，则要提供数据链接，默认为空
                            });
                        });
                    });
                }else{
                    $(".share_mask").removeClass('hide');
                }    
            });
            $(".mask_btn").on("click", function() {
                $(".share_mask").addClass('hide');
            });
        	  	
        }
	};
	fuc.init();
});