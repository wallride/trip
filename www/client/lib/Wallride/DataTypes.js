
Wallride.DataTypes = {
    /**
     * Абстрактный типизированный контейнер данных с правилами, валидацией и привязкой к моделям
     * @returns {Wallride.DataTypes.BaseType}
     */
    BaseType:function(){
        var _this = this;
        this.value = null;
        var defaultOptions={
            alternativeMapping:[], //Варианты именования переменных для маппинга
            required:false,
            nullValue:-1,
            visible:true,
            editable:true,
            save:true,
            validation:[],
            label:'',
            unit: null // может быть функцией
        };
        this.$element = null;
        this.options = $.extend({},defaultOptions);
        
        return this;
    }
};
Wallride.DataTypes.BaseType.prototype.setOptions = function(opts){
    if (_.isObject(opts)) this.options = $.extend(this.options, opts);
    return this;
};
Wallride.DataTypes.BaseType.prototype.valuePreparation = function(v){
    return v;
};
Wallride.DataTypes.BaseType.prototype.getUnit = function(){
    return _.isFunction(this.options.unit)? this.options.unit() : this.options.unit;
};
Wallride.DataTypes.BaseType.prototype.val = function(v, ignoreElement){
    if (_.isUndefined(v)) return this.value;
    this.value = this.valuePreparation(v);
    if (this.events && _.isFunction(this.events.fireEvent)) this.events.fireEvent('onChange');
    if (!ignoreElement && this.$element && typeof this.$element.updateVal === 'function'){
        this.$element.updateVal();
    }
    return this;
};
Wallride.DataTypes.BaseType.prototype.toString = function(){
    var s = '';
    if (!_.isNull(this.value)) s=this.value+'';
    var u = this.getUnit();
    if (s.length>0 && u) s += ' '+u;
    return s;
};
// if needed a representation in HTML
Wallride.DataTypes.BaseType.prototype.toHTML = Wallride.DataTypes.BaseType.prototype.toString;

Wallride.DataTypes.BaseType.prototype.clear = function(){
    this.val(null);
    if (this.$element) {
        this.$element.removeClass('invalid');
        this.$element.removeClass('valid');
        if (_.isFunction(this.$element.updateVal)) this.$element.updateVal();
    }
};

/**
 * 
 * @param {type} v
 * @returns {Wallride.DataTypes}
 */
this.setValidator = function(v){
    this.options.validation.push(v);
    return this;
};

/**
 * Валидация данных в контейнере
 * @param {Wallride.Validator.ErrorsContainer} errors - контейнер, куда собираются ошибки, опционально
 * @returns {Boolean}
 */
Wallride.DataTypes.BaseType.prototype.validate = function(errors){
    var o = this.options;
    var v = this.value;
    if (this.$element) this.$element.removeClass('invalid').removeClass('valid');
    if (o.required && _.isNull(v)) {
        if (errors) errors.add(this, 'Empty value');
        if (this.$element) this.$element.addClass('invalid');
        return false;
    }
    for (var i=0; i<this.options.validation.length; i++){
        var validator = this.options.validation[i];
        if (!validator(this, errors)) {
            if (this.$element) this.$element.addClass('invalid');
            return false;
        }
    }
    return true;
};


//===============================================================================================================
//===============================================================================================================
//===============================================================================================================

Wallride.Validator={};
Wallride.Validator.ErrorsContainer = function(){
    this.list = [];
    this.add = function(attr, error, params){
        this.list.push({
            attribute:attr,
            context:(attr.model ? attr.model.name+'.' : '') + attr.name ,
            errorLabel: error,
            params:params
        });
    };
    return this;
};
Wallride.Validator.PercentRange= function(attr, errors){
    var v = attr.val();
    if (v<0){
        errors.add(attr, 'Percent less then 0');
        return false;
    }
    if (v>100){
        errors.add(attr, 'Percent greater then 100');
        return false;
    }
    return true;
};
Wallride.Validator.StringNotEmpty = function(attr, errors){
    var val = attr.val();
    if (val === null) return true;
    if ((val+'').length <1) {
        if (errors) errors.add(attr, 'String must be specified');
        return false;
    }
    return true;
};
Wallride.Validator.Numeric = function(attr, errors){
    var val = attr.val();
    if (val === null) return true;
    if (val * 1 != val) {
        if (errors) errors.add(attr, 'Not a number');
        return false;
    }
    return true;
};



