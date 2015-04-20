Wallride.Application = function(options, onload){
    var _APP = this;
    var settings = {
        baseURL:'/client/',
        apiPath:'index_api.php',
        modulesPath:'modules/'
    };
    if (options) $.extend(settings, options);
    Wallride.urls = settings;
    
    
    this.user=null;
    
    
    this.exception ={
        /**
         * @param {int} code
         * @param {string} message
         * @param {object} data
         * @returns {MPS.exception}
         */
        base:function(code, message, data){
            /**
             * @todo define typical exception codes. Who knows what for :)
             */
            this.code = code ? code : 666;
            this.message = message;
            this.data = data;
            console.error('Exception:' ,code, message, data);
            return this;
        },
        ajax:function(code, message, data){
            this.prototype = new _APP.exception.base(code, message, data);
            return this;
        }
    };
    
    this.api = {
        key:null,
        setKey:function(key){
            _APP.api.key = key;
        },
        
        /**
         * Осуществляет обращение к API для вызова методов (процедур БД).
         * Это низкоуровневая версия ajax-запроса, тонко конфигурируемая
         * @param {string} className class name
         * @param {string} method процедура
         * @param {object} params otional
         * @param {function} successCallback optional
         * @param {function} failCallback optional
         * @returns {void}
         */
        ajax: function(className, method, params, successCallback, failCallback){
            var classN = _.isFunction(className) ? className.prototype.name : className;
            var data = $.extend(params,{
                _fmt:'json',
                utoken:_APP.api.key,
                params: params
            });
            $.ajax(
                '/index_api.php?_object='+classN+'&_method='+method,
                {
                    type:'post',
                    dataType:'json',
                    data: data,
                    success: function(data){
                        if (data && data.status && data.status.code === 200){
                            if (_.isFunction(successCallback)) successCallback(data.data);
                        }
                        else{
                            if (_.isFunction(failCallback)) failCallback(data);
                        }
                    },
                    error: function(data){
                        if (_.isFunction(failCallback)) failCallback(data);
                    }
                }
            );
        },
        get: function(className, id, successCallback){
            _APP.api.ajax(className,'get', {id:id}, function(data){
                var o = new className();
                o.setData(data.object);
                successCallback(o);
            }, function(d){console.error('method call failed', d);});
        },
        list: function(model, params, successCallback){
            _APP.api.ajax(model.prototype.name,'list', params, function(data){
                successCallback(Wallride.model.createCollection(data.list, model));
            }, function(d){console.error('method call failed', d);});
        },
        update: function(model, successCallback, attributes){
            if (attributes){
                if (!_.isArray(attributes)) attributes = [attributes];
                var params={};
                params[model.getId().name] = model.getId().val();
                for (var i=0; i<attributes.length; i++){
                    var attr = attributes[i];
                    if (!attr.validate()) throw _APP.exception.base(400,'model is invalid');
                    var v = attr.val();
                    if (_.isNull(v) && attr instanceof MPS.DataTypes.Float) v=-1;
                    params[attr.name] = v;
                }
            }
            else{
                if (!model.validate()) throw _APP.exception.base(400,'model is invalid');
                var params = model.prepareFieldsParams();
            }
            _APP.api.ajax(model.name,'update', params, function(data){
                if (attributes){
                    for (var i=0; i<attributes.length; i++){
                        var attr = attributes[i];
                        attr.val(data.object[attr.name]);
                    }
                }
                else model.setData(data.object); //обновляем всё
                if (_.isFunction(successCallback)) successCallback(model);
            }, function(d){console.error('method call failed', d);});
        },
        delete:function(model, callback){
            var params={};
            params[model.getId().name] = model.getId().val();
            _APP.api.ajax(model.name, 'delete', params,
                function(d){
                    MPS.model.collections[model.name].delete(model.getId().val());
                    if (_.isFunction(callback)) callback();
                },
                function(d){console.error('method call failed', d);}
            );
        }
    };



    var loadScript = Wallride.load.script;
    
    this.language ='en_EN';

    this.loggedIn = function(data){
        var user = new Wallride.model.User();
        user.setData(data);
        _APP.user = user;
//        Wallride.UI.router.navigate('Welcome');
//        Wallride.UI.router.page('Welcome');
        Wallride.UI.router = new Wallride.UI.Router();
        Backbone.history.start();  // Запускаем HTML5 History push   
        Wallride.View.dispatcher.resolveView('_Utils', '_Header', function(modView){
            Wallride.UI.routeLoadingNow = null;
            modView.setElement($('#_page_header'));
            modView.run();
        });
        
        
    };
    this.loggedOut = function(){
        Wallride.UI.router = new Wallride.UI.Router();
        Backbone.history.start();  // Запускаем HTML5 History push   
        Wallride.UI.router.navigate('Sign/In/');
        Wallride.UI.router.page('Sign', 'In');
    };
    
    Wallride.load.css(settings.baseURL+'css/style.css', 'mainCSS_2_0');
    // Адовая гора последовательного подключения JS-файлов
    // В конечном варианте всё это выносится в HEAD основного html-файла приложения
    loadScript(settings.baseURL+'lib/Wallride/ViewsDispatcher.js', function(){
        loadScript(settings.baseURL+'modules/routing.js', function(){
            try{
                _APP.api.ajax('User','login', {}, 
                    function(d){
                        _APP.api.key = d.token.utoken;
                        _APP.loggedIn(d.object);
                    }, 
                    function(d){
                        _APP.loggedOut();
                    }
                );  
            } catch(e){
                Wallride.UI.router = new Wallride.UI.Router();
                Backbone.history.start();  // Запускаем HTML5 History push   
                _APP.loggedOut();
            }
            if (typeof onload === 'function') onload();
        });
    });
    return this;
};