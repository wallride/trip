Wallride.View ={baseViewPath:'/client/modules/'};
Wallride.View.Dispatcher = function(){
    this.views = {};
    
    this.setBaseViewPath = function(path){
        Wallride.View.baseViewPath = path;
    };
    
    this.resolveView = function(viewPackage, viewName, callback){
        var path = viewPackage+'/'+viewName+'/';
        var className = viewPackage+viewName+'Module';
        var self = this;

        var makeObject = function(){
            var view = window[className];
            if (typeof(view) === 'function'){
                var v = new view();
                v.setName(viewName);
                v.setPath(path);
                self.views[path] = view;
                return v;
            }
            return null;
        };

        if (this.views[path]){
            var obj = makeObject();
            callback(obj);
            return true;
        }
        var url = Wallride.View.baseViewPath + path + viewName+'.js';
        
        Wallride.load.script(url, function(){
            var obj = makeObject();
            if (typeof obj === 'undefined'){
                throw new Exception('Could not rise view of class '+className);
            }
            obj.loadTemplate(function(){
                self.views[path]=obj;
                callback(obj);
            });
        });
    };
    
    return this;
};
Wallride.View.dispatcher = new Wallride.View.Dispatcher();


Wallride.View.BaseView = function(){
    this.viewName = 'default';
    this.path = 'default';
    this.data = {};
    this.template  = null;
    this.$element = null;
    this.params={};

    this.init = function(callback){
        if (typeof(callback)==='function') callback();
    };

    this.setElement = function($e){
        this.$element = $e;
        return this;
    };
    this.setData = function(obj){
        if (obj)
            this.data = obj;
        return this;
    };
    this.setName = function(name){
        this.viewName = name;
        return this;
    };
    this.setPath = function(path){
        this.path = path;
        return this;
    };
    this.setParams = function(obj){
        if (typeof(obj)==='string'){
            var robj={};
            obj.replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) { robj[$1] = $3; }
            );  
            obj = robj;
        }
        if (obj)
            this.params = obj;
        return this;
    };
    this.run = function(callback){
        this.render(callback);
        return this;
    };
    this.render = function(callback){
        var self = this;
        if (!this.$element){
            console.error('no element - no render ', this.viewName);
            callback();
            return;
        }
//        if (!this.template) {
//            console.error('Render '+this.viewName+': no template. ', this.template);
//            return;
//        }
        var act = function(){
            var html = self.template(self.data);
            self.$element.empty().html(html);
            self.init(callback);
        };
//        console.log(this.template);
        if (typeof this.template === 'function') return act();
        else
            this.loadTemplate(act);
    };
    
    this.loadTemplate = function(funcSuccess, funcFail){
        var self = this;
        var tmplId = 'tmpl_'+this.path;
        if (typeof $.render[tmplId] === 'function'){
//            console.log('CACHED');
            self.template = $.render[tmplId];
            if (typeof(funcSuccess)==='function') funcSuccess();
            return;
        }
        Wallride.load.css(Wallride.urls.baseURL+Wallride.urls.modulesPath+this.path+this.viewName+'.css', 'css_'+this.path);
        Wallride.load.tmpl(
            Wallride.urls.baseURL+Wallride.urls.modulesPath+this.path+this.viewName+'.html', 
            tmplId, 
            function(tmpl){
                self.template = tmpl;
//                console.log('Template loaded: ', tmplId, self);
                if (typeof(funcSuccess)==='function') funcSuccess();
            }, 
            function (){
                console.error('fail to load template for '+tmplId);
                if (typeof(funcFail)==='function') funcFail();
            }
        );
    };
    this.placeLoader = function(){
        if (!this.$element) return;
        this.$element.html('<center>loading...</center>');
    };
    
    
        
    return this;
};







 


