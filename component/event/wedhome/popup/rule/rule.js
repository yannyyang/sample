require.async("common:zepto", function($) {
    var fuc = {
        
        init:function() {
            this.bindEvent();
        },
        bindEvent: function() {

            require.async('common:dialog',function(Dialog) {
                //实例化弹框组件
                var dialog = new Dialog({
                    dom: '#popRule',
                    autoOpen: false,
                    title: "活动规则",
                    width: '80%',
                    height: 'auto'
                });

                $(document).bind("popup_rule_open", function(event) {
                    dialog.open();
                });

                $(document).bind('popup_rule_close', function(){
                    dialog.close();
                    window.location.reload();
                });

            });

           



        }
    }

    fuc.init();
});