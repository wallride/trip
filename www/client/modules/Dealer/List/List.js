DealerListModule = function(){
    var _module = this;
    var app = this.getApplication();
//    this.data.key = app.api.key;
    this.run = function(callback){        
        app.api.getList(
            MPS.model.Dealer,
            {},
            function(collection){
                _module.data.list = collection;
                //console.log(_module.data.list);
                _module.render(callback);
            },
            function(d){console.log('method call failed', d);}
        );
    };   
    
    this.init = function(callback){
        MPS.UI.Utils.processModelAttributes(this.$element);
        if (typeof(callback)==='function') callback();
    };

    return this;
};
DealerListModule.prototype = new MPS.View.BaseView();
