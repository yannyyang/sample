require.async(["common:ui/zepto","common:ui/tips"], function($,Tips) {
    
    var fuc={
        init:function(){
            this.bindEvent();
        },
        bindEvent:function(){
            $('.ios_jump').click(function(){
                //埋点
                var aa = globalLog.getArgusObj(); 
                bb = $.extend(aa, {"self_event_type": "LSJY_CLICK_XZIOS"});
                globalLog.send(bb);
                
                var downloadUrl=$(this).attr('data-url');
                $(this).attr('href',downloadUrl);
                window.location.href=$('.ios_jump').attr('data-url');
            });

            $('.android_jump').click(function(){
                //埋点
                var aa = globalLog.getArgusObj(); 
                bb = $.extend(aa, {"self_event_type": "LSJY_CLICK_XZAD"});
                globalLog.send(bb);

                var downloadUrl=$(this).attr('data-url');
                $(this).attr('href',downloadUrl);
            });

        }
    }

    fuc.init();

});