_Utils_HeaderModule = function(){
    var _module = this;
    /**
     * @type Wallride.Application
     */
    var app = this.getApplication();
    var api=app.api;

    
    this.run = function(callback){
        this.data.user = app.user;
        console.log(this.$element);
        _module.render(callback);
    };

    this.init = function(callback){
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
_Utils_HeaderModule.prototype = new Wallride.View.BaseView();
