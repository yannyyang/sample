var $ = require('../../ui/zepto/zepto.js');

function bottomLoad(callback) {
	var startPosition, endPosition, deltaX, deltaY, moveLength;
	$(document).bind("touchstart", function(e) {
		var touch = e.touches[0];
        startPosition = {
            x: touch.pageX,
            y: touch.pageY
        }
	})
	if(navigator.userAgent.indexOf("Android") > -1) {
		$(document).bind("touchcancel", function(e) {
	        var touch = e.changedTouches[0];
	        endPosition = {
	            x: touch.pageX,
	            y: touch.pageY
	        }
	        deltaX = endPosition.x - startPosition.x;
	        deltaY = endPosition.y - startPosition.y;
			var scrollTop = $(window).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(window).height();	
			if(scrollTop + windowHeight >= scrollHeight && deltaY < 0){
				callback.call();
		　　}	
		})
	}
	$(document).bind("touchend", function(e) {
        var touch = e.changedTouches[0];
        endPosition = {
            x: touch.pageX,
            y: touch.pageY
        }
        deltaX = endPosition.x - startPosition.x;
        deltaY = endPosition.y - startPosition.y;
		var scrollTop = $(window).scrollTop();
	　　var scrollHeight = $(document).height();
	　　var windowHeight = $(window).height();	
		if(scrollTop + windowHeight >= scrollHeight && deltaY < 0){
			callback.call();
	　　}	
	})
}

return bottomLoad;