//===============================================================================================================
//===============================================================================================================
//===============================================================================================================



Wallride.DataTypes.String = function(opts){
    this.type = 'String';
    this.value = '';
    this.options = $.extend({}, this.options);
    this.setOptions(opts);
    this.options.nullValue='';
};
Wallride.DataTypes.Text = function(opts){
    this.type = 'Text';
    this.options = $.extend({}, this.options);
    this.setOptions(opts);
};
Wallride.DataTypes.Float = function(opts){
    this.value = null;
    this.options = $.extend({digits:2}, this.options);
    this.setOptions(opts);
    this.options.validation.push(Wallride.Validator.Numeric);
    return this;
};
Wallride.DataTypes.Float.prototype = new Wallride.DataTypes.BaseType();
Wallride.DataTypes.Float.prototype.type = 'Float';
Wallride.DataTypes.Float.prototype.valuePreparation = function(v){
    if (v==='') v=null;
    if (v * 1 == v && !_.isNaN(v)) v = v*1;
    else v = null;
    return v;
};
Wallride.DataTypes.Float.prototype.toString = function(){
    var s= this.value+'';
    if (this.value==='') return '';
    if (_.isNull(this.value)) return '';
    if (_.isNaN(this.value)) return '';
//        if (_.isString(this.value)) this.value = this.value*1;
    if (this.value * 1 != this.value) return '';
    var s= this.value.toFixed(this.options.digits)+'';
    var u = this.getUnit();
    if (s.length>0 && u) s = s+' '+u;
    return s;
};
Wallride.DataTypes.Float.prototype.toHTML = Wallride.DataTypes.Float.prototype.toString;

Wallride.DataTypes.Int = function(opts){
    this.value=null;
    this.options = $.extend({}, this.options);
    this.options.digits=0;
    this.setOptions(opts);
    return this;
};
Wallride.DataTypes.Int.prototype.val = function(v, ignoreElement){
    if (_.isUndefined(v)) return _.isNumber(this.value) ? Math.floor(this.value) : this.value;
    this.value = this.valuePreparation(v);
    if (this.events && _.isFunction(this.events.fireEvent)) this.events.fireEvent('onChange');
    if (!ignoreElement && this.$element && typeof this.$element.updateVal === 'function'){
        this.$element.updateVal();
    }
    return this;
};
Wallride.DataTypes.Int.prototype = new Wallride.DataTypes.Float();
Wallride.DataTypes.Int.prototype.type = 'Int';


Wallride.DataTypes.Boolean = function(opts){
    this.value = 0;
    this.type = 'Boolean';
    this.options = $.extend({valueLabels:['No','Yes']}, this.options);
    this.setOptions(opts);
    this.toString = function(){
        return this.options.valueLabels[ this.val() ? this.val() : 0 ];
    };
    this.toHTML = this.toString;
    return this;
};


// ==============================================================================================
// ----------------------------------------------------------------------------------------------
// 
//       MODEL
//       
// ----------------------------------------------------------------------------------------------
// ==============================================================================================

Wallride.DataTypes.Collection = function(opts){
    this.options = $.extend({loadParams:{save:false, editable:false}}, this.options);
    this.setOptions(opts);
    this.value = new Wallride.model.Collection();
    this.valueModelName = null;
    return this;
};
Wallride.DataTypes.Collection.prototype = new Wallride.DataTypes.BaseType();
Wallride.DataTypes.Collection.prototype.type = 'Collection';
Wallride.DataTypes.Collection.prototype.of = function(modelClassName){
    this.valueModelName = modelClassName.prototype.name;
    return this;
};
Wallride.DataTypes.Collection.prototype.val = function(obj){
    if (_.isUndefined(obj)) return this.value;
    if (!this.valueModelName){
        console.error ('No model class defined', this, obj);
        return;
    }
    this.value = new Wallride.model.createCollection(obj, Wallride.model[this.valueModelName]);
};
Wallride.DataTypes.Collection.prototype.getAll = function(){
    return this.value.getAll();
}


