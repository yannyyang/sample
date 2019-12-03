require.async(["common:ui/zepto"], function($) {

    var userInfo = {};
    try {
        userInfo.userID = window.hfuserinfo.userid();
    } catch(e) {
        userInfo.userID = "";
    }
    try {
        userInfo.token = window.hfuserinfo.token();
    } catch(e) {
        userInfo.token = "";
    }
    //中间页
    (function(){
        console.log(userInfo);
        $.ajax({
            url: window.loginUrl,
            type: "POST",
            data: userInfo,
            success: function(data) {
                if (data.status == 1) {
                   window.location.href= window.eventUrl;
                }
            },
            complete: function(){},
            error: function(data){}
        })
    })();

});




