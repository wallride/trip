DealerCreateModule = function(){
    var _module = this;
    var app = this.getApplication();
    this.run = function(callback){
        
        this.data.object = new MPS.model.Dealer();
        //console.log(this.data.object);        
        this.data.object.fields.Parent_Dealer_ID.val(app.actDealerId);
        //console.log(this.data.object.fields.Dealer_ID);        
        
        _module.render(callback);

    };

    this.init = function(callback){
        var object = this.data.object;
        object.fields.Dealer_ID.options.save=false;
        MPS.UI.Utils.processModelAttributes(this.$element, object);

        this.$element.find('button.create').first().click(function(){
            app.api.create(object, function(obj){
                MPS.UI.gotoModelViewPage(obj);
            });
        });
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
DealerCreateModule.prototype = new MPS.View.BaseView();
