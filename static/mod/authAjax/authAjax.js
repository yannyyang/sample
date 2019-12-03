var $ = require('common:zepto');

function authAjax(ops) {
	var newSuccess = ops.success;
	$.ajax($.extend(ops,{
		success:function(data) {
			newSuccess.call(this,data);
			if(!data.status && data.errno == "login_timeout") {location.href = data.data.url;}
		}
	}));
}

return authAjax;