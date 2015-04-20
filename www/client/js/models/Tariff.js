
MPS.model.Tariff = function(options){
    var _model = this;
    this.options = $.extend({scalarOnly:false}, options);
    this.name ='Tariff';
    this.fields = {
        Tariff_ID: new MPS.DataTypes.Int({ label: ('ID'), required:false, visible:false, editable:false }),
        Tariff_Name: new MPS.DataTypes.String({ label: ('Name'), required:true, validation:[MPS.Validator.StringNotEmpty] }),
        Tariff_Enabled: new MPS.DataTypes.Boolean({ label: ('Enabled'), required:true, }),
        Dealer_ID: new MPS.DataTypes.Model({ label: ('Dealer'), required:true, editable:false, })
        /*
        Default_TransactionCostProfile_ID: new MPS.DataTypes.Model({
            label: ('Transaction cost profile'),
            loadParams:{OffsetRows:0, FetchRows: 50, TransactionCostProfile_Enabled:1},
        }),
        Default_ProfitCalcType_ID: new MPS.DataTypes.Model({
            label:('Profit type'),
            required:true
        }),
        Tariff_DefaultProfitRate: new MPS.DataTypes.Float({
            label: ('Profit rate'),
            unit: function(){ return (_model.fields.Default_ProfitCalcType_ID.val()) ? ' ' : '%'}
        }),
        */
    };
    
    
//    if (! this.options.scalarOnly) {
//        this.initModel(this);
//        return this;
//    }
    this.fields.Dealer_ID.of(MPS.model.Dealer, {scalarOnly:true});
//    this.fields.Default_ProfitCalcType_ID.of(MPS.model.ProfitCalcType);
//    this.fields.Default_TransactionCostProfile_ID.of(MPS.model.TransactionCostProfile);

    this.initModel(this);
    return this;
};
MPS.model.Tariff.prototype = new MPS.model._base();
MPS.model.Tariff.prototype.name ='Tariff';
MPS.model.Tariff.prototype.getId = function(id){ return this.fields.Tariff_ID; };
MPS.model.Tariff.prototype.getName = function(id){ return this.fields.Tariff_Name; };
MPS.model.Tariff.prototype.isOwn = function(){ return this.fields.Dealer_ID.val() == this.app.actDealerId; };


