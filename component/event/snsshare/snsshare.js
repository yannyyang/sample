require.async(['common:ui/zepto','common:ui/mask'],function($,Mask){
	var mask = new Mask({
		autoOpen : false
	});
	var config = snsconfig,
		$iconlist = $("#J_icon_list");
	$iconlist.on('tap', 'a', function(e) {
		var type = $(this).attr("data"),
			encodeContent = encodeURIComponent(config.content),
			link = config.link,
			title = config.title,
			connect = link.indexOf('?') > 0 ? '&' : '?',
			pic =  encodeURIComponent(config.pic),
			url;
		switch(type) {
			case "weibo":
				url = "http://service.weibo.com/share/share.php?title=" + encodeContent + "&url=" + encodeURIComponent(link + connect + "pfrom=weibo") + "&pic=" + pic;
				window.open(url);
				break;
			case "txweibo":
				url = "http://share.v.t.qq.com/index.php?c=share&a=index&title=" + encodeContent + "&url=" + encodeURIComponent(link + connect + "pfrom=txweibo") + "&pic=" + pic;
				window.open(url);
				break;
			case "qqzone":
				url = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?desc=" + encodeContent + "&url=" + encodeURIComponent(link + connect + "pfrom=qqzone") + "&title=" + encodeURIComponent(title) + "&pics=" + pic/* + "&images=" + pic + "&img=" + pic*/;
				window.open(url);
				break;
			case "renren":
				url = "http://widget.renren.com/dialog/share?title=" + encodeContent + "&resourceUrl=" + encodeURIComponent(link + connect + "pfrom=renren") + "&srcUrl=" + encodeURIComponent(link + connect + "pfrom=renren") + "&pic=" + pic;
				window.open(url);
				break;
			case "qq":
				url = "http://connect.qq.com/widget/shareqq/index.html?&desc=" + encodeContent + "&title=" + encodeContent + "&url=" + encodeURIComponent(link + connect + "pfrom=qq") + "&pics=" + pic;
				window.open(url);
				break;
		}
		e.preventDefault();
	});
	
	var $shareWechat = $('.J_shareWechat');

	var isWX = weixin.isWX,
		bApp = weixin.bApp;
	$("#J_icon_list .wechat").tap(function(){
		if(isWX && !bApp){
			mask.close();
			pop(true);
			alert(11)
			$("#J_weixin_Mask").show();
		}else{
			alert(22)
			$("#J_QR_Code").show();
		}
	});

	$("#J_weixin_Mask").tap(function(){
		$(this).hide();
	})
	function pop(dir){
		var step = dir ? 100 : 0 ,
			translate = 'translate(0,' + step + '%)';
		$iconlist.animate({
			'transform' : translate,
			'-webkit-transform' : translate,
			'-moz-transform' : translate,
			'-ms-transform' : translate,
			'-o-transform' : translate
		}, 150);
	}
	
	$('#J_close_sns').tap(function() {
		mask.close();
		pop(true);
		$("#J_QR_Code").hide();
	});

	$.Event('sns:pop'); //zepto中的自定义事件注册
	$(document).on('sns:pop',function(e) {
		mask.open();
		pop();
	});
});