var $ = require('../zepto/zepto.js'), Class = require('../class/class.js'), Mask = require('../mask/mask.js'), iScroll = require('../iscroll/iscroll.js');
var doc = document;

module.exports = Class.$factory('dialog', {
	initialize: function(opt){
		this.options = $.extend({
			title: '',
			dom: null,
			width: '80%',
			height: false,
			content: '',
			url: '',
			mask: true,					//蒙版
			autoOpen: false,
			buttons: {},
			handle: null,				//指定打开和关闭dialog的元素
			className: '',
			customWraper: false
		}, opt || {});

		this.init();
	},

	init: function(){
		var self = this;

		self.firstOpenStatus = false;
		self.dom = null;
		self.create();
		self.options.autoOpen && self.open();
	},

	create: function(){
		var self = this;

		self.createMask();
		self.createWraper();
		self.initEvent();
	},

	initEvent: function(){
		var self = this, options = self.options;

		self.o2s(window, 'resize', function(){
			self.resetPosition();
		});

		if(options.handle){
			self.o2s(options.handle, 'tap', function(){
				self.open();
			});
		}

		self.wraper.find('.ui2-dialog-close').tap(function(){
			self.close();
		});
	},

	//创建遮罩
	createMask: function(){
		if(!this.options.mask) return;

		this.mask = new Mask({autoOpen: false});
	},

	//创建内容部分
	//包括创建内容　按钮
	createWraper: function(){
		var self = this, options = self.options, $wraper;

		if(options.customWraper && options.dom){
			self.wraper = $(options.dom).addClass('ui2-dialog-wraper-custom ui2-dialog-wraper');
			self.content = self.wraper.find('.ui2-dialog-content');
		}else{
			$wraper = self.wraper = $('<div class="ui2-dialog-wraper ui2-dialog-wraper-uncustom">');
			$wraper.html([
				'<strong class="ui2-dialog-header">',
		    		'<a href="javascript:void(0);" class="ui2-dialog-close"></a>',
		    		'<span class="ui2-dialog-title"></span>',
		    	'</strong>'
		    ].join(''));

			self.setTitle(options.title);
			self.content = $('<div class="ui2-dialog-content"><div class="ui2-dialog-scroll"></div></div>').appendTo($wraper);
			self.initContent();
		}

		self.wraper.appendTo(doc.body).addClass(options.className);
		self.createButtons();
	},

	initContent: function(){
		var self = this, options = self.options;

		if(options.content){
			self.setContent(options.content);
		}else if(options.dom){
			self.setDom(options.dom);
		}else if(options.url){
			self.load(options.url);
		}
	},

	setContent: function(content){
		var self = this;

		self.releaseDom();
		self.content.find('.ui2-dialog-scroll').html(content);
		self.resetPosition();
	},

	setDom: function(dom){
		var self = this;

		self.releaseDom();
		self.dom = $(dom).show();
		self.content.find('.ui2-dialog-scroll').empty().append(self.dom);
		self.resetPosition();
	},

	load: function(url){
		var self = this;

		self.content.find('.ui2-dialog-scroll').load(url, function(){
			self.trigger('contentLoaded');
			self.resetPosition();
		});
	},

	//释放dom
	releaseDom: function(dom){
		var self = this;

		if(!dom && !(dom = self.dom)){
			return ;
		}

		$(doc.body).append(dom);

		if(self.options.customWraper){
			dom.removeClass('ui2-dialog-wraper-custom ui2-dialog-wraper').removeClass(self.options.className);
		}

		if(self.dom){
			self.dom = null;
		}
	},

	createButtons: function(){
		var self = this;

		if($.isEmptyObject(self.options.buttons)) return;

		self.buttons = $('<div class="ui2-dialog-buttons">').appendTo(self.wraper);
		self.setButtons(self.options.buttons);
	},

	setButtons: function(buttons){
		var self = this;

		self.buttons.empty();
		
		$.each(buttons, function(index, item){
			if($.isFunction(item)){
				item = {
					events: {
						tap: item
					},

					className: ''
				};	
			}

			var $button = $('<a href="javascript:void(0);" class="ui2-dialog-button" data-dialog-button-name="' + index + '" />').text(index).addClass(item.className).appendTo(self.buttons);

			$.each(item.events, function(event, callback){
				$button.on(event, function(){
					callback.call(self, $button);
				});
			});
		});
	},

	getButton: function(name){
		var $buttons = this.buttons.find('.ui2-dialog-button');

		return typeof name == 'number' ? $buttons.eq(name) : $buttons.filter('[data-dialog-button-name="' + name + '"]');
	},

	//设置title，为false时，则头部会被隐藏掉
	setTitle: function(title){
		var $header = this.wraper.find('.ui2-dialog-header');
		$header.removeClass('ui2-dialog-header-nob');

		if(title === false){
			$header.hide();
		}else if(title == ''){
			$header.addClass('ui2-dialog-header-nob').css('display', 'block');
		}

		$header.find('.ui2-dialog-title').html(title);
	},

	resetPosition: function(){
		var self = this, options = self.options;

		self.mask && self.mask.resetPosition();
		
		var width, height;
		var $window = $(window);

		if(options.width){
			if(/%/.test(options.width)){
				width = $window.width() * parseFloat(options.width) / 100;
			}else{
				width = options.width;
			}
		}

		if(options.height){
			if(/%/.test(options.height)){
				height = $window.height() * parseFloat(options.height) / 100;
			}else{
				height = options.height;
			}
		}

		self.content.css({
			width: width,
			height: height
		});

		self.wraper.css('left', '0px');
		self.wraper.css({
			left: parseInt(($window.width() - self.wraper.width())/2),
			top: parseInt(($window.height() - self.wraper.height())/2)
		});

		options.scroll && new iScroll(self.content[0]);
	},

	open: function(){
		var self = this, options = self.options;

		self.mask && self.mask.open();
		self.wraper.show();
		self.resetPosition();
		
		if(!self.firstOpenStatus){
			self.firstOpenStatus = true;
			self.trigger('firstOpen');
		}

		self.trigger('open');
	},

	close: function(){
		var self = this, options = self.options;

		self.mask && self.mask.close();
		self.wraper.hide();
		self.trigger('close');
	},

	destroy: function(){
		var self = this, options = self.options;

		self.mask && self.mask.destroy();
		self.mask = null;
		
		if(!options.customWraper){
			self.wraper.remove();
			self.releaseDom();
		}else{
			self.releaseDom(self.wraper);
		}

		self.wraper = null;
		self.ofs(window, 'resize');
		options.handle && self.ofs(options.handle, 'tap');
		self.ofs(doc, 'keyup');
		
	}
});