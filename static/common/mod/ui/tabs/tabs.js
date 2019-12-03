var $ = require('../zepto/zepto.js'), Class = require('../class/class.js');

module.exports = Class.$factory('tabs', {
    initialize: function(opt){
        this.options = $.extend({
            dom: null,
            selecter: '> *',
            targetAttr: 'data-target',
            currentClass: '',
            currentIndex: 0,
            event: 'tap'
        }, opt || {});

        this.init();
    },

    init: function(){
        var self = this, opts = self.options;

        self.doms = $(opts.selecter, opts.dom);
        self.initTargets();
        self.initEvent();
        self.to(0);
    },

    refresh: function(){
        this.releaseDoms();
        this.init();
    },

    releaseDoms: function(){
        var self = this;

        self.doms && self.ofs(self.doms, self.options.event);
        self.targets.length = 0;
    },

    initTargets: function(){
        var self = this, attr = self.options.targetAttr;

        self.targets = [];

        self.doms.each(function(){
            self.targets.push(document.getElementById($(this).attr(attr)));
        });
    },
    
    initEvent: function(){
        var self = this, opts = self.options, currentClass = opts.currentClass;

        self.doms.each(function(index, item){
            self.o2s(this, opts.event, function(){
                $.each(self.targets, function(){
                    $(this).hide();
                });

                self.targets[index] && $(self.targets[index]).show();

                if(currentClass){
                    self.doms.removeClass(currentClass);
                    $(this).addClass(currentClass);
                }

                self.trigger('switch', index);

                return false;
            });
        });
    },
    
    to: function(index){
        var self = this, index = index || 0;

        if(index > self.doms.length - 1) return false;
        
        self.t2s(self.doms.eq(index), self.options.event);
    }
});