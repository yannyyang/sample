var $ = require('common:ui/zepto');
var Tips = require('common:ui/tips');
var Util = require('common:ui/util');


/** 
**hfb ajax请求封装**
**参数说明**
	ajaxUrl: 请求地址
	ajaxType: 请求类型get/post
	ajaxParam: 请求参数，json格式
	dataType：数据格式
	isTips: ajax前是否需要tips
	aSuccessCallBack: success时回调函数
	aErrorCallBack: error时回调函数
**/

var HfbAjax = function(opt){
	this.options = $.extend({
		ajaxUrl: '',
		ajaxType: 'POST',
		dataType: 'json',
		ajaxParam: {},
		isTips : true,
		aSuccessCallBack: $.noop,
		aErrorCallBack: function(){
			Tips.error("系统繁忙，请稍后再试！");
		}
	}, opt||{});

	this.init();
};

HfbAjax.prototype = {
	init: function(){
		var self = this, options = self.options;

		HfbAjax.destroy(); 
		HfbAjax.instance = self;

		if(self.isAjaxing){
            return;
        }
        self.isAjaxing = true;

		var tips = '',
			param = {
				'data' : self.getData(),
				'sign' : self.getSignData()
			};

		$.ajax({
			type: options.ajaxType,
			url: options.ajaxUrl,
			data: param,
			dataType: options.dataType,
			beforeSend: function(request) {
				tips = options.isTips ? Tips.loading('loading','',true) : '';                
            },
			success: function(res) {
				options.isTips && tips.destroy() ;
				options.aSuccessCallBack && options.aSuccessCallBack.call(self,res);
			},
			error: function(res) {
				options.isTips && tips.destroy() ;
				options.aErrorCallBack && options.aErrorCallBack.call(self,res);
			},
			complete:function(res){
                self.isAjaxing = false;
            }
		});
	},
	getCookie: function(name){
        var cookiestr = document.cookie,
        	cookiearr = cookiestr.split("; ");
        for(var i = 0; i < cookiearr.length; i++){
            var kAndV = cookiearr[i].split("=");
            if( kAndV[0] == name) return encodeURIComponent(kAndV[1]);
        }
        return '';
    },
    getData: function(){
    	var self = this, options = self.options;
    	var tempObj = options.ajaxParam , arr = [], tempData='';
    	for(var k in tempObj){
		     arr[arr.length] = k +'='+ tempObj[k];
		}
		tempData = arr.join('&');
		return Util.string.base64Encode(tempData);
    },
    getSignData: function(){
		var self = this;
		var sTemp = self.getData() + '_hao_fang_bao_' + self.getCookie('_hfb_xsrf');
		return Util.string.md5(sTemp);
    },
	destroy: function(){
		HfbAjax.instance = null  ;
	}
};

HfbAjax.send = function(options){
	var hfbAjax = new HfbAjax(options);
	return hfbAjax;
};

HfbAjax.destroy = function(){
	if(HfbAjax.instance){
		HfbAjax.instance.destroy();
	}
};

module.exports = HfbAjax;