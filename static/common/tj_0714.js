/**
 * @description 自主开发原生js 统计脚本类库
 * @creater by huangjia
 * @version 3.3
 * @modify at 20170714 by ypf
 **/
 
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(a){return 10>a?"0"+a:a}function this_value(){return this.valueOf()}function quote(a){return rx_escapable.lastIndex=0,rx_escapable.test(a)?'"'+a.replace(rx_escapable,function(a){var b=meta[a];return"string"==typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g,h=gap,i=b[a];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(a)),"function"==typeof rep&&(i=rep.call(b,a,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,g=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,c=0;f>c;c+=1)g[c]=str(c,i)||"null";return e=0===g.length?"[]":gap?"[\n"+gap+g.join(",\n"+gap)+"\n"+h+"]":"["+g.join(",")+"]",gap=h,e}if(rep&&"object"==typeof rep)for(f=rep.length,c=0;f>c;c+=1)"string"==typeof rep[c]&&(d=rep[c],e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));return e=0===g.length?"{}":gap?"{\n"+gap+g.join(",\n"+gap)+"\n"+h+"}":"{"+g.join(",")+"}",gap=h,e}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","    ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(a,b,c){var d;if(gap="",indent="","number"==typeof c)for(d=0;c>d;d+=1)indent+=" ";else"string"==typeof c&&(indent=c);if(rep=b,b&&"function"!=typeof b&&("object"!=typeof b||"number"!=typeof b.length))throw new Error("JSON.stringify");return str("",{"":a})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&"object"==typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),void 0!==d?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
 
