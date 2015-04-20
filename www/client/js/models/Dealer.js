MPS.model.Dealer = function(){
    this.fields = {
        Dealer_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            //visible:false,
            editable:false
        }),
        Dealer_Name: new MPS.DataTypes.String({ label: ('Name'), required:true, validation:[MPS.Validator.StringNotEmpty] }),
        Dealer_Enabled: new MPS.DataTypes.Boolean({ label: ('Enabled'), required:true }),
        DealerType_ID: new MPS.DataTypes.Model({ label: ('Type'), required:true, searchLocal:true}),        
        Dealer_FinancialBlockEnabled: new MPS.DataTypes.Boolean({ label: ('FinancialBlockEnabled') }),        
        Dealer_BossName: new MPS.DataTypes.String({ label: ('BossName') }),
        Dealer_ActNumber: new MPS.DataTypes.String({ label: ('ActNumber') }),
        Dealer_ActDate: new MPS.DataTypes.Date({
            label: ('ActDate'),
            dateFormat:'DD.MM.YYYY',
            datepickerFormat:'dd.mm.yy',
            //dateMin:'2015-02-03',
            //dateMax:'2015-02-27'
        }),                      
        Dealer_UsePatents: new MPS.DataTypes.Boolean({ label: ('UsePatents') }),        
        Dealer_UseParentInfo: new MPS.DataTypes.Boolean({ label: ('UseParentInfo') }),
        Location_ID: new MPS.DataTypes.Model({ label: ('Location'), loadParams:{OffsetRows:0, FetchRows: 50} }),
        Dealer_Address: new MPS.DataTypes.String({ label: ('Address') }),
        Dealer_UName: new MPS.DataTypes.String({ label: ('UName') }),        
        U_Location_ID: new MPS.DataTypes.Model({ label: ('ULocation'), loadParams:{OffsetRows:0, FetchRows: 50} }),
        Dealer_UAddress: new MPS.DataTypes.String({ label: ('UAddress') }),
        Dealer_BankName: new MPS.DataTypes.String({ label: ('Bank name') }),        
        Dealer_BIK: new MPS.DataTypes.String({ label: ('BIK') }),        
        Dealer_R_Account: new MPS.DataTypes.String({ label: ('SAccount') }),        
        Dealer_C_Account: new MPS.DataTypes.String({ label: ('CAccount') }),
        Dealer_INN: new MPS.DataTypes.String({ label: ('INN') }),        
        Dealer_KPP: new MPS.DataTypes.String({ label: ('KPP') }),        
        Dealer_OKPO: new MPS.DataTypes.String({ label: ('OKPO') }),        
        Dealer_OGRN: new MPS.DataTypes.String({ label: ('OGRN') }),        
        Dealer_ContactName: new MPS.DataTypes.String({ label: ('ContactPerson') }),        
        Dealer_ContactPhone: new MPS.DataTypes.String({ label: ('ContactPhone') }),        
        Dealer_ContactEMail: new MPS.DataTypes.String({ label: ('ContactEMail') }),        
        Dealer_TSPhone: new MPS.DataTypes.String({ label: ('TSPhone') }),        
        Dealer_TechContactEMail: new MPS.DataTypes.String({ label: ('TechContactEmail') }),
        Dealer_NDS: new MPS.DataTypes.Boolean({ label: ('Is NDS payer') }),         
        CommissionProfile_ID: new MPS.DataTypes.Model({ label: ('Default commission profile'), loadParams:{OffsetRows:0, FetchRows: 50} }),        
        TransactionCostProfile_ID: new MPS.DataTypes.Model({ label: ('Transaction Cost Profile'), loadParams:{OffsetRows:0, FetchRows: 50} }),
//        Tariff_ID: new MPS.DataTypes.Model({
        Tariff_ID: new MPS.DataTypes.Int({ label: ('Assigned Tariff') }),
        Interface_ID: new MPS.DataTypes.Model({ label: ('Default interface'), loadParams:{OffsetRows:0, FetchRows: 50} }),
        Dealer_IsOverdraftsFIFO: new MPS.DataTypes.Boolean({ label: ('Is Overdrafts FIFO'), valueLabels:[('From new'),('From old')] }),
        Parent_Dealer_ID: new MPS.DataTypes.Int({ label: ('Parent dealer'), required:true }),
        Parent_Dealer_Name: new MPS.DataTypes.String({
            label: ('Parent dealer'),
            save:false,
            visible:false,
            editable:false
        }),
    };

    
