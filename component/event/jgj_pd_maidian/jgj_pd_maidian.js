require.async(['common:ui/zepto'],function($){
    var logoFuc = {
        init:function(){
            $(document).on('click','.logo_link',function(){
                var dataUrl = $(this).attr('data-url');
                if(dataUrl.indexOf('?') < 0){
                    window.location.href = dataUrl+'?REC='+window.location.href;
                }else{
                    window.location.href = dataUrl+'&REC='+window.location.href;
                }
                
            })
        }
    };
    logoFuc.init();
   
});