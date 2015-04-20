Wallride = {
    UI:{},
    View:{},
    Utils:{},
    load:{},
    model:{}
};
Wallride.load = {
    script: function(url, funcSuccess){
        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= url;
        var done = function(){
            if (typeof funcSuccess ==='function') funcSuccess();
        };
        script.onreadystatechange= function () {
            if (this.readyState === 'complete') done();
        };
        script.onload = done;
        head.appendChild(script);
    },
    html: function(url, $target, funcSuccess){
        $.ajax(
            url,
            {
                dataType: 'html',
                crossDomain: true,
                success: function($data, text, jqXHR){
                    $target.empty().append($data);
                    if (typeof(funcSuccess)=='function') funcSuccess();
                },
                error: function(jqXHR, textStatus, errorThrown){
                }
            }
        );
    },
    tmpl: function(url, id, funcSuccess, funcFail){
        $.ajax({
//                    url:'/get.php?url='+escape(url), 
                url:url, 
                dataType:'text',
                crossDomain: true,
                success: function(data, text, jqXHR){
                    $.templates(id, data ); // url will be the identifier for template
                    if (typeof(funcSuccess)==='function') funcSuccess($.render[id]);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log('Failed load tmpl from ', url, jqXHR, errorThrown);
                    if (typeof(funcFail)==='function') funcFail();
                }
            }
        );
    },
    css: function(url, id){
        if (typeof id!=='undefined' && id!==null)
            id= 'MPS_css_'+id;
        var head= document.getElementsByTagName('head')[0];
        if (id){
            var old = document.getElementById(id);
            if (old)
                head.removeChild(old);
        }
        if (url.length>0){
            var e= document.createElement('link');
            if (id)
                e.id = id;
            e.rel= 'stylesheet';
            e.href= url;
            head.appendChild(e);
        }
    }
};

//MPS.dictionary = {};
//MPS.dictionaryMessage = function(key){
//    if (!MPS.dictionary || !MPS.dictionary[key] || typeof MPS.dictionary[key] === 'undefined') return key;
//    return MPS.dictionary[key];
//};

/**
 * Абстрактный класс, обеспечивающий евентную модель для любого потомка.
 * Реализует функции хранения и вызова ивентов.
 * @abstract
 * @returns {MPS.Utils.Events}
 */
Wallride.Utils.Events = function(){
    this.MPSEvents = {};
    
    /**
     * 
     * @param {string} eventName Name of the event to call. 
     * @param {function} fn
     * @returns {int} key of function in array of events for the specified name
     */
    this.bindEvent = function(eventName, fn){
        if (!_.isFunction(fn)){ 
            console.error('bindEvent called with non-function parametr: ', fn);
            return;
        }
        if (_.isUndefined(this.MPSEvents[eventName])) this.MPSEvents[eventName] = [];
        this.MPSEvents[eventName].push(fn);
        return this.MPSEvents[eventName].length-1;
    };
    
    /**
     * Calls functions binded to the specified eventName
     * @param {string} eventName
     * @returns {undefined}
     */
    this.fireEvent = function(eventName, arg){
        var fns = this.MPSEvents[eventName];
        if (_.isArray(fns)){
            for (var i=0; i<fns.length; i++){
                fns[i](arg || null);
            }
        }
    };
    
    return this;
};