Wallride.DataTypes.Model = function(opts){
    this.options = $.extend({loadParams:{OffsetRows:0, FetchRows:25}}, this.options);
    this.setOptions(opts);
    this.valueModel = null; //new Wallride.model._base();
    this.valueModelName = null;
    this.availableValueModels=new Wallride.model.Collection();
    this.unavailableValueModels=new Wallride.model.Collection();
    return this;
};
Wallride.DataTypes.Model.prototype = new Wallride.DataTypes.Int();
Wallride.DataTypes.Model.prototype.type = 'Model';
Wallride.DataTypes.Model.prototype.of = function(modelClassName){
    if (_.isString(modelClassName.prototype.name)) {
        this.valueModelName = modelClassName.prototype.name;
        return this;
    }
    else{
        console.error('unable to get model class name',this.model.name, this.name);
    }
    var m = new modelClassName();
    this.valueModelName = m.name;
    return this;
};
Wallride.DataTypes.Model.prototype.setValueModel = function(model){
    if (!model || model.name !== this.valueModelName) 
        throw 'wrong model given to Wallride.DataTypes.Model:' +model.name+' instead of '+this.valueModelName;
    this.valueModel = model;
    this.val(model.getId().val());
};
Wallride.DataTypes.Model.prototype.setValueModelData = function(obj){
    this.valueModel = new Wallride.model[this.valueModelName]();
    this.valueModel.setData(obj);
    var id = obj[this.valueModel.getId().name];
    if (!Wallride.model.collections[this.valueModelName] || !Wallride.model.collections[this.valueModelName].get(id)){
        Wallride.model.createCollection(obj, Wallride.model[this.valueModelName]);
    }
    this.value = this.valueModel.getId().val();
    this.val(this.valueModel.getId().val());
};
Wallride.DataTypes.Model.prototype.val = function(v){
    if (_.isUndefined(v)) return this.value;
    this.value = this.valuePreparation(v);
    if (Wallride.model.collections[this.valueModelName] && v>0 && Wallride.model.collections[this.valueModelName].get(v*1)){
        this.valueModel = Wallride.model.collections[this.valueModelName].get(v*1);
    }
    else{ 
        this.valueModel = new (Wallride.model[this.valueModelName])();
    }
    if (this.$element && _.isFunction(this.$element.updateVal)){
        this.$element.updateVal();
    }
    if (this.events && _.isFunction(this.events.fireEvent)) this.events.fireEvent('onChange');
    return this;
};
Wallride.DataTypes.Model.prototype.toString = function(){
    if (!this.valueModel || !this.valueModel.getName()) return '';
    return this.valueModel.getName().toString();
};
/**
 * Добавляет коллекцию объектов для выбора
 * @param {Wallride.model.Collection} collection
 * @returns {Wallride.DataTypes.Model}
 */
Wallride.DataTypes.Model.prototype.setAvailableCollection = function (collection){
    if (!(collection instanceof Wallride.model.Collection)) throw new Wallride.Exception('not a collection', collection);
    this.availableValueModels = collection;
//        console.log(this.model.name, this.name, this);
    this.events.fireEvent('onSetAvailable');
    if (this.$element && _.isFunction(this.$element.setAvailableCollection)){
        this.$element.setAvailableCollection(this.availableValueModels);
    } 
    return this;
};
/**
 * Добавляет коллекцию объектов, запрещённых к выбору
 * @param {Wallride.model.Collection} collection коллекция объектов, которые недоступны
 * @returns {Wallride.DataTypes.Model}
 */
Wallride.DataTypes.Model.prototype.setUnavailableCollection = function (collection){
    if (!(collection instanceof Wallride.model.Collection)) throw new Wallride.Exception('not a collection', collection);
    this.unavailableValueModels = collection;
//        console.log(this.model.name, this.name, this);
    if (this.$element && _.isFunction(this.$element.setUnavailableCollection)){
        this.$element.setUnavailableCollection(this.unavailableValueModels);
    } 
    return this;
};



// ==============================================================================================
//       DATE
// ==============================================================================================



Wallride.DataTypes.Date = function(opts){
    this.type = 'Date';
    this.options = $.extend({dateFormat:'dd-mm-yy'}, this.options);
    this.setOptions(opts);
    
    this.timezoneToClient = function(momentDateTime){
        return momentDateTime;
    };
    this.timezoneToServer = function(momentDateTime){
        return momentDateTime;
    };
    this.toString = function(){
        return this.toFormat();
    };
    
};


