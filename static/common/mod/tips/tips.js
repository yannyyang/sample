var $ = require('../zepto/zepto.js'), Mask = require('../mask/mask.js'), Dialog = require('../dialog/dialog.js');

function Tips(opt){
	this.options = $.extend({
		content: '',
		timeout: 3000,
		mask: false
	}, opt || {});

	this.init();
}

Tips.prototype = {
	init: function(){
		var self = this, opt = self.options;

		Tips.destroy(); Tips.instance = self;

		self.$ = new Dialog({
			autoOpen: true,
			mask: opt.mask,
			title: false,
			width: false,
			height: false,
			content: opt.content
		});

		self.$.container.addClass('ui-tips');

		if(typeof opt.timeout == 'number'){
			self.id = setTimeout(function(){
				self.destroy();
			}, opt.timeout);	
		}
	},

	destory: function(){
		this.destroy();
	},

	destroy:function(){
		this.$.destroy();
		clearTimeout(this.id);
	}

};

Tips.instance = null;

Tips.destory = function(){
	this.destroy();
};

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

	if(classname) tips.$.container.find('.ui-dialog-scroll').addClass(classname);
	return tips;
};

$.each(['success', 'error', 'warn', 'loading'], function(index, item){
	Tips[item] = function(content, timeout, mask){
		return Tips.show(content, timeout, mask, 'ui-tips-' + item);
	};
});

return window.Tips = Tips;