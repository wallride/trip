SignUpModule = function(){
    var _module = this;
    var app = this.getApplication();
    var api=app.api;
    var className = 'User';

    
    this.run = function(callback){
        _module.render(callback);
    };

    this.init = function(callback){
        Wallride.UI.form.init(
            _module.$element.find('form').first(), 
            function(params){
                console.log('ON SUBMIT',params);
                api.ajax(className,'register', params, 
                    function(data){
                        console.log('',data);
                    }
                );
            }
        );
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
SignUpModule.prototype = new Wallride.View.BaseView();
