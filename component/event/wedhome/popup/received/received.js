require.async("common:zepto", function($) {
    var fuc = {
        
        init:function() {
            this.bindEvent();
        },
        bindEvent: function() {

            require.async('common:dialog',function(Dialog) {
                //实例化弹框组件
                var dialog = new Dialog({
                    dom: '#popReceived',
                    autoOpen: false,
                    title: "",
                    width: '80%',
                    height: 'auto'
                });

                $(document).bind("popup_received_open", function(event) {
                    dialog.open();
                });

                $(document).bind('popup_received_close', function(){
                    dialog.close();
                    // window.location.reload();
                });

            });

            $(".btn_reged").bind("tap", function(){
                $(document).trigger("popup_received_close");
            });


        }
    }

    fuc.init();
});