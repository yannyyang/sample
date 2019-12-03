var $ = require('../zepto/zepto.js'), Class = require('../class/class.js'), Dialog = require('../dialog/dialog.js');
var Tips = Class.extend('Event', {
	initialize: function(opt){
		this.options = $.extend({
			content: '',
			timeout: 3000,
			mask: false
		}, opt || {});

		this.init();
	},

	init: function(){
		var self = this, opt = self.options;

		Tips.destroy(); Tips.instance = self;

		self.$ = new Dialog({
			autoOpen: false,
			mask: opt.mask,
			title: false,
			width: false,
			content: opt.content
		});

		self.$.wraper.addClass('ui2-tips');

		if(typeof opt.timeout == 'number'){
			self.id = setTimeout(function(){
				self.destroy();
			}, opt.timeout);
		}
	},

	destroy: function(){
		this.$.destroy();
		this.$ = null;
		clearTimeout(this.id);
		Tips.instance = null;
	}
});

Tips.instance = null;

Tips.destroy = function(){
	if(Tips.instance){
		Tips.instance.destroy();
	}
};

Tips.show = function(content, timeout, mask, classname){
	var tips = new Tips({
		content: content,
		timeout: timeout,
		mask: mask
	});

	if(classname) tips.$.wraper.find('.ui2-dialog-scroll').addClass(classname);
	
	tips.$.open();
	return tips;
};

$.each(['success', 'error', 'warn', 'loading'], function(index, item){
	Tips[item] = function(content, timeout, mask){
		return Tips.show(content, timeout, mask, 'ui2-tips-' + item);
	};
});

return Tips;