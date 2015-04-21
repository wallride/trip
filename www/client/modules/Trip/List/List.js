TripListModule = function(){
    var _module = this;
    var app = this.getApplication();
    var api=app.api;
    var className = 'Trip';
    var stories = new Wallride.model.Collection();
    var gmap;

    this.run = function(callback){
        gmap = this.packageModule.gmap;
        console.log(gmap);
        _module.render(callback);
        
    };

    this.init = function(callback){
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
TripListModule.prototype = new Wallride.View.BaseView();
