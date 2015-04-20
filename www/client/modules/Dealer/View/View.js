DealerViewModule = function(){
    var _module = this;
    var app = this.getApplication();
    this.run = function(callback){
        var id = this.params.id;
        console.log (id);
        app.api.ajax(
            MPS.model.Dealer,
            'GetInfo', 
            {Dealer_ID: id},
            function(d){
                var c = MPS.model.createCollection(d, MPS.model.Dealer);
                /*app.api.getList(MPS.model.Location, {},function(collection){
                    _module.data.object.fields.Location_ID.setAvailableCollection(collection);
                });*/                
                _module.data.object = c.get(id);

                _module.render(callback);
                
            },
            function(d){console.log('method call failed', d);}
        );

    };

    this.init = function(callback){
        var object = this.data.object;
        MPS.UI.Utils.processModelAttributes(this.$element, object);
        
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
DealerViewModule.prototype = new MPS.View.BaseView();
