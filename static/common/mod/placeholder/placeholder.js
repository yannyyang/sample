var $ = require('../zepto/zepto.js');

function PlaceHolder(opt){
	this.options = $.extend({
		dom: null,
		text: ''
	}, opt || {});

	this.init();
}

PlaceHolder.prototype = {
	init: function(){
		var self = this, $dom = self.dom = $(self.options.dom);
		var text = self.options.text || $dom.attr('placeholder') || $dom.attr('data-placeholder');

		var gid = $dom.attr('data-ui-placeholder-gid');
		if(gid && PlaceHolder.CACHE[gid]){
			PlaceHolder.CACHE[gid].setPlaceHolder(text);
			return;
		}

		PlaceHolder.CACHE[self.GID = PlaceHolder.GID++] = self;

		self.setPlaceHolder(text);

		$dom.blur(function(){
			this.value == '' && self.placeholder.show();
		}).blur().attr({
			'data-placeholder':text,
			'data-ui-placeholder-gid':self.GID
		}).focus(function(){
			self.placeholder.hide();
		}).removeAttr('placeholder');
	},

	setPlaceHolder:function(text){
		var $dom = this.dom;
		var $domParent = $dom.parent();
		//dom 的四条边
		var bLeftWidth = parseInt($dom.css('border-left-width'));
		var bRightWidth = parseInt($dom.css('border-right-width'));
		var bTopWidth = parseInt($dom.css('border-top-width'));
		var bBottomWidth = parseInt($dom.css('border-bottom-width'));

		if(!this.placeholder){
			if(!/fixed|absolute/.test($domParent.css('position'))){
				$domParent.css('position','relative');
			}

			this.placeholder = $('<input type="text" />').css({
				width: $dom.width()-bLeftWidth-bRightWidth,
				height: $dom.height()-bTopWidth-bBottomWidth,
				lineHeight: $dom.css('line-height')
			}).appendTo($domParent).addClass('ui-placeholder').tap(function(){
				$(this).hide();
				$dom.focus();
			});
		}

		this.placeholder.css({
			top: $dom.position().top + bTopWidth,
			left: $dom.position().left + bLeftWidth
		}).val(text);
	}

};

PlaceHolder.CACHE = [];
PlaceHolder.GID = 1;
module.exports = PlaceHolder;