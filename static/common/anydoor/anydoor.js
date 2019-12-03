require.async(["common:ui/zepto","common:ui/tips"], function($ ,Tips) {
function Anydoor(opt){
    this.options = $.extend({
    	needMore: false,
        position: false,
		positionSuccCallback: function(){},
		positionErrCallback: function(){},
		openId: false,
		merchantCode: '',
		openIdSuccCallback: function(){},
		openIdErrCallback: function(){},
		share: false,
		shareSuccCallback: function(){},
		shareErrCallback: function(){},
    }, opt || {});
    this.init();
}
Anydoor.prototype = {
	init: function(){
		var self = this;
		self.bindEvent();
	},
	bindEvent: function(){
		var self = this;
		!self.options.needMore && self.moreBtn();
		self.options.position && self.position();
		self.options.openId && self.openId();
		self.options.share && self.share();
	},
	moreBtn: function() {
		var exParams = {
		    needMoreBtn: 'N', // 导航栏是否需要显示“更多”按钮 Y：显示，N：隐藏，默认Y
		    needMineShare: 'N', // 分享面板是否需要显示“我的”按钮 Y：实现，N：隐藏，默认Y
		    needShare: "Y", //是否需要分享
		    title: '' // 自定义导航栏标题 (string类型，为空则视为不自定义标题)
		};
		App.call(["setWebNavigationBar"],function(data){
		    console.debug('success ', data);
		},function(error){ 
		    console.debug('failed ', error);
		}, exParams);
	},
	//获取地理位置
	position: function(){
		var _this = this;
		App.call(["getCurrentPosition"],function(data){
			var result = JSON.parse(data);
			var url = 'https://api.map.baidu.com/geocoder/v2/?ak=8rxt56R8pDlsz3yXawLdAMKh&callback=?&location=' + result.latitude + ',' + result.longitude + '&output=json&pois=1';
	        $.getJSON(url, function (res) {
	        	_this.options.positionSuccCallback(res.result.addressComponent.city);
	        });
		},function(error){
		    _this.options.positionErrCallback(error);
		});
	},
	openId: function(){
		var _this = this;
		//获取openId
		var exParams = {
		    module: 'wangcai',
		    action: 'getOpenId',
		    param: {
		        'metchainCode': _this.options.merchantCode
		    }
		};
		App.call(["h5OpenHostApp"], function(data) {
				var result = JSON.parse(data);
				// _this.config.openId = result.retData.openId;
				_this.options.openIdSuccCallback(result.retData.openId);
			    console.debug('success ', data); // Android返回的JSON对象，IOS返回的是JSON字符串
			    
			},
			function(error) {
				_this.options.openIdErrCallback(result.retData.openId);
			    console.debug('failed ', error); // Android返回的JSON对象，IOS返回的是JSON字符串
			}, exParams
		);
	},
	share: function() {
		var _this = this;
		App.call(["checkShare"],function(data){
			var result = JSON.parse(data);			
			if(result.result){
		        App.call(["shareMessage"],function(data){
					var result = JSON.parse(data);
					// $(".showdata").html(result);
				},function(error){
					Tips.error(error);
				},{
					title: shareData.title,
				    content: shareData.desc,
				    imageUrl: shareData.imgUrl,
				    url: shareData.link,
				    messageType: '4',
				    shareThumbImage: shareData.imgUrl
				});
			}
			
		},function(error){
		    Tips.error(error);
		},{});
		
	}
}

window.Anydoor = Anydoor;
});