Wallride.DataTypes.Time = function(opts){
    this.type = 'Time';
    this.setOptions(opts);
};
Wallride.DataTypes.DateTime = function(opts){
    var _this = this;
    this.type = 'DateTime';
    this.options = $.extend({dateFormat:'DD-MM-YYYY HH:mm:ss'}, this.options);
    this.setOptions(opts);
    this.valueMoment = null;

    this.timezoneToClient = function(momentDateTime){
        return momentDateTime.subtract(this.serverTimezone, 'm').add(this.clientTimezone,'m');
    };
    this.timezoneToServer = function(momentDateTime){
        return momentDateTime.subtract(this.clientTimezone, 'm').add(this.serverTimezone,'m');
    };
    
    /**
     * 
     * @param {String} v Format from DB: "2015-02-28 12:45:51.123"
     * @returns {Wallride.DataTypes|String}
     */
    this.val = function(v){
        if (_.isUndefined(v)) return this.value;
        if (_.isNull(v)){
            this.value = v;
            this.valueMoment = v;
            return;
        }
        var m = moment(v, this.serverFormat);
        if (!m.isValid()){ console.error('wrong date/time format', v); return;}
        this.value = v;
        this.valueMoment = m;
        if (this.$element) this.$element.val(v);
        return this;
    };

    this.setFormattedValue = function(v){
        var m = moment(v, this.options.dateFormat || this.serverFormat);
        if (!m.isValid()){ console.error('wrong date/time format', v); return;}
        this.val(this.timezoneToServer(m).format(this.serverFormat));
    };

    this.toFormat = function(fmt){
        if (_.isUndefined(fmt)) fmt = this.options.dateFormat || this.serverFormat;
        if (!this.valueMoment) return '';
        return this.timezoneToClient(this.valueMoment).format(fmt);
    };
    this.toString = function(){
        return this.toFormat();
    };
    this.toHTML = function(){
        return this.toString();
    };
    return this;
};


Wallride.DataTypes.Enumeration = function(opts){
    var _this = this;
    this.type = 'Enumeration';
    this.options = $.extend({}, this.options);
    this.setOptions(opts);

    this.availableValues=[];
    this.addAvailable = function(val, label){
        this.availableValues.push({value:val, label:label});
    };
    this.getAvailable = function(val){
        if (_.isUndefined(val)) return this.availableValues;
        if (_.isNull(val)) return null;
        for (var i=0; i<this.availableValues.length; i++){
            if (this.availableValues[i].value==val) return this.availableValues[i];
        }
        return null;
    };
    
    /**
     * 
     * @param {String} v Format from DB: "2015-02-28 12:45:51.123"
     * @returns {Wallride.DataTypes|String}
     */
    this.val = function(v){
        if (_.isUndefined(v)) return this.value;
        this.value = v;
        if (this.$element) this.$element.val(v);
        return this;
    };

    this.toString = function(){
        return this.getAvailable(this.value)? this.getAvailable(this.value).label : '';
    };
    this.toHTML = function(){
        return this.toString();
    };
    return this;
};




Wallride.DataTypes.Enumeration.prototype = new Wallride.DataTypes.BaseType();
Wallride.DataTypes.String.prototype = new Wallride.DataTypes.BaseType();
Wallride.DataTypes.Text.prototype = new Wallride.DataTypes.BaseType();
Wallride.DataTypes.Boolean.prototype = new Wallride.DataTypes.BaseType();
Wallride.DataTypes.DateTime.prototype = new Wallride.DataTypes.BaseType();
Wallride.DataTypes.DateTime.prototype.serverTimezone = 0;
Wallride.DataTypes.DateTime.prototype.clientTimezone = 0 - new Date().getTimezoneOffset();
Wallride.DataTypes.DateTime.prototype.serverFormat = 'YYYY-MM-DD HH:mm:ss';
Wallride.DataTypes.Date.prototype.serverFormat = 'YYYY-MM-DD';
Wallride.DataTypes.Time.prototype.serverFormat = 'HH:mm:ss';
Wallride.DataTypes.Date.prototype = new Wallride.DataTypes.DateTime();
Wallride.DataTypes.Time.prototype = new Wallride.DataTypes.DateTime();


