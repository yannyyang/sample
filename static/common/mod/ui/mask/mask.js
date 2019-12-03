var $ = require('../zepto/zepto.js'), Class = require('../class/class.js');
var doc = document;

return Class.$factory('mask', {
	initialize: function(opt){
		this.options = $.extend({
			autoOpen: true,
			dom: doc.body,
			color: '#000',
			opacity: 0.6
		}, opt || {});

		this.init();
	},

	init: function(){
		var self = this, container = self.container = $(self.options.dom);

		if(container[0] != doc.body){
			!/fixed|absolute/.test(container.css('position')) && container.css('position', 'relative');
		}
		
		self.mask = $('<div class="ui2-mask">').hide().css({
			backgroundColor: self.options.color,
			opacity: self.options.opacity
		}).appendTo(self.container);

		self.o2s(window, 'resize', function(){
			self.resetPosition();
		});

		self.options.autoOpen && self.open();
	},

	open: function(){
		this.resetPosition();
		this.mask.css('display', 'block');
		this.trigger('open');
	},

	close: function(){
		this.mask.css('display', 'none');
		this.trigger('close');
	},

	resetPosition: function(){
		var container = this.container[0];

		this.mask.css({
			width: container.scrollWidth || doc.docElement.scrollWidth,
			height: container.scrollHeight || doc.docElement.scrollHeight
		});
	},

	destroy: function(){
		this.mask.remove();	
		this.mask = null;
		this.ofs(window, 'resize');
	}
});