PointCreateModule = function(){
    var _module = this;
    var app = this.getApplication();
    this.run = function(callback){
        
        this.data.object = new MPS.model.Point();
        //console.log(this.data.object);        
        this.data.object.fields.Dealer_ID.val(app.actDealerId);
        //console.log(this.data.object.fields.Dealer_ID);        
        
        _module.render(callback);

    };

    this.init = function(callback){
        var object = this.data.object;
        object.fields.Point_ID.options.save=false;
        MPS.UI.Utils.processModelAttributes(this.$element, object);
        /*app.api.getList(MPS.model.TransactionCostProfile, {TransactionCostProfile_Enabled:1},
            function(collection){
                transactionCostProfileCollection = collection;
                app.api.getList(MPS.model.ProfitCalcType, {},
                    function(collection){
                        profitCalcTypeCollection = collection;
                        object.fields.Default_TransactionCostProfile_ID.setAvailableCollection(transactionCostProfileCollection);
                        object.fields.Default_ProfitCalcType_ID.setAvailableCollection(profitCalcTypeCollection);
                    }
                );
            }
        ); */
        this.$element.find('button.create').first().click(function(){
            app.api.create(object, function(obj){
                MPS.UI.gotoModelViewPage(obj);
            });
        });
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
PointCreateModule.prototype = new MPS.View.BaseView();
