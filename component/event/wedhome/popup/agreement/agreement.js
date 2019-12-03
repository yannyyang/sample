require.async("common:zepto", function($) {
    var fuc = {
        
        init:function() {
            this.bindEvent();
        },
        bindEvent: function() {

            require.async('common:dialog',function(Dialog) {
                //实例化弹框组件
                var dialog = new Dialog({
                    dom: '#popAgreement',
                    autoOpen: false,
                    title: "平安好房协议",
                    width: '80%',
                    height: '400px',
                    close: function(){
                        $(document).trigger("popup_thanks_open");
                    }
                });

                $(document).bind("popup_agreement_open", function(event) {
                    dialog.open();
                });

                $(document).bind('popup_agreement_close', function(){
                    dialog.close();
                    window.location.reload();
                });

            });

           



        }
    }

    fuc.init();
});