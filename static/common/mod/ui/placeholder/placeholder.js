var $ = require('../zepto/zepto.js'), Class = require('../class/class.js');
var PlaceHolder = Class.$factory('placeholder', {
	initialize: function(opt){
		var self = this;

		self.options = $.extend({
			dom: null,
			text: ''
		}, opt || {});

		self.placeholder = null;
		self.initEvent();
		self.setPlaceHolder();
	},

	initEvent: function(){
		var self = this, $dom = self.dom = $(self.options.dom);
		
		if(!PlaceHolder.isSupport){
			$dom.blur($.proxy(self.empty2show, self)).focus(function(){
				self.placeholder.hide();
			});
		}
	},

	setPlaceHolder: function(text){
		var self = this, $dom = self.dom = $(self.options.dom);
		text = text || self.options.text || $dom.attr('placeholder') || $dom.attr('data-placeholder');

		$dom.attr('placeholder', text);

		if(!PlaceHolder.isSupport){
			if(!self.placeholder){
				if(!/fixed|absolute/.test($dom.parent().css('position'))){
					$dom.parent().css('position', 'relative');
				}

				self.placeholder = $('<span>').css({
					width: $dom.width(),
					height: $dom.height(),
					lineHeight: $dom.height() + 'px'
				}).insertAfter($dom).addClass('ui2-placeholder').click(function(){
					$(this).hide();
					$dom.focus();
				});
			}

			self.placeholder.css({
				top: $dom.position().top,
				left: $dom.position().left,
				textIndent: parseInt($dom.css('border-left-width')) + 5 + 'px'
			}).html(text);
		}
	},

	empty2show: function(){
		var self = this;
		self.placeholder && self.dom.val() == '' && self.placeholder.show();
	}
});

PlaceHolder.isSupport = 'placeholder' in document.createElement('input');

return PlaceHolder;