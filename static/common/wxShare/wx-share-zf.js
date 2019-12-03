/**
 * Created by SHENGCHENLING711 on 2016-09-07.
 */

require.async('common:zepto', function($){

    wx.config({
        debug: obj.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: obj.appId, // 必填，公众号的唯一标识
        timestamp: obj.timestamp, // 必填，生成签名的时间戳
        nonceStr: obj.nonceStr, // 必填，生成签名的随机串
        signature: obj.signature,// 必填，签名，见附录1
        jsApiList: obj.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(function(){

        wx.onMenuShareTimeline({
            title: obj.title, // 分享标题
            link: obj.link, // 分享链接
            imgUrl: obj.imgUrl, // 分享图标
            success: function () {
                alert(1);
                $('#fx_bgMask').fadeOut()
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                $('#fx_bgMask').fadeOut()
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareAppMessage({
            title: obj.title, // 分享标题
            desc: obj.desc, // 分享描述
            link: obj.link, // 分享链接
            imgUrl: obj.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                $('#fx_bgMask').fadeOut()
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                $('#fx_bgMask').fadeOut()
                // 用户取消分享后执行的回调函数
            }
        });

    });


});