(function() {
    var doc = window['document'],
        elMsg = document.getElementById('J_page_msg'),
        docElem = doc && doc.documentElement,
        abody = doc.getElementsByTagName("body")[0],
        uaStr = navigator.userAgent.toLowerCase(),
        UA = {};
 
    if (!abody) {
        setTimeout(arguments.callee, 40);
        return;
    }
 
    // 统计url
    var baseDomain = config.aURL.baseDomain;
    var tractUrl = "//tongji."+baseDomain;
    // var tractUrl = "//tongji.pinganfang.com/";
    // var tractUrl = "//tongji.dev.anhouse.com.cn/";
 
    // 约定页面字段变量
    var pageIdAttrStr = 'data-pageid',            // 页面标示埋点id data属性
        pageId = 'page_id',                       // 页面标示埋点id key
 
        pgUrl = 'page_url',                       // 网页url地址
        pgTitle = 'page_title',                   // 网页title
 
        pgServerTimeAttrStr = 'data-servertime',   // 页面初始时间 data属性
        pgServerTime = 'page_server_time',         // 服务器端页面初始化创建页面 key
 
        domReadyTime = 'domready_time',             // 页面dom创建页面 key
        onloadTime = 'onload_time',                 // 卸载页面时间 key
        unloadTime = 'unload_time',                 // 卸载页面时间 key
 
        referUrl = 'refer_url',               // 来源页面 key
        eventType = 'event_type',             // 标准事件方法 key
        cookieKey = 'cookie_str',             // key字段
 
        elType = 'el_type',                 // 标签元素类型 key
        elHrefUrl = 'el_href',              // 元素href 链接 url
        elSrcUrl = 'el_src',                // 元素src 链接 url
 
        mdid = 'el_mdid',                   // 元素埋点id key
        mdidAttr = 'data-mdid',             // 元素埋点id data属性
 
        dataAttrKey = 'el_data',            // 元素data数据属性 key
        elDataAttr = 'data-eldata',         // 元素 data数据属性
 
        selfEventKey = 'self_event_type',   // 自定义元素事件 key
        self_domReadyEvent = 'dom_ready',   // 自定义元 页面domready事件
        elEventAttr = 'data-eventstr',      // 元素data 自定义事件 元素属性
 
        autoFaxKey = 'data-autofax',        // 是否自动发送统计数据( click、mouseover、mouseout )
        elClickAttr = 'data-clicked',        // 是否单击过
 
        screenWidth = 'screen_width',       // 屏幕高度 px
        screenHeight = 'screen_height',     // 屏幕宽度 px
 
        tracMouseOver = false,               // 是否禁用鼠标移入统计
        tracMouseOut = false,                // 是否禁用鼠标移出统计
        tracClick = true,                    // 是否禁用鼠标单击统计
 
        mouseClickTime = 'mouse_click_time', // 鼠标单击时间戳
        mouseOverTime = 'mouse_over_time',   // 鼠标移入时间戳
        mouseOutTime = 'mouse_out_time';     // 鼠标移出时间戳
 
    // 内置变量
    var L = location,
        isHttps = "https:" == L.protocol,
        isIframe = parent !== self,
        urlPath = L.pathname,
        hrefStr = location.href,
        refStr = doc.referrer || '',
        standardEventModel = !!(doc && doc.addEventListener),
        isFrameElements = (window.frameElement == null) && doc.documentElement,
        doScroll = docElem && docElem.doScroll,
        targetEl = null,                    // 目标元素
        argusObj = {},                      // 页面参数对象
        timeObj = {},                       // 事件定时器对象
        ignoreSecondsTime = 800,            // 鼠标移入、单击、移出 统计忽略时间
        autoFaxDefault = false,             // 所有el元素 移入、单击、移出 是否自动统计发送，默认false不发送
        encodeObj = {                       // encode编码方法 对象集合 用于编码方法灵活调用
            "encodeURI" : encodeUrl,
            "decodeURI" : decodeUrl,
            "encodeURIComponent" : encodeUrlCompt,
            "decodeURIComponent" : decodeUrlCompt
        };
 
    /**
     * 事件绑定方法
     * @param el {element}
     * @param type {string}
     * @param fn {callback}
     */
    var addEventListener = standardEventModel ? function (el, type, fn) {
        el.addEventListener(type, fn, false);
    } : function (el, type, fn) {
        el.attachEvent('on' + type, fn);
    },
    removeEventListener = standardEventModel ? function (el, type, fn) {
        el.removeEventListener(type, fn, false);
    } : function (el, type, fn) {
        el.detachEvent('on' + type, fn);
    };
 
    // 对外api接口
    var globalLog = {
 
        /**
         * 手动调用方法 发送一个get请求
         * @param url {string}
         * @param data {object}
         * @param encodeType {string}
         */
        send: function(url, data, encodeType) {
            var imgObj = new Image(),
                imgObjKey = "_img_" + Math.random(),
                arguLength = arguments.length,
                faxData,
                purl,
                furl;
 
            if( isUrl(url) ){
                purl = url;
                faxData = isObject(data) && !!data ? data : argusObj;
            }else if( isObject(url) ){
                purl = tractUrl;
                faxData = url;
            }
 
            if(arguLength < 1){
                purl = tractUrl;
                faxData = argusObj;
            }

            faxData = faxData || {};
            faxData._random_ = Math.random();
 
            furl = objToUrl(faxData, purl, encodeType);
            window[imgObjKey] = imgObj;
            imgObj.onload = imgObj.onerror = function() {
                window[imgObjKey] = null;
            };
            imgObj.src = furl;
            imgObj = null;
        },
 
        /**
         * object对象 转换成url get请求参数
         * @param obj {object}
         * @param url {string}
         * @param encodeType {string}
         * @param encodeType {function} callback 函数方法
         * @return {string}
         */
        objToUrl: objToUrl,
 
        /**
         * url get请求 string参数 转换成 json object对象
         * @param urlParams {string}
         * @param decodeType {string}
         * @param decodeType {function}
         * @returns {object}
         */
        urlParamsToObj: urlParamsToObj,
 
        /**
         * 标准encodeURI 或者 encodeURIComponent 解码url params参数
         * @param val {string}
         * @param decodeType {string}
         * @param decodeType {function}
         * @returns {Number|string}
         */
        decodeParams: decodeParams,
 
        /**
         * 标准事件绑定/移除方法
         * @param el {element}
         * @param type {string}
         * @param fn {callback}
         */
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
 
        /**
         * 直接指定向那个url地址发送统计请求；
         * @returns tractUrl {string} 返回最终引用的url
         */
        setTractUrl: function(url){
            if( isUrl(url) ) tractUrl = url;
            return tractUrl;
        },
 
        /**
         * setIgnoreTime 设置鼠标hover悬停、click等
         * @param secds {number}  忽略时间毫秒数
         * @returns {number}      默认/最终 忽略时间毫秒数
         */
        setIgnoreTime: function(secds){
            if( isNumber(secds) && secds >= 0 ){
                ignoreSecondsTime = secds;
            }
            return ignoreSecondsTime;
        },
 
        /**
         * 设置全局参数对象 argusObj 值
         * @param keyStr {string}  参数对象属性值key 字符串
         * @param keyStr {object}  想要设置的--数据对象
         * @param val {object}   想要设置的--属性值
         * @return argusObj {object}
         */
        setArgusObj: function(keyStr, val){
            if(isString(keyStr) && keyStr){
                argusObj[keyStr] = val;
            }else if( isObject(keyStr) ){
                for( key in keyStr){
                    argusObj[key] = keyStr[key];
                }
            }
            return argusObj;
        },
 
        /**
         * 获取参数对象 argusObj
         * @return argusObj {object}
         */
        getArgusObj: function(){
            return argusObj;
        },
 
        /**
         *  去除空格方法(默认去除两端空格)
         * @param str {string} 字符串
         * @param isAll {boolean} 是否去除全部空格
         * @returns {string} 处理完的字符串
         */
        trim: trim,
 
        /**
         * 设定全局页面元素是否 自动统计
         * @param isAutoFax
         */
        setAutoFaxDefault: function(isAutoFax){
            if( isBoolean(isAutoFax) ){
                autoFaxDefault = isAutoFax;
            }
        },
 
        /**
         * 初始化埋点统计类库默认参数，如：autoFaxDefault、ignoreSecondsTime、tractUrl
         * initConfig({
         *     tractUrl: url,                   // 统计url地址 默认线上 tongji.pinganfang.com； 开发环境：tongji.dev.anhouse.com.cn
         *     autoFaxDefault: true || false,   // 是否开启全局元素埋点统计监控，默认不开启；
         *     ignoreSecondsTime: number        // 连续触发的间隔忽略时间配置，默认800毫秒
         *     tracClick: true,                 // 是否跟踪监控单击事件, 默认true 开启跟踪
         *     tracMouseOver: false,             // 是否跟踪监控鼠标移入事件, 默认false 不开启跟踪
         *     tracMouseOut: false               // 是否跟踪监控鼠标移出事件, 默认false 不开启跟踪
         * });
         * @param obj {object}  参数对象
         */
        initConfig: function(obj){
            if(!isObject(obj)) return;
 
            this.setAutoFaxDefault(obj['autoFaxDefault']);
            this.setIgnoreTime(obj['ignoreSecondsTime']);
            this.setTractUrl(obj['tractUrl']);
 
            if( isBoolean( obj['tracMouseOver'] ) ){
                tracMouseOver = obj['tracMouseOver'];
            }
 
            if( isBoolean( obj['tracMouseOut'] ) ){
                tracMouseOut = obj['tracMouseOut'];
            }
 
            if( isBoolean( obj['tracClick'] ) ){
                tracClick = obj['tracClick'];
            }
        },
 
        /**
         * 字符串 和 对象数值 转换方法
         * @param val {string || object}
         * @param isParse {boolean} 是否是字符串话  默认为false 转换成字符串
         * @returns {string || object}
         */
        stringifyParse : stringifyParse,
 
        /**
         * 判断是否是该浏览器
         * @param index {string}
         * @returns {Boolean}
         */
        isBrowser: isBrowser,
        UA: UA
    };
 
    /* ********************************************************** 页面方法 ************************************************************* */
 
    initParamsObj();
    initSend();
 
    /**
     * 页面统计参数对象初始化参数 =>  页面id && pgServerTime && referUrl && cookie && doc url && doc title && screen
     * @returns argusObj {object}
     */
    function initParamsObj(){
        argusObj[pageId] = getAttr(elMsg, pageIdAttrStr);
        argusObj[pgServerTime] = getAttr(elMsg, pgServerTimeAttrStr);
 
        argusObj[referUrl] = refStr;
        argusObj[cookieKey] = doc.cookie;
 
        argusObj[pgUrl] = hrefStr;
        argusObj[pgTitle] = doc.title || '';
 
        getViewport();
 
        return argusObj;
    }
 
    /**
     * js 初始化发送 页面访问日志
     */
    function initSend(){
        // 记做dom可用
        argusObj[eventType] = self_domReadyEvent;
        argusObj[domReadyTime] = getCurSeconds();
 
        // 直接发送访问上报
        globalLog.send( argusObj );
    }
 
    /**
     * 页面事件基本处理方法：统计元素、事件类型、元素id、链接src 4大基本数据收集
     * @param el {eventTarget}  事件目标对象元素
     * @param evStr {eventType}  事件类型 字符串
     * @param callback {function}
     * @returns argusObj {object}
     */
    function eventCallback(el, evStr, callback){
        var el = el || null,
            evStr = isString(evStr) ? evStr : '',
            evType = el && el.nodeType,
            elHrefStr = getAttr(el, 'href');
 
        // 记录标签类型
        if(evType == 1){
            argusObj[elType] = el.tagName.toLocaleLowerCase();
        }else if(evType == 9){
            argusObj[elType] = 'document';
        }
 
        // 记录事件类型
        argusObj[eventType] = evStr;
 
        // 记录元素埋点id
        argusObj[mdid] = getAttr(el, mdidAttr);
 
        // 元素数据字段
        argusObj[dataAttrKey] = getAttr(el, elDataAttr);
 
        // 自定义 业务事件名称 字符串
        argusObj[selfEventKey] = getAttr(el, elEventAttr);
 
        // 获取el元素 href/src 链接地址
        argusObj[elHrefUrl] = isUrl(elHrefStr) ? elHrefStr : '';
        argusObj[elSrcUrl] = getAttr(el, 'src');
 
        // 如果有回调函数
        if( isFunction(callback) ){
            callback.apply(this, [el, evStr]);
        }
 
        return argusObj;
    }
 
    /**
     * 记录鼠标操作时间 => 如：移入时间、移出时间、单击时间;
     * @param el {element}  html 具体元素
     * @param evStr {eventType}  事件类型 字符串
     * @return argusObj {obj}
     */
    function mouseTime(el, evStr){
        var el = el || null,
            isClicked = el && getAttr(el, elClickAttr) === 'true' ? true : false,
            evStr = isString(evStr) ? evStr : '';
 
        if(!el){
            argusObj[mouseOverTime] = 0;
            argusObj[mouseOutTime] = 0;
            argusObj[mouseClickTime] = 0;
            return;
        }
 
        // 时间 判断逻辑 与 记录
        switch(evStr){
            case 'mouseover' :
                argusObj[mouseOverTime] = getCurSeconds();
                argusObj[mouseOutTime] = 0;
                argusObj[mouseClickTime] = 0;
                targetEl = el;
                return argusObj;
 
            case 'mouseout' :
                argusObj[mouseOutTime] = getCurSeconds();
                if( el == targetEl && !isClicked ){
                    argusObj[mouseClickTime] = 0;
                }
                return argusObj;
 
            case 'click' :
                argusObj[mouseClickTime] = getCurSeconds();
                setAttr(el, elClickAttr, 'true');
                argusObj[mouseOutTime] = 0;
                return argusObj;
        }
    }
 
    /**
     * 获取当前时间毫秒数
     * @returns {number}
     */
    function getCurSeconds(){
        return new Date().getTime();
    }
 
    /**
     * 阻止事件冒泡
     * @param ev {eventObject} 事件对象
     */
    function cancelBubbleAll(ev){
        if( !ev || !ev.type ) return;
 
        if(standardEventModel){
            ev.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }
    }
 
    /**
     * 判断元素是否自动发送监控数据  默认自动发送
     * @param el {htmlElement }
     * @returns {boolean}
     */
    function isAutoFax(el){
        var dataAutoVal = trim( getAttr(el, autoFaxKey) ),
            isAuto = (dataAutoVal === 'true') ? true : autoFaxDefault;
        return isAuto;
    }
 
 
    // 页面载入完成 onload  发送 页面访问日志
    addEventListener(window, 'load', function(ev){
        eventCallback(doc, 'load', function(){
            argusObj[onloadTime] = getCurSeconds();
            globalLog.send( argusObj );
        });
    });
 
    // 页面卸载之前收集卸载时间信息
    addEventListener(window, 'beforeunload', function(ev){
        eventCallback(doc, 'beforeunload', function(){
            argusObj[unloadTime] = getCurSeconds();
            globalLog.send(argusObj);
        });
    });
 
    // click事件
    addEventListener(doc, 'click', function(ev){
        var evEl = ev.target || ev.srcElement,
            evStr = ev.type,
            isAuto = isAutoFax(evEl);
 
        if( !tracClick || !isAuto ) return;
 
        cancelBubbleAll(ev);
 
        setTimeOut('preventMultipleClicks', function(){  // Prevent multiple clicks
            mouseTime(evEl, evStr);
            eventCallback(evEl, evStr, function(){
                globalLog.send(argusObj);
            });
        }, ignoreSecondsTime);
    });
 
    // 鼠标移入 -->默认延迟0.8秒执行
    addEventListener(doc, 'mouseover', function(ev){
        var evEl = ev.target || ev.srcElement,
            evStr = ev.type,
            isAuto = isAutoFax(evEl);
 
        if( !tracMouseOver || !isAuto ) return;
 
        cancelBubbleAll(ev);
 
        setTimeOut('overTimeoutIndex', function(){
            mouseTime(evEl, evStr);
            eventCallback(evEl, evStr);
        }, ignoreSecondsTime);
    });
 
    // 鼠标移出 -->默认延迟0.8秒执行 记录移出 操作
    addEventListener(doc, 'mouseout', function(ev){
        var evEl = ev.target || ev.srcElement,
            evStr = ev.type,
            isAuto = isAutoFax(evEl);
 
        if( !tracMouseOut || !isAuto ) return;
 
        cancelBubbleAll(ev);
 
        setTimeOut('outTimeoutIndex', function(){
            mouseTime(evEl, evStr);
            eventCallback(evEl, evStr, function(){
                globalLog.send(argusObj);
            });
        }, ignoreSecondsTime);
    });
 
 
 
    /**
     * 定时器设置 默认最小30毫秒
     * @param timeObjIndex {object}  定时器缓冲对象序号
     * @param callback {function}
     * @param time     {number}
     */
    function setTimeOut(timeObjIndex, callback, time){
        var time = isNumber(time) && time >= 0 ? time : 30;
 
        if(timeObj[timeObjIndex]){
            clearTimeout( timeObj[timeObjIndex] );
            timeObj[timeObjIndex] = null;
        }
        timeObj[timeObjIndex] = setTimeout(callback, time);
    }
 
    /**
     * decodeURI
     * @param str {string}
     * @param prostr {string}
     **/
    function decodeUrl(str, prostr) {
        var Aw = prostr || "";
        if (str) {
            try {
                Aw = decodeURI(str);
            } catch (Ay) {
            }
        }
        return Aw
    }
 
    /**
     * encodeUrl
     * @param str {string}
     * @param prostr {string}
     **/
    function encodeUrl(str, prostr) {
        var Aw = prostr || "";
        if (str) {
            try {
                Aw = encodeURI(str);
            } catch (Ay) {
            }
        }
        return Aw
    }
 
    /**
     * encodeURIComponent
     * @param str {string}
     * @param prostr {function}
     **/
    function encodeUrlCompt(str, prostr) {
        var Aw = prostr || "";
        if (str) {
            try {
                Aw = encodeURIComponent(str);
            } catch (Ay) {
            }
        }
        return Aw
    }
 
    /**
     * decodeURIComponent
     * @param str {string}
     * @param prostr {function}
     **/
    function decodeUrlCompt(str, prostr) {
        var Aw = prostr || "";
        if (str) {
            try {
                Aw = decodeURIComponent(str);
            } catch (Ay) {
            }
        }
        return Aw
    }
 
    /**
     * 获取属性值
     * @param elem {element}
     * @param index {string}
     **/
    function getAttr(elem, index) {
        return elem && elem.getAttribute ? ( elem.getAttribute(index) || "" ) : "";
    }
 
    /**
     * 设置属性值
     * @param elem {element}
     * @param attr {string}
     * @param val {string}
     **/
    function setAttr(elem, attr, val) {
        if (elem && elem.setAttribute) {
            try {
                elem.setAttribute(attr, val);
            } catch (Ay) {
 
            }
        }
    }
 
    /**
     * 移除属性值
     * @param elem {element}
     * @param attr {string}
     **/
    function removeAttr(elem, attr) {
        if (elem && elem.removeAttribute) {
            try {
                elem.removeAttribute(attr);
            } catch (Ax) {
                setAttr(elem, attr, "");
            }
        }
    }
 
    /**
     * 是否是对象
     * @param lum {string|object|number|array...}
     **/
    function isObject(lum) {
        return Object.prototype.toString.call(lum) === "[object Object]";
    }
 
    /**
     * 是否是数组
     * @param lum {string|object|number|array...}
     **/
    function isArray(lum) {
        return Object.prototype.toString.call(lum) === "[object Array]";
    }
 
    /**
     * 是否是数字
     * @param lum {string|object|number|array...}
     **/
    function isNumber(lum) {
        return Object.prototype.toString.call(lum) === "[object Number]";
    }
 
    /**
     * 是否是函数方法
     * @param lum {string|object|number|array...}
     **/
    function isFunction(lum) {
        return Object.prototype.toString.call(lum) === "[object Function]";
    }
 
    /**
     * 是否是字符串
     * @param lum {string|object|number|array...}
     **/
    function isString(lum) {
        return Object.prototype.toString.call(lum) === "[object String]";
    }
 
    /**
     * 是否是Boolean值
     * @param lum {string|object|number|array...}
     **/
    function isBoolean(lum){
        return Object.prototype.toString.call(lum) === "[object Boolean]";
    }
 
    /**
     * 是否是url
     * @param url {string} url str
     * @returns {boolean}
     */
    function isUrl(url){
        return isString(url) && /^((http|https)?:?\/\/)?[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]':+!]*([^<>""])*$/.test(url);
    }
 
    /**
     * 是否找到字符值
     * @param str {string}
     * @param index {string}
     **/
    function hasIndex(str, index) {
        return str.indexOf(index) != -1;
    }
 
    /**
     * 解码url params参数
     * @param val {string}
     * @param decodeType {string}
     * @param decodeType {function}
     * @returns {Number|string}
     */
    function decodeParams(val, decodeType){
        if(!isString(val)){
            return val;
        }
 
        var val = val || '',
            nan = isNaN(val);
 
        if(isFunction(decodeType) ){
            val = decodeType(val);
        }else if(isString(decodeType)){
            var decodeFn = encodeObj[decodeType];
 
            if( isFunction(decodeFn) ){
                val = decodeFn( decodeFn(val) );
            }
        }else{
            val = decodeUrlCompt( decodeUrlCompt(val) );
        }
 
        // 数字字符串
        if( val && !nan && (nan+'' !== 'NaN') && val.replace(/\s/g, '') ){
            val = Number(val);
        }
 
        return val;
    }
 
    /**
     * url string参数 转换成 json object对象
     * @param urlParams {string}
     * @param decodeType {string}
     * @param decodeType {function}
     * @returns {object}
     */
    function urlParamsToObj(urlParams, decodeType) {
        var Af = isString(urlParams) ? urlParams.split("&") : [],
            Ae = Af.length,
            Ag = 0,
            Ai = {},
            urlStr,
            Ah;
 
        if( hasIndex(Af[0], '?') ){
            Af[0] = Af[0].slice( Af[0].indexOf('?')+1 );
        }
 
        for (; Ag < Ae; Ag++) {
            Ah = Af[Ag].split("=");
            urlStr = decodeParams(Ah[1], decodeType);
            Ai[Ah[0]] = stringifyParse( urlStr, true );
        }
        return Ai;
    }
 
    /**
     * object对象 转换成url参数
     * @param obj {object} 标准json数据格式
     * @param url {string}
     * @param encodeType {string} encode方式(标准字符串类型)
     * @param encodeType {function} callback 函数方法
     * @return {string} 对value值进行两端空格过滤
     */
    function objToUrl(obj, url, encodeType) {
        var url = isUrl(url) ? ( url.indexOf('?') == -1 ? (url+'?') : ( url.indexOf('=') != -1 && url.charAt( url.length-1 ) != '&' ? (url+'&') : url.indexOf('=') == -1 && url.charAt( url.length-1 ) != '?' ? (url+'=&') : url ) ) : '',
            encodeTypeFn = isString(encodeType) && encodeObj[encodeType],
            encodeFn = isFunction(encodeTypeFn) ? encodeTypeFn : encodeUrlCompt,
            obj = isObject(obj) ? obj : {},
            keyVal,
            keyValeStr,
            apramStr = [];
 
        for( key in obj ){
            keyVal = stringifyParse(obj[key]),
            keyValeStr = encodeFn( keyVal );
            apramStr.push( key + '=' + keyValeStr );
        }
        url += apramStr.join('&');
        return url;
    }
 
    /**
     * 数据值字符串对象数值转换
     * @param val {string || object}
     * @param isParse {boolean} 是否是字符串化
     * @returns {string || object}
     */
    function stringifyParse(val, isParse){
        var valStr = '';
 
        if( !val || isFunction(val) ){
            return valStr;
        }
 
        if( isNumber(val) ){
            return val;
        }
 
        if(isParse){
            try{
                valStr = JSON.parse(val);
            }catch(e){
                valStr = trim(val);
            }
        }else{
            valStr = isString(val) ? trim(val) : JSON.stringify(val);
        }
 
        return valStr;
    }
 
 
    /**
     *  去除空格方法
     * @param str {string} 字符串
     * @param isAll {boolean} 是否去除全部空格
     * @returns {string} 处理完的字符串
     */
    function trim(str, isAll){
        if( !isString(str) ){
            return str;
        }
        var str = str || '';
 
        if(isAll){
            str = str.replace(/\s+/g, '');
        }else{
            str = str.replace(/^\s+|\s+$/g, '');
        }
        return str;
    }
 
    /**
     * 获取浏览器视窗宽高
     * @returns {object}
     */
    function getViewport(){
        var widthPx = window.innerWidth,
            heightPx = window.innerHeight;
 
        if( isNumber(widthPx) ){
            argusObj[screenWidth] = isBrowser('safari') ? widthPx + 3 : widthPx;
            argusObj[screenHeight] = heightPx;
            return argusObj;
        }
 
        if( doc.compatMode == 'CSS1Compat' ){
            argusObj[screenWidth] = docElem.clientWidth + 20;
            argusObj[screenHeight] = docElem.clientHeight + 3;
        }else{
            argusObj[screenWidth] = abody.clientWidth + 17;
            argusObj[screenHeight] = abody.clientHeight + 17;
        }
        return argusObj;
    }
 
    /**
     * 判断浏览器
     * @param index {string}
     * @returns {Boolean}
     */
    function isBrowser(index) {
           var s;
 
        (s = uaStr.match(/msie ([\d.]+)/)) ? UA.ie = s[1] :
            (s = uaStr.match(/firefox\/([\d.]+)/)) ? UA.firefox = s[1] :
                (s = uaStr.match(/chrome\/([\d.]+)/)) ? UA.chrome = s[1] :
                    (s = uaStr.match(/opera.([\d.]+)/)) ? UA.opera = s[1] :
                        (s = uaStr.match(/version\/([\d.]+).*safari/)) ? UA.safari = s[1] : 0;
 
        return UA[index] ? true : false;
    }
 
 
    // 全局变量
    window.globalLog = globalLog;
    window.goldlog_queue = [];
    window.JSON = JSON;
 
})();