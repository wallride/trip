MPS.model.Point = function(){
    this.name ='Point';
    this.fields = {
        Point_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            editable:false
        }),
        Point_Name: new MPS.DataTypes.String({
            label: ('Name'),
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        }),
        PointType_ID: new MPS.DataTypes.Model({
            label: ('Type'),
            required:true,
        }),
        Dealer_ID: new MPS.DataTypes.Model({
            label: ('Dealer'),
            required:true,
            editable:false,
        }),                 
        Point_Enabled: new MPS.DataTypes.Boolean({
            label: ('Enabled'),
            required:true,
        }),
        Point_Serial: new MPS.DataTypes.String({
            label: ('SerialNumber'),
        }),
        Point_SendPaymentPointMessages: new MPS.DataTypes.Boolean({
            label: ('ShowMessagesByTerminal'),
        }),
        Point_SendDealerPointMessages: new MPS.DataTypes.Boolean({
            label: ('ShowMessagesByDealer'),
        }),
        Location_ID: new MPS.DataTypes.Model({
            label: ('Location'),
        }),
        Interface_ID: new MPS.DataTypes.Model({
            label: ('Interface'),
        }),        
        Point_Address: new MPS.DataTypes.String({
            label: ('Address'),
            required:true,
        }),
        Point_AddressComment: new MPS.DataTypes.String({
            label: ('AddressComment'),
        }),                
        Point_ContactName: new MPS.DataTypes.String({
            label: ('ContactPerson'),
        }),                
        Point_ContactPhone: new MPS.DataTypes.String({
            label: ('ContactPhone'),
        }),                
        Point_TechContactEMail: new MPS.DataTypes.String({
            label: ('TechContactEmail'),
        }),                
        Point_MaxPayValue: new MPS.DataTypes.String({
            label: ('MaxPayValue'),
        }),                
        DCPlaceType_ID: new MPS.DataTypes.Model({
            label: ('DCPlaceType'),
            searchLocal: true,
        }),
        /*Show_Enabled: new MPS.DataTypes.Boolean({
            label: ('ShowEnabled'),
            required:false,
        }),*/
        Point_CanAcceptPayment: new MPS.DataTypes.Boolean({
            label: ('CanAcceptPayment'),
            valueLabels:[('No'),('Yes')]            
        }),
    };
    this.fields.PointType_ID.of(MPS.model.PointType);
    this.fields.Dealer_ID.of(MPS.model.Dealer);
    this.fields.Location_ID.of(MPS.model.Location);
    this.fields.Interface_ID.of(MPS.model.Interface);
    this.fields.DCPlaceType_ID.of(MPS.model.DCPlaceType);
    
    this.getId = function(id){
        return this.fields.Point_ID;
    };
    this.getName = function(id){
        return this.fields.Point_Name;
    };

    this.toString = function(){
        return this.getName().toString();
    };
    this.toHTML = this.toString;
    this.initModel(this);
    return this;
};
MPS.model.Point.prototype = new MPS.model._base();
MPS.model.Point.prototype.name ='Point';


MPS.model.PointType = function(){
    var _model = this;
    this.name ='PointType';
    this.fields = {
        PointType_ID: new MPS.DataTypes.Int({
            alternativeMapping:['PointType_ID'],
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        PointType_Name: new MPS.DataTypes.String({
            alternativeMapping:['PointType_Name'],
            label: 'Name',
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        })
    };
    
    this.getId = function(id){
        return this.fields.PointType_ID;
    };
    this.getName = function(id){
        return this.fields.PointType_Name;
    };
    this.fields.PointType_Name.toString = function(){
        if (!(_model.getId()>0)) return '..';
        var s = _model.getName().val();
        if (s.match(/^%.*%$/)) s = MPS.Translation.getText(s.replace(/^%/,'').replace(/%$/,''));
        return  s;
    };
    this.fields.PointType_Name.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        var s = _model.getName().val();
        if (s.match(/^%.*%$/)) s = MPS.Translation.get(s.replace(/^%/,'').replace(/%$/,''));
        return s;
    };     
    this.toString = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.PointType_Name.toString();
    };
    this.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.PointType_Name.toHTML();
    };
    
    this.initModel(this);
    return this;
};
MPS.model.PointType.prototype = new MPS.model._base();
MPS.model.PointType.prototype.name ='PointType';



MPS.model.Location = function(){
    var _model = this;
    this.name ='Location';
    this.fields = {
        Location_ID: new MPS.DataTypes.Int({
            alternativeMapping:['U_Location_ID'],
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        Location_Name: new MPS.DataTypes.String({
            alternativeMapping:['U_Location_Name'],
            label: 'Name',
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        })
    };
    
    this.getId = function(id){
        return this.fields.Location_ID;
    };
    this.getName = function(id){
        return this.fields.Location_Name;
    };
    this.toString = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.Location_Name.toString();
    };
    this.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.Location_Name.toHTML();
    };
    this.initModel(this);
    return this;
};
MPS.model.Location.prototype = new MPS.model._base();
MPS.model.Location.prototype.name ='Location';



// В карточке терминала - тип места расположения
MPS.model.DCPlaceType = function(){
    var _model = this;
    this.name ='DCPlaceType';
    this.fields = {
        DCPlaceType_ID: new MPS.DataTypes.Int({
            label: ('ID'),
            required:false,
            visible:false,
            editable:false
        }),
        DCPlaceType_Name: new MPS.DataTypes.String({
            label: 'Name',
            required:true,
            validation:[MPS.Validator.StringNotEmpty]
        })
    };
    
    this.getId = function(id){
        return this.fields.DCPlaceType_ID;
    };
    this.getName = function(id){
        return this.fields.DCPlaceType_Name;
    };
    this.fields.DCPlaceType_Name.toString = function(){
        if (!(_model.getId()>0)) return '..';
        var s = _model.getName().val();
        if (s.match(/^%.*%$/)) s = MPS.Translation.getText(s.replace(/^%/,'').replace(/%$/,''));
        return  s;
    };
    this.fields.DCPlaceType_Name.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        var s = _model.getName().val();
        if (s.match(/^%.*%$/)) s = MPS.Translation.get(s.replace(/^%/,'').replace(/%$/,''));
        return s;
    };    
    this.toString = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.DCPlaceType_Name.toString();
    };
    this.toHTML = function(){
        if (!(_model.getId()>0)) return '..';
        return this.fields.DCPlaceType_Name.toHTML();
    };
    
    this.initModel(this);
    return this;
};
MPS.model.DCPlaceType.prototype = new MPS.model._base();
MPS.model.DCPlaceType.prototype.name ='DCPlaceType';

