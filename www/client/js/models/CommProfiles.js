MPS.model.TransactionCostProfile = function(){
    var _model = this;
    this.fields = {
        TransactionCostProfile_ID: new MPS.DataTypes.Int({
            alternativeMapping:['Default_TransactionCostProfile_ID'],
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        TransactionCostProfile_Name: new MPS.DataTypes.String({
            alternativeMapping:['Default_TransactionCostProfile_Name'],
            label: 'Name',
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        })
    };
    this.getId = function(id){
        return this.fields.TransactionCostProfile_ID;
    };
    this.getName = function(id){
        return this.fields.TransactionCostProfile_Name;
    };
    this.toString = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.TransactionCostProfile_Name.toString();
    };
    this.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.TransactionCostProfile_Name.toHTML();
    };
    
    this.initModel(this);
    return this;
};
MPS.model.TransactionCostProfile.prototype = new MPS.model._base();
MPS.model.TransactionCostProfile.prototype.name ='TransactionCostProfile';


MPS.model.ProfitCalcType = function(){
    var _model = this;
    this.fields = {
        ProfitCalcType_ID: new MPS.DataTypes.Int({
            alternativeMapping:['Default_ProfitCalcType_ID'],
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        ProfitCalcType_Name: new MPS.DataTypes.String({
            alternativeMapping:['Default_ProfitCalcType_Name'],
            label: ('Name'),
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        }),
        ProfitCalcType_IsFixed: new MPS.DataTypes.Boolean({
            alternativeMapping:['Default_ProfitCalcType_IsFixed'],
            label: ('Fixed profit rate'),
            required:true,
        })
    };
    
    this.fields.ProfitCalcType_Name.toString = function(){
        if (!(_model.getId()>0)) return '..';
        var s = _model.getName().val();
        if (s.match(/^%.*%$/)) {
            s = (s.replace(/^%/,'').replace(/%$/,''));
            s = MPS.Translation.get(s);
        }
        return  s;
    };
    this.fields.ProfitCalcType_Name.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        var s = _model.getName().val();
        if (s.match(/^%.*%$/)) {
            s = (s.replace(/^%/,'').replace(/%$/,''));
            s = MPS.Translation.get(s);
        }
        return s;
    };
    
    this.initModel(this);
    return this;
};
MPS.model.ProfitCalcType.prototype = new MPS.model._base();
MPS.model.ProfitCalcType.prototype.name ='ProfitCalcType';
MPS.model.ProfitCalcType.prototype.getId = function(id){
    return this.fields.ProfitCalcType_ID;
};
MPS.model.ProfitCalcType.prototype.getName = function(id){
    return this.fields.ProfitCalcType_Name;
};
MPS.model.ProfitCalcType.prototype.toString = function(){
    return this.fields.ProfitCalcType_Name.toString();
};
MPS.model.ProfitCalcType.prototype.toHTML = function(){
    return this.fields.ProfitCalcType_Name.toHTML();
};
MPS.model.ProfitCalcType.prototype.isFixed = function(){
    return this.fields.ProfitCalcType_IsFixed.val();
};



MPS.model.CommissionProfileTemplate = function(){
    this.name ='CommissionProfileTemplate';
    this.fields = {
        CommissionProfileTemplate_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        CommissionProfileTemplate_Name: new MPS.DataTypes.String({
            label: ('Name'),
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        }),
        CommissionProfileTemplate_Enabled: new MPS.DataTypes.Boolean({
            label: ('Enabled'),
            required:true,
        }),
        CommissionProfileTemplate_Comment: new MPS.DataTypes.String({
            label: ('Comment'),
            required:true,
        }),
        Dealer_ID: new MPS.DataTypes.Model({
            required:false,
            editable:false,
            save:false
        })
    };
    this.fields.Dealer_ID.of(MPS.model.Dealer);
    
    this.getId = function(id){
        return this.fields.CommissionProfileTemplate_ID;
    };
    this.getName = function(id){
        return this.fields.CommissionProfileTemplate_Name;
    };
    
    this.initModel(this);
    return this;
};
MPS.model.CommissionProfileTemplate.prototype = new MPS.model._base();
MPS.model.CommissionProfileTemplate.prototype.name ='CommissionProfileTemplate';



MPS.model.CommissionProfile = function(){
    var _model = this;
    this.name ='CommissionProfile';
    this.fields = {
        CommissionProfile_ID: new MPS.DataTypes.Int({
            alternativeMapping:['CommissionProfile_ID'],
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        CommissionProfile_Name: new MPS.DataTypes.String({
            alternativeMapping:['CommissionProfile_Name'],
            label: 'Name',
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        })
    };
    
    this.getId = function(id){
        return this.fields.CommissionProfile_ID;
    };
    this.getName = function(id){
        return this.fields.CommissionProfile_Name;
    };
    this.toString = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.CommissionProfile_Name.toString();
    };
    this.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.CommissionProfile_Name.toHTML();
    };
    
    this.initModel(this);
    return this;
};
MPS.model.CommissionProfile.prototype = new MPS.model._base();
MPS.model.CommissionProfile.prototype.name ='CommissionProfile';