//    if (! this.options.scalarOnly) {
//        this.initModel(this);
//        return this;
//    }
    this.fields.DealerType_ID.of(MPS.model.DealerType);
    this.fields.Location_ID.of(MPS.model.Location);
    this.fields.U_Location_ID.of(MPS.model.Location);
    this.fields.CommissionProfile_ID.of(MPS.model.CommissionProfile);
    this.fields.TransactionCostProfile_ID.of(MPS.model.TransactionCostProfile);
    this.fields.Interface_ID.of(MPS.model.Interface);    
//    this.fields.Tariff_ID.of(MPS.model.Tariff, {scalarOnly:true});
    
    this.initModel(this);
    return this;
};
MPS.model.Dealer.prototype = new MPS.model._base();
MPS.model.Dealer.prototype.name = 'Dealer';
MPS.model.Dealer.prototype.isOwnChild = function(){ return this.fields.Parent_Dealer_ID.val() == this.app.actDealerId; };
MPS.model.Dealer.prototype.getId = function(id){ return this.fields.Dealer_ID; };
MPS.model.Dealer.prototype.getName = function(id){ return this.fields.Dealer_Name; };

MPS.model.Dealer.prototype.toString = function(){ return this.getName().toString(); };
MPS.model.Dealer.prototype.toHTML = MPS.model.Dealer.prototype.toString;






MPS.model.Dealer_Service = function(){
    this.fields = {
        Dealer_Service_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        Service_ID: new MPS.DataTypes.Model({label: ('Service'), required:true }),
        Dealer_ID: new MPS.DataTypes.Model({ label: ('Dealer'), required:true}),
        CommissionProfile_ID: new MPS.DataTypes.Model({label: ('CommissionProfile')}),        
        Dealer_Service_Enabled: new MPS.DataTypes.Boolean({label: ('Enabled'),required:true }),
    };
    this.fields.Service_ID.of(MPS.model.Service);
    this.fields.Dealer_ID.of(MPS.model.Dealer);
    this.fields.CommissionProfile_ID.of(MPS.model.CommissionProfile);
    this.getId = function(id){
        return this.fields.Dealer_Service_ID;
    };
    this.getName = function(id){
        return this.fields.Service_ID.valueModel.getName() || this.getId();
    };
    this.initModel(this);
    return this;
};
MPS.model.Dealer_Service.prototype = new MPS.model._base();
MPS.model.Dealer_Service.prototype.name ='Dealer_Service';



MPS.model.DealerType = function(){
    var _model = this;
    this.fields = {
        DealerType_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        DealerType_Name: new MPS.DataTypes.String({
            label: 'Name',
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        })
    };
    
    this.fields.DealerType_Name.toString = function(){
        if (!(_model.getId()>0)) return '..';
        var s = _model.getName().val();
        if (s.match(/^%.*%$/)) s = MPS.Translation.getText(s.replace(/^%/,'').replace(/%$/,''));
        return  s;
    };
    this.fields.DealerType_Name.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        var s = _model.getName().val();
        if (s.match(/^%.*%$/)) s = MPS.Translation.get(s.replace(/^%/,'').replace(/%$/,''));
        return s;
    };     
    this.initModel(this);
    return this;
};
MPS.model.DealerType.prototype = new MPS.model._base();
MPS.model.DealerType.prototype.name ='DealerType';
MPS.model.DealerType.prototype.getId = function(id){return this.fields.DealerType_ID;};
MPS.model.DealerType.prototype.getName = function(id){return this.fields.DealerType_Name;};
MPS.model.DealerType.prototype.toString = function(){
    if (!(this.getId()>0)) return '..';
    return this.fields.DealerType_Name.toString();
};
MPS.model.DealerType.prototype.toHTML = function(){
    if (!(this.getId()>0)) return '..';
    return this.fields.DealerType_Name.toHTML();
};