MPS.model.Tariff_Gate = function(){
    var _model = this;
    var getProfitUnit = function(){
        return (_model.fields.ProfitCalcType_ID.isFixed()) ? '   ' : '%';
    };
    this.fields = {
        Tariff_Gate_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        Gate_ID: new MPS.DataTypes.Model({
            label: ('Gate'),
            loadParams:{OffsetRows:0, FetchRows: 50, Gate_Enabled:1},
            required:true,
            editable:false,
        }),
        Service_ID: new MPS.DataTypes.Model({
            label: ('Service'),
            loadParams:{OffsetRows:0, FetchRows: 50, Gate_Enabled:1},
            required:false,
            showLink:false,
            editable:false,
            save:false
        }),
        Tariff_ID: new MPS.DataTypes.Model({
            label: ('Tariff'),
            required:true,
            editable:false,
            showLink:true
        }),
        ProfitCalcType_ID: new MPS.DataTypes.Model({
            label: ('Profit type'),
            loadParams:{OffsetRows:0, FetchRows: 50},
            required:true
        }),
        TransactionCostProfile_ID: new MPS.DataTypes.Model({
            label: ('Transaction cost profile'),
            loadParams:{OffsetRows:0, FetchRows: 50, TransactionCostProfile_Enabled:1},
            validation:_model.validation.TransactionCostProfile_ID
        }),
        Tariff_Gate_ProfitRate: new MPS.DataTypes.Float({
            label: ('PROFIT_RATE'),
            unit: getProfitUnit,
            validation:_model.validation.Tariff_Gate_ProfitRate 
        }),
        /**
         * Maximum value from inherited/parent Tariff_Gate
         */
        InheritedMaxProfitRate: new MPS.DataTypes.Float({
            label: ('PROFIT_RATE'),
            unit: getProfitUnit,
            save:false, editable:false
        }),
        Tariff_Gate_ProfitMaxValue: new MPS.DataTypes.Float({
            label: ('PROFIT_RATE'),
            validation:_model.validation.Tariff_Gate_ProfitMinValue         
        }),
        Tariff_Gate_ProfitMinValue: new MPS.DataTypes.Float({
            label: ('PROFIT_RATE'),
            validation:_model.validation.Tariff_Gate_ProfitMinValue            
        })
    };
    this.fields.Gate_ID.of(MPS.model.Gate);
    this.fields.Service_ID.of(MPS.model.Service);
    this.fields.Tariff_ID.of(MPS.model.Tariff);
    this.fields.ProfitCalcType_ID.of(MPS.model.ProfitCalcType);
    this.fields.TransactionCostProfile_ID.of(MPS.model.TransactionCostProfile);
    this.fields.ProfitCalcType_ID.isFixed = function(){
        var f = _model.fields.ProfitCalcType_ID;
        if (f.valueModel && !_.isUndefined(f.valueModel.isFixed)){
            return f.valueModel.isFixed();
        }
        return false;
    };

    
    this.initModel(this);
    return this;
};
MPS.model.Tariff_Gate.prototype = new MPS.model._base();
MPS.model.Tariff_Gate.prototype.name ='Tariff_Gate';
MPS.model.Tariff_Gate.prototype.getId = function(){
    return this.fields.Tariff_Gate_ID;
};
MPS.model.Tariff_Gate.prototype.getName = function(){
    return this.fields.Gate_ID;
};
MPS.model.Tariff_Gate.prototype.validation = {
    Tariff_Gate_ProfitMinValue:[
        function(attr, errors){
            var _model = attr.model;
            if (!_.isNull(attr.val())){
                if( !_.isNull(_model.fields.Tariff_Gate_ProfitMaxValue.val()) 
                    && attr.val()>_model.fields.Tariff_Gate_ProfitMaxValue.val()){
                        errors.add(attr, 'Greater then Max value');
                        return false;
                }
                if( !_.isNull(_model.fields.Tariff_Gate_ProfitRate.val()) 
                    && _model.fields.ProfitCalcType_ID.isFixed() 
                    && attr.val()>_model.fields.Tariff_Gate_ProfitRate.val()){
                        errors.add(attr, 'Greater then Profit rate');
                        return false;
                }
            }
            return true;
        }
    ],
    
    Tariff_Gate_ProfitMaxValue:[
        function(attr, errors){
            var _model = attr.model;
            if (!_.isNull(attr.val())){
                if( !_.isNull(_model.fields.Tariff_Gate_ProfitMinValue.val()) 
                    && attr.val()<_model.fields.Tariff_Gate_ProfitMinValue.val()){
                        errors.add(attr, 'Less then Min value');
                        return false;
                }
                if( !_.isNull(_model.fields.Tariff_Gate_ProfitRate.val()) 
                    && _model.fields.ProfitCalcType_ID.isFixed() 
                    && attr.val()<_model.fields.Tariff_Gate_ProfitRate.val()){
                        errors.add(attr, 'Less then Profit rate');
                        return false;
                }
            }
            return true;
        }
    ],

    Tariff_Gate_ProfitRate:[
        function(attr, errors){
            var _model = attr.model;
            if (_.isNull(attr.val()) || attr.val()<0){
                errors.add(attr, 'Must be greater or equal 0');
                return false;
            }
//            if (attr.val()<=0 && _.isNull(_model.fields.TransactionCostProfile_ID.val())){
//                errors.add(attr, 'Cannot be 0 if Transaction Cost Profile is\'t specified');
//                return false;
//            }
            var inhVal = _model.fields.InheritedMaxProfitRate.val();
            if (!_.isNull(attr.val()) && _model.fields.ProfitCalcType_ID.val()!=2 && !_.isNull(inhVal) && inhVal>=0 && attr.val()>inhVal){
                errors.add(attr, 'Cannot be greater then inerited value: %1%', inhVal);
                return false;
            }
            return true;
        },
        function(attr, errors){
            var _model = attr.model;
            var v = attr.val();
            if (!_.isNull(v) && !_model.fields.ProfitCalcType_ID.isFixed()){
                return MPS.Validator.PercentRange(attr, errors);
            }
            return true;
            
        },
        function(attr, errors){
            var _model = attr.model;
            if (!_.isNull(attr.val())
                && _model.fields.ProfitCalcType_ID.isFixed()
                && !_.isNull(_model.fields.Tariff_Gate_ProfitMinValue.val()) 
                && attr.val()<_model.fields.Tariff_Gate_ProfitMinValue.val()){
                    errors.add(attr, 'Less then Min value');
                    return false;
            }
            if (!_.isNull(attr.val()) 
                && _model.fields.ProfitCalcType_ID.isFixed()
                && !_.isNull(_model.fields.Tariff_Gate_ProfitMaxValue.val()) 
                && attr.val()>_model.fields.Tariff_Gate_ProfitMaxValue.val()){
                    errors.add(attr, 'Greater then Max value');
                    return false;
            }
            return true;
        }
    ],
    TransactionCostProfile_ID:[
        function(attr, errors){
//            var _model = attr.model;
//            if (_.isNull(attr.val()) && _.isNull(_model.fields.Tariff_Gate_ProfitRate.val())){
//                errors.add(attr, 'Must be specified if the profit rate equals 0');
//                return false;
//            }
            return true;
        }
    ]
};


