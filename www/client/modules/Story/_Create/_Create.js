Story_CreateModule = function(){
    var _module = this;
    var app = this.getApplication();
    var api=app.api;
    var className = 'Story';

//    this.run = function(callback){
//        _module.render(callback);
//    };

    this.init = function(callback){
        Wallride.UI.form.init(
            _module.$element.find('form').first(), 
            function(params){
                console.log('ON SUBMIT',params);
                api.ajax(className,'create', params, 
                    function(data){
                        console.log('create',data);
                        _module.params.welcomeModule.run();
                    }
                );
            }
        );
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
Story_CreateModule.prototype = new Wallride.View.BaseView();
