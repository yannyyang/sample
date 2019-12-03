/**
 * rpc client for LightService
 *
 * @author Yuan B.J.
 * @copyright Yuan B.J., 2014.09.17
 */

/*jslint browser: true*/
var LightService = (function() {
    'use strict';
    var Status = {
        SUCCESS: 0,
        PARSE_ERROR: -32700,
        INVALID_REQUEST: -32600,
        METHOD_NOT_EXISTS: -32601,
        INVALID_PARAMS: -32602,
        INTERNAL_ERROR: -32603,
        desc: function(code) {
            var ret = 'unknown error',
                self = this;

            switch (code) {
                case self.SUCCESS:
                    ret = 'success';
                    break;
                case self.PARSE_ERROR:
                    ret = 'invalid request was received by the server';
                    break;
                case self.INVALID_REQUEST:
                    ret = 'The sent is not a valid request object';
                    break;
                case self.METHOD_NOT_EXISTS:
                    ret = 'The method does not exist / is not available';
                    break;
                case self.INVALID_PARAMS:
                    ret = 'invalid method parameter(s)';
                    break;
                case self.INTERNAL_ERROR:
                    ret = 'internal error';
                    break;
            }

            return ret;
        }
    };

    function Request() {
        this.method = null;
        this.params = null;
        this.id = null;
    }

    Request.create = function(method, params, id) {
        var req = new Request();
        req.method = method;
        req.params = params || null;
        req.id = id || null;
        return req;
    };

    function Response() {
        this.result = null;
        this.error = null;
        this.id = null;
    }

    Response.success = function(result, id) {
        var rep = new Response();
        rep.result = result;
        rep.id = id || null;
        return rep;
    };

    Response.error = function(error, id) {
        var rep = new Response();

        if (error.code) {
            rep.error = {
                code: error.code,
                message: error.message,
                data: error.data || null
            };
        } else {
            rep.error = {
                code: error
            };
        }

        rep.id = id || null;
        return rep;
    };

    var JsonRpcProtocol = {
        encodeRequest: function(req) {
            return JSON.stringify({
                jsonrpc: '2.0',
                method: req.method,
                params: req.params,
                id: req.id
            });
        },
        decodeResponse: function(str) {
            var data = JSON.parse(str);
            return data.error ?
                Response.error(data.error, data.id) :
                Response.success(data.result, data.id);
        }
    };

    function Ghost(transport, protocol) {
        this.transport = transport;
        this.protocol = protocol;
    }

    Ghost.prototype.module = function(name) {
        var self = this;
        var ret = new Ghost(self.transport, self.protocol);
        ret.module_ = name;
        return ret;
    };

    Ghost.prototype.exec_ = function(verb, args) {
        var self = this;
        var req;
        var method;

        if (self.module_) {
            method = [self.module_, args[0]];
        } else {
            var m = args[0].match(/(\w+)[\/\.](\w+)/);

            if (m) {
                method = [m[1], m[2]];
            } else {
                method = [args[0]];
            }
        }

        var cb = args.pop();
        req = Request.create(method.join('.'), args.slice(1));

        var httpBuildQuery = function(obj) {
            var pieces = [];

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    pieces.push(encodeURI(key + '=' + obj[key]));
                }
            }

            return pieces.join('&');
        };

        self.transport.send(
            'get' === verb ? httpBuildQuery(req) : self.protocol.encodeRequest(req),
            verb,
            function(err, data) {
                if (err) {
                    var errno = Status.INTERNAL_ERROR;
                    cb({
                        errno: errno,
                        errstr: Status.desc(errno)
                    });
                } else {
                    var rep = self.protocol.decodeResponse(data);

                    if (rep.error) {
                        cb({
                            errno: rep.error.code,
                            errstr: rep.error.code.message || Status.desc(rep.error.code)
                        });
                    } else {
                        cb(undefined, rep.result);
                    }
                }
            }
        );
    };

    Ghost.prototype.execGet = function() {
        return this.exec_('get', Array.prototype.slice.call(arguments));
    };

    Ghost.prototype.execPost = function() {
        return this.exec_('post', Array.prototype.slice.call(arguments));
    };

    Ghost.prototype.execute = Ghost.prototype.execPost;

    function Xhr(uri) {
        this.uri_ = encodeURI(uri);
    }

    var appendQueryStr = function(uri, str) {
        return uri + (uri.indexOf('?') === -1 ? '?' : '&') + str;
    };

    Xhr.prototype.send = function(msg, verb, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open(verb, encodeURI(('get' === verb) ? appendQueryStr(this.uri_, msg) : this.uri_));
        xhr.onload = function() {
            if (200 === xhr.status) {
                cb(undefined, xhr.responseText);
            } else {
                cb(new Error('request failed. returned status of ' + xhr.status));
            }
        };

        if ('post' === verb) {
            xhr.send(msg);
        } else {
            xhr.send();
        }
    };

    Xhr.prototype.post = function(msg, cb) {
        this.send(msg, 'post', cb);
    };

    Xhr.prototype.get = function(msg, cb) {
        this.send(msg, 'get', cb);
    };

    var extend = function(obj1, obj2) {
        for (var key in obj2) {
            var val = obj2[key];

            if (val && Object.prototype.toString.call(val) === '[object Object]') {
                obj1[key] = obj1[key] || {};
                extend(obj1[key], val);
            } else {
                obj1[key] = val;
            }
        }

        return obj1;
    };

    var Service = {
        cache_: {},
        conf_: {},
        importConf: function(conf) {
            extend(this.conf_, conf);
        },
        createService: function(name) {
            if (!this.conf_[name] || !this.conf_[name].conf) {
                return false;
            }

            var conf = this.conf_[name].conf;
            var transport = new Xhr(conf.url);

            var protocol;

            if (conf.protocol === 'jsonrpc') {
                protocol = JsonRpcProtocol;
            } else {
                protocol = conf.protocol;
            }

            return new Ghost(transport, protocol);
        },
        get: function(name, shared) {
            shared = (undefined === shared) || shared;

            if (shared && this.cache_[name]) {
                return this.cache_[name];
            }

            var service = this.createService(name);

            if (shared && service) {
                this.cache_[name] = service;
            }

            return service;
        }
    };

    return Service;
}());

return LightService;