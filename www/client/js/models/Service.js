MPS.model.Service = function(){
    this.fields = {
        Service_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        Default_Gate_ID: new MPS.DataTypes.Int({
            label: ('Gate'),
            visible:false,
        }),
        Service_Name: new MPS.DataTypes.String({
            label: ('Name'),
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        }),
        Service_TestDate: new MPS.DataTypes.Date({
            label: ('Date'),
            save:false,
            dateFormat:'DD.MM.YY',
            datepickerFormat:'dd.mm.yy',
            dateMin:'2015-02-03',
            dateMax:'2015-02-27'
        }),
        Service_TestLogo: new MPS.DataTypes.Model({
            label: ('Service logo'),
            save:false,
            UIType:'Image'
        })
    };
    this.fields.Service_TestLogo.of(MPS.model.File);
    this.initModel(this);
    return this;
};
MPS.model.Service.prototype = new MPS.model._base();
MPS.model.Service.prototype.name ='Service';
MPS.model.Service.prototype.getId = function(){
    return this.fields.Service_ID;
};
MPS.model.Service.prototype.getName = function(){
    return this.fields.Service_Name;
};




MPS.model.Gate = function(){
    var _model = this;
    this.name ='Gate';
    this.fields = {
        Gate_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        Gate_Name: new MPS.DataTypes.String({
            label: ('Name'),
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        }),
        Gate_Enabled: new MPS.DataTypes.Boolean({
            label: ('Enabled'),
            required:true,
        }),
        Gate_ProfitIsFixed: new MPS.DataTypes.Boolean({
            label: ('Gate profit type'),
            required:true,
            valueLabels:[('Percent'),('Fixed')]
        }),
        Gate_ExternalID: new MPS.DataTypes.Int({
            label: ('Gate external ID'),
        }),
        Gate_ProfitRate: new MPS.DataTypes.Float({
            label: ('Profit rate'),
            required:true,
            unit: function(){ return (_model.fields.Gate_ProfitIsFixed.val()) ? ' ' : '%'},
            validation:[function(attr,errors){
                var v = attr.val();
                if (!_model.fields.Gate_ProfitIsFixed.val()){ //Поле процентное
                    if (v>100){
                        if (errors) errors.add(attr, 'Invalid: Percent greater then 100');
                        return false;
                    }
                }
                return true;
            }]
        }),
        Service_ID: new MPS.DataTypes.Model({
            label: ('Service'),
            loadParams:{OffsetRows:0, FetchRows: 50, Service_Enabled:1},
            required:true,
            editable:false,
        }),
    };
    this.fields.Service_ID.of(MPS.model.Service);
//    this.fields.ProfitCalcType_ID.of(MPS.model.ProfitCalcType);
    
    
    this.initModel(this);
    return this;
};
MPS.model.Gate.prototype = new MPS.model._base();
MPS.model.Gate.prototype.name ='Gate';
MPS.model.Gate.prototype.getId = function(){
    return this.fields.Gate_ID;
};
MPS.model.Gate.prototype.getName = function(){
    return this.fields.Gate_Name;
};

MPS.model.Gate.prototype.toString = function(){
    var serviceName = '';
    if (this.fields.Service_ID.valueModel && this.fields.Service_ID.valueModel.fields.Service_Name){
        serviceName= this.fields.Service_ID.valueModel.fields.Service_Name.toString() + ': ';
    }
    return serviceName + this.getName().toString();
};
MPS.model.Gate.prototype.toHTML = MPS.model.Gate.prototype.toString;

// Определяет, дефолтовый ли это гейт для сервиса
MPS.model.Gate.prototype.isDefault = function(){
    return this.fields.Service_ID.valueModel.fields.Default_Gate_ID.val() == this.fields.Gate_ID.val();
};




MPS.model.ServiceGroup = function(){
    var _model = this;
    this.name ='ServiceGroup';
    this.fields = {
        ServiceGroup_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:true,
            visible:false,
            editable:false
        }),
        ServiceGroup_Name: new MPS.DataTypes.String({
            label: ('Name'),
            required:true,
        }),                 
    };
    
    this.getId = function(){
        return this.fields.ServiceGroup_ID;
    };
    this.getName = function(){
        return this.fields.ServiceGroup_Name;
    };
    this.toString = function(){
        return this.getName().toString();
    };
    this.toHTML = function(){
        return this.toString();
    };
    
    this.initModel(this);
    return this;
};
MPS.model.ServiceGroup.prototype = new MPS.model._base();
MPS.model.ServiceGroup.prototype.name ='ServiceGroup';




/**
 * Коллекция кнопок с услугами и группами услуг, которые являются топовыми для агента, терминала или "интерфейса"
 * @returns {MPS.model.ServiceTop}
 */
MPS.model.ServiceTop = function(){
    var _model = this;
    this.name ='ServiceTop';
    this.fields = {
        ServiceTop_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:true,
            visible:false,
            editable:false
        }),
        Dealer_ID: new MPS.DataTypes.Model({
            label: ('Dealer'),
            required:true,
            editable:false,
            save:false
        }),                 
        Point_ID: new MPS.DataTypes.Model({
            label: ('Dealer'),
            required:false,
            editable:false,
            save:false
        }),                 
    };
    this.fields.Dealer_ID.of(MPS.model.Dealer);
    this.fields.Point_ID.of(MPS.model.Point);
    
    this.getId = function(){
        return this.fields.ServiceTop_ID;
    };
    this.getName = function(){
        return this.fields.ServiceTop_ID;
    };
    this.toString = function(){
        return this.getId().toString();
    };
    this.toHTML = function(){
        return this.toString();
    };
    
    this.initModel(this);
    return this;
};
MPS.model.ServiceTop.prototype = new MPS.model._base();
MPS.model.ServiceTop.prototype.name ='ServiceTop';



