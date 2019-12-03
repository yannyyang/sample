var $ = require('../zepto/zepto.js');

+function(window, $){
	function NumberInput(opt){	
		this.options = $.extend({
			dom : null,
			max : '',
			min : '',
			step : '',
			value : '', //init value
			currency : false, //货币格式 
			editable : false //是否可编辑
		}, opt || {});
		this.init();
	}

	NumberInput.ADD_TEMPLATE  = '<input type="button" value="+" class="input-number-button"/>';
	NumberInput.MINUS_TEMPLATE = '<input type="button" value="-" class="input-number-button"/>';

	NumberInput.prototype.init = function(){
		var self = this, opt = self.options || {}, $dom = self.dom = $(opt.dom), currency = opt.currency;
		var curStr = ['max','min','step','value'];

		$.each(curStr, function(index, val) {
			var result = opt.val || $dom.attr(val);
			$dom.data(val, NumberInput.format(result));
		});

		!opt.editable && $dom.attr('readonly',true);
		self.generate();
		self.detect($dom.data('value'));
	};

	NumberInput.prototype.generate = function(){
		var self = this, $dom = self.dom;

		$dom.addClass('input-origin-button').wrap('<div class="ui-input-wrap"></div>').show();
		self.add = $(NumberInput.ADD_TEMPLATE).insertAfter($dom);
		self.minus = $(NumberInput.MINUS_TEMPLATE).insertBefore($dom);
		self.bindEvent();
	};

	NumberInput.prototype.bindEvent = function(){
		var self = this , opt = self.options , $dom = self.dom,
			min = $dom.data('min'),
			max = $dom.data('max')

		$(self.minus).add(self.add).bind('click', function() {
			self.operate($(this).val());
		});

		if(opt.editable){
			$dom.bind('input', function(e) {
				var fValue = NumberInput.format($dom.val()),
					result = fValue;
				if($dom.val() === '') return;

				if(fValue >= max){
					result = max;
				}

				
				result = opt.currency ? NumberInput.addComma(result) : result;
				$dom.val(result).data('value',result);
				return false;
			}).bind('keydown', function(e) {
				if(e.which >= 65 && e.which <=90 || e.which <= 111 && e.which >= 106){
					return false;
				}
			});

			$dom.bind('blur',function(){
				var value = $(this).val(),
					fValue = parseFloat($(this).val());

				if(fValue <= min){
					$dom.val(min).data('value',min);
				}	
				self.detect($dom.val());
				if(opt.currency){
					$(this).val(NumberInput.addComma(value));
				} 
				return false;
			})
		}
	};

	NumberInput.prototype.operate = function(operator){
		var self = this, opt = self.options || {}, $dom = self.dom , currency = opt.currency;
		var offset = parseFloat(operator + $dom.data('step')),
			total = offset + $dom.data('value'),
			change = currency ? NumberInput.addComma(total) : total;

		if(total >= $dom.data('min') && total <= $dom.data('max')){
			$dom.val(change)
				.data('value', total)
				.change();
		}
		this.detect(total);
	};

	NumberInput.prototype.detect = function(total){
		var self = this, $dom = self.dom,
			min = $dom.data('min'),
			max = $dom.data('max'),
			add = this.add,
			minus = this.minus;

		total >= max && this.disable(add);
		total <= min && this.disable(minus);

		total > min && this.enable(minus);
		total < max && this.enable(add);
	};

	NumberInput.prototype.disable = function($dom){
		$dom.attr('disabled','disabled')
			.addClass('input-number-disable');
	};

	NumberInput.prototype.enable = function($dom){
		$dom.removeAttr('disabled')
			.removeClass('input-number-disable');
	};

	NumberInput.format = function(num){
		num += '';
		return parseFloat(num.replace(/,/g,''));
	};

	NumberInput.addComma = function(num){
		num += '';
		var reg = /(\d{1,3})(?=(\d{3})+(\.|$))/g;
		return num.replace(reg,'$1,');
	};

	function Plugin(option) {
	    return this.each(function () {
			var $this   = $(this)
			var data    = $this.data('numberInput')
			var options = typeof option == 'object' && option

			if (!data && /destroy|hide/.test(option)) return
			if (!data) $this.data('numberInput', (data = new NumberInput($.extend({dom : this}, options))));
			if (typeof option == 'string') data[option]()
	    })
	}

	var old = $.fn.tooltip;
	$.fn.numberInput = Plugin;
	$.fn.numberInput.Constructor = NumberInput


	// numberInput NO CONFLICT
	// ===================

	$.fn.numberInput.noConflict = function () {
		$.fn.numberInput = old;
		return this;
	}
	module.exports = NumberInput;

}(window,$);
