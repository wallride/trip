PointViewModule = function(){
    var _module = this;
    var app = this.getApplication();
    
    this.run = function(callback){
        var id = this.params.id;
        console.log (id);
        app.api.ajax(
            MPS.model.Point,
            'GetInfo', 
            {Point_ID: id},
            function(d){
                var c = MPS.model.createCollection(d, MPS.model.Point);
                _module.data.object = c.get(id);
                
                _module.render(callback);
                
            },
            function(d){console.log('method call failed', d);}
        );

    };
    // Загружаем топ
    var loadTop = function(className, id){
        MPS.View.dispatcher.resolveView('_Utils', 'ServiceTop', function(modView){
            MPS.UI.routeLoadingNow = null;
            modView.setElement(_module.$element.find('.ServiceTop'));
            modView.placeLoader();
            modView.setParams({
                className:className,
                id:id
            });
            modView.run();
        });
    };

    this.init = function(callback){
        var object = this.data.object;
        MPS.UI.Utils.processModelAttributes(this.$element, object);
        loadTop('Point', object.getId().val());
        
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
PointViewModule.prototype = new MPS.View.BaseView();
