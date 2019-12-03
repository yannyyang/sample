/**
 * Created by linkaibin on 15/8/24.
 */
(function(window,document,adapterName){
    "use strict";
    adapterName = adapterName||"App";
    if(window[adapterName]){
        return;
    }
    var app = new Adapter();
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;
    var callindex = 0;
    /**
     * 用ajax访问mockAPI平台，模拟SDK的异步返回操作
     *
     * @param {string} methodName 方法名
     * @param {string} callbackSuccess 成功回调的方法名
     * @param {string} callbackErr 失败回调的方法名
     * @param {string} data 调用native接口所传的数据
     * @param {string} extenalData 调用native接口自定义返回值
     * @return {undefined} 无返回值
     */
    function getMockData(methodName,callbackSuccess,callbackErr,data,extenalData){
        var url = methodName;
        if(Array.isArray(data)){
            url += ( "-" + data.join("") );
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET",app.MOCK_SERVER+url,false);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                if(extenalData && extenalData.returnType && extenalData.returnType.toUpperCase() === "OBJECT"){
                    window[callbackSuccess].call(window,JSON.parse(xhr.responseText));
                }else{
                    window[callbackSuccess].call(window,(xhr.responseText));
                }
            }
        }
        xhr.send(data);
    }
    /**
     * 调用Native接口适配层的构造器
     * @constructor
     */
    function Adapter(){
        var ua = navigator.userAgent.toUpperCase()
        this.IS_ANDROID = ua.indexOf("ANDROID") != -1;
        this.IS_IOS = ua.indexOf("IPHONE OS") != -1;
        this.IS_MOCK = ua.indexOf("MOCK") != -1;
        this.IS_ANYDOOR = ua.indexOf("ANYDOOR") != -1;
        this.MOCK_SERVER =  "http://mock-api.com/rwpDFbk5Zm5Q5E6t.mock/";
    }
    /**
     * 调用一个Native方法
     * @param {Array.<string>   } name 方法名称
     * @param {}
     */
    Adapter.prototype.call = function(name){
        // 获取传递给Native方法的参数
        var self = this;
        var args = slice.call(arguments, 1);
        var successCallback = '' , errorCallback = '' , item = null ,returnArg;
        var methodName = name[name.length-1];
        if(self.IS_ANDROID && self.IS_ANYDOOR){
            if(window.HostApp){
                var _str = "", newArguments = [];
                for(var i=0;i<args.length;i++){
                    if(typeof args[i] === 'function'){
                        var callbackName = methodName+'Callback'+callindex ;
                        window[callbackName] = args[i] ;
                        newArguments.push(callbackName);
                        callindex++ ;
                    }else if(typeof args[i] === 'object'){
                        newArguments.push( JSON.stringify( args[i] ) ) ;
                    }else{
                        newArguments.push(args[i]) ;
                    }
                }
                try{
                    HostApp[methodName].apply(window.HostApp,newArguments);
                }catch(e){
                    console.log(e);
                    //var params = slice.call(arguments, 0);
                    //setTimeout(function(){
                    //    app["call"].apply(app,params);
                    //},300);
                }
            }else{
                var params = slice.call(arguments, 0);
                setTimeout(function(){
                    app["call"].apply(app,params);
                },1000);
            }
        }else if(self.IS_IOS && self.IS_ANYDOOR ){
            var newArguments = "" , tempArgument = [];
            for(var i=0;i<args.length;i++ ){
//                tempArgument = args[i];
                if(typeof args[i] === 'function'){
                    var callbackName = methodName+'Callback'+callindex ;
                    window[callbackName] = args[i] ;
                    tempArgument.push(callbackName);
                    callindex++ ;
                }else{
                    tempArgument.push(args[i]);
                }
            }
            callindex++;
            var iframe = document.createElement("iframe");
            console.log("tempArgument"+tempArgument);
            var _src = 'callnative://'+methodName+'/'+encodeURIComponent(JSON.stringify(tempArgument)) + '/' + callindex;
            console.log(_src);
            iframe.src = _src;
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe= null;
        }else{
            var newArguments = "" , tempArgument = [];
            for(var i=0;i<args.length;i++ ){
                if(typeof args[i] === 'function'){
                    var callbackName = methodName+'Callback'+callindex ;
                    window[callbackName] = args[i];
                    tempArgument.push(callbackName);
                    callindex++ ;
                }else{
                    tempArgument.push(args[i]);
                }
            }
            getMockData(methodName,tempArgument[0],tempArgument[1],tempArgument[2],tempArgument[3]);
        }
    }
    /**
     * 调用物理返回按钮
     *
     * @return {undefined} 没有返回
     */
    Adapter.prototype.goBack = function(){
        if(this.IS_ANDROID && HostApp && HostApp.goBackOrForward){
            this.call(["goBackOrForward"],function(res){
                try{
                    res = JSON.parse(res);
                    var flag = res.result;
                    if(flag == "true"){
                        console.log("success back");
                    }else{
                        console.log("success error");
                    }
                }catch(e){
                }
            },function(err){
            },-1);
        }else{
            history.back();
        }
    }
    /**
     * 判断选择最新版本，用于判断当前版本是否在某一版本之后
     *
     * @param {string} version1 版本号
     * @param {string} version2 版本号
     * @return {string} 最新的版本号
     */
    Adapter.prototype.getLatestVersion = function(version1,version2){
        if(version1 === version2){
            return version1;
        }
        var verArr1 = version1.split(".");
        var verArr2 = version2.split(".");
        var len = verArr1.length>verArr2.length?verArr1.length:verArr2.length;
        for(var i=0;i<len;i++){
            var num1 = parseInt(verArr1[i],10);
            var num2 = parseInt(verArr2[i],10);
            if(num1 > num2){
                return version1;
            }else if(num1 < num2){
                return version2;
            }
        }
        return version1;
    }
    /**
     * 部分插件的首地址为后台的.do服务，由SDK post参数过去后，由插件后台决定应该跳转到什么地址。
     * 这里模拟了SDK的post操作，一般活动集合页或插件跳转时用到
     *
     * @param {string} version1 版本号
     * @param {string} version2 版本号
     * @return {string} 最新的版本号
     */
    Adapter.prototype.postRedirectUrl = function(url,ticketData,deviceData){
        var form = document.createElement("form");
        var itemMap = [
            '<input type="hidden" name="SHA1Value" id="SHA1Value" value="'+ ticketData.signature +'" />',
            '<input type="hidden" name="timestamp" id="timestamp" value="'+ ticketData.timestamp +'" />',
            '<input type="hidden" name="SSOTicket" id="SSOTicket" value="'+ ticketData.SSOTicket +'" />',
            '<input type="hidden" name="deviceId" id="deviceId" value="'+ deviceData.deviceId +'" />',
            '<input type="hidden" name="deviceType" id="deviceType" value="'+ deviceData.deviceType +'" />',
            '<input type="hidden" name="osVersion" id="osVersion" value="'+ deviceData.osVersion +'" />',
            '<input type="hidden" name="anyDoorSdkVersion" id="anyDoorSdkVersion" value="'+ deviceData.anyDoorSdkVersion +'" />',
            '<input type="hidden" name="appVersion" id="appVersion" value="'+ deviceData.appVersion +'" />',
            '<input type="hidden" name="appId" id="appId" value="'+ deviceData.appId +'" />'
        ];
        form.innerHTML = itemMap.join("");
        form.action = url;
        form.method = "POST";
        form.style["display"] = "none";
        document.body.appendChild(form);
        form.submit();
    }
    /**
     * 获取SSOTicket对象的Promise调用
     * @return {Promise} 一个Promise对象
     */
    Adapter.prototype.getSSOTicket = function(){
        var dfd = $.Deferred();
        var self = this;
        self.call(["sendMessage"],function(ticketInfo){
            var ticket = JSON.parse(ticketInfo);
            if(ticket.SSOTicket){
                dfd.resolve(ticket);
            }else{
                dfd.reject({});
            }
        },function(error){
            dfd.reject(error);
        },["getSSOTicket"]);
        return dfd;
    }
    /**
     * 获取设备信息的Promise调用，并缓存
     * @return {Promise} 一个Promise对象
     */
    Adapter.prototype.getDeviceInfo = function(){
        var dfd = $.Deferred();
        var self = this;
        if(self.deviceInfo){
            setTimeout(function(){
                dfd.resolve(self.deviceInfo);
            },16);
            return dfd;
        }else{
            self.call(["sendMessage"],function(deviceData){
                var deviceInfo = JSON.parse(deviceData);
                self.deviceInfo = deviceInfo;
                dfd.resolve(deviceInfo);
            },function(error){
                dfd.reject(error);
            },["getDeviceInfo"]);
        }
        return dfd;
    }
    /**
     * 调用宿主登录
     * @param {string} redirectURL
     * @return {undefined}
     */
    Adapter.prototype.getSSOLogin = function(redirectURL){
        var self = this;
        self.call(["getSSOLogin"],function(msg){
            console.log(msg);
        },function(msg){
            console.log(msg);
        },{
            redirectURL:redirectURL||""
        });
    }
    window[adapterName] = window.RYMJSBRIDGE = app;
})(window,document,"App");