MPS.model.ServiceTopButton = function(){
    var _model = this;
    this.name ='ServiceTopButton';
    this.fields = {
        ServiceTopButton_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:true,
            visible:false,
            editable:false
        }),
        Type: new MPS.DataTypes.Enumeration({
            required:true,
            save:false,
        }),                 
        ServiceTop_ID: new MPS.DataTypes.Model({
            label: ('Service top'),
            required:true,
        }),                 
        Service_ID: new MPS.DataTypes.Model({
            label: ('Service'),
        }),                 
        ServiceGroup_ID: new MPS.DataTypes.Model({
            label: ('Service group'),
        }),                 
        ServiceTopButton_Order: new MPS.DataTypes.Int({
            required:true,
        }),                 
    };
    this.fields.ServiceTop_ID.of(MPS.model.ServiceTop);
    this.fields.Service_ID.of(MPS.model.Service);
    this.fields.ServiceGroup_ID.of(MPS.model.ServiceGroup);
    this.fields.Type.addAvailable(0,'Service');
    this.fields.Type.addAvailable(1,'Service group');
    
    this.getId = function(){
        return this.fields.ServiceTopButton_ID;
    };
    this.getName = function(){
        return this.fields.Service_ID.val() ? this.fields.Service_ID : this.fields.ServiceGroup_ID;
    };
    this.toString = function(){
        return this.getName().toString();
    };
    this.toHTML = function(){
        return this.toString();
    };
    
    this.initModel(this);
    return this;
};
MPS.model.ServiceTopButton.prototype = new MPS.model._base();
MPS.model.ServiceTopButton.prototype.name ='ServiceTopButton';




/**
 * @returns {MPS.model.Dealer_Service}
 */
MPS.model.Dealer_Service = function(){
    var _model = this;
    this.fields = {
        Dealer_Service_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        Dealer_ID: new MPS.DataTypes.Model({ label: ('Dealer'), editable:false, required:true }),
        Service_ID: new MPS.DataTypes.Model({ label: ('Service'), editable:false, required:true, showLink:true }),
        CommissionProfile_ID: new MPS.DataTypes.Model({ label: ('Commission profile') }),
        Default_CommissionProfile_ID: new MPS.DataTypes.Model({ label: ('Default Commission Profile'), editable:false }),
        Dealer_Service_EnabledForPoints: new MPS.DataTypes.Boolean({ label: ('Service Gate enabled for Points') }),
    };
    this.fields.Dealer_ID.of(MPS.model.Dealer);
    this.fields.Service_ID.of(MPS.model.Service);
    this.fields.CommissionProfile_ID.of(MPS.model.CommissionProfile);
    this.fields.Default_CommissionProfile_ID.of(MPS.model.CommissionProfile);
    
    this.initModel(this);
    return this;
};
MPS.model.Dealer_Service.prototype = new MPS.model._base();
MPS.model.Dealer_Service.prototype.name ='Dealer_Service';
MPS.model.Dealer_Service.prototype.getId = function(){
    return this.fields.Dealer_Service_ID;
};
MPS.model.Dealer_Service.prototype.getName = function(){
    return this.fields.Service_ID.valueModel ? this.fields.Service_ID.valueModel.getName() : this.fields.Dealer_Service_ID;
};


/**
 * @returns {MPS.model.Point_Service}
 */
MPS.model.Point_Service = function(){
    var _model = this;
    this.fields = {
        Point_Service_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        Dealer_ID: new MPS.DataTypes.Model({ label: ('Dealer'), editable:false, required:true }),
        Service_ID: new MPS.DataTypes.Model({ label: ('Service'), editable:false, required:true, showLink:true }),
        CommissionProfile_ID: new MPS.DataTypes.Model({ label: ('Commission profile') }),
        Default_CommissionProfile_ID: new MPS.DataTypes.Model({ label: ('Default Commission Profile'), editable:false }),
        Dealer_Service_EnabledForPoints: new MPS.DataTypes.Boolean({ label: ('Service Gate enabled for Points') }),
    };
    this.fields.Dealer_ID.of(MPS.model.Dealer);
    this.fields.Service_ID.of(MPS.model.Service);
    this.fields.CommissionProfile_ID.of(MPS.model.CommissionProfile);
    this.fields.Default_CommissionProfile_ID.of(MPS.model.CommissionProfile);
    
    this.initModel(this);
    return this;
};
MPS.model.Point_Service.prototype = new MPS.model._base();
MPS.model.Point_Service.prototype.name ='Point_Service';
MPS.model.Point_Service.prototype.getId = function(){
    return this.fields.Point_Service_ID;
};
MPS.model.Point_Service.prototype.getName = function(){
    return this.fields.Service_ID.valueModel ? this.fields.Service_ID.valueModel.getName() : this.fields.Point_Service_ID;
};
