var $ = require('../../ui/zepto/zepto.js');

function Mask(){
	this.dom = $(__inline('./mask.tpl')).appendTo(document.body);
}

Mask.prototype = {
	hide: function(){
		this.dom.css('display', 'none');
	},

	open: function(){
		this.dom.css('display', 'block');
	}
};

return Mask;
