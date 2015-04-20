
Wallride.model._base = function(options){
    this.options = $.extend({}, options);
    this.fields = {};
    this.F = this.fields;
    
    /**
     * Метод, позволяющий достать идентификатор объекта. 
     * Для каждой модели должен быть переопределён. По умолчанию идентификатором считается атрибут "id"
     * @param {type} id
     * @returns {Wallride.model._base.fields.id}
     */
    
    return this;
};
Wallride.model._base.prototype.getId = function(){
    return this.F.id;
};
Wallride.model._base.prototype.getName = function(){
    return this.F.name;
};
/**
 * Записывает данные из объекта в модель по совпавшим ключам. Остальные игнорируются.
 * @param {type} obj
 * @param {int} depth глубина рекурсии при заполнении связанных сущеностей. служебный внутренний атрибут
 * @returns {self}
 */
Wallride.model._base.prototype.setData = function(obj, depth){
    if (!depth) depth=1;

    for (var key in this.fields){
        var attr = this.fields[key];
        var objVal = obj[key];
        if (!_.isUndefined(objVal)){
            if (attr.type == 'Model' && _.isObject(objVal)){
                var id = objVal.id;
                if (!id) continue;
                if (depth>3) {
                    attr.value = id;
                    continue;
                }
                var className = attr.valueModelName;
                if (Wallride.model.collections[className] && Wallride.model.collections[className].get(id)){
                    attr.val(id);
                }
                else{
                    Wallride.model.createCollection(objVal, Wallride.model[className]);
                    attr.val(id);
                }
//                        attr.setValueModelData(obj)
            }
            else if (attr.type == 'Colllection'){
                attr.val(objVal);
            }
            else attr.val(objVal);
            continue;
        }
    }

    var c = Wallride.model.collections[this.name];
    if (!c) c = new Wallride.model.Collection();
    if (this.getId().val()>0) c.add(this);

    return this;
};
/**
 * Привязывает все атрибуты к инстансу класса для обратной связи между сущностями
 * @param {Wallride.model._base} self
 * @returns {Wallride.model._base}
 */
Wallride.model._base.prototype.initModel = function(self){
    self.events = new Wallride.Utils.Events();
    for (var i in self.fields){
        self.fields[i].name = i;
        self.fields[i].model = self;
        if (_.isUndefined(self.fields[i].options.label)) self.fields[i].options.label = i;
        self.fields[i].events = new Wallride.Utils.Events();
        self.fields[i].events.bindEvent('onUpdate', function(attr){
            self.events.fireEvent('onUpdate', self);
        });
    }
    self.F = self.fields;
    return this;
};
/**
 * Преобразует данные в полях к объекту, пригодному для сохранения через ajax
 * @param {boolean} getAll optional. if true - returns every attribute
 * @returns {object}
 */
Wallride.model._base.prototype.prepareFieldsParams = function(getAll){
    var res = {};
    for (var name in this.F){
        var attr = this.F[name];
//            console.log(attr);
        if (attr.options.save || getAll) {
            var v = attr.val();
            if (_.isNull(v)){
                if (!_.isUndefined(attr.options.nullValue)) v=attr.options.nullValue;
                else v='';
            }
            res[name] = v;
        }
    }
    return res;
};
/**
 * Sets all the fields values to NULL
 * @returns {undefined}
 */
Wallride.model._base.prototype.clearFields = function(){
    for (var key in this.F){
        this.F[key].clear();
    }
};
/**
 * Validates model's attributes
 * @param {Wallride.Validator.ErrorsContainer} errors - all errors recorded here
 * @returns {Boolean}
 */
Wallride.model._base.prototype.validate = function(errors){
    if (!errors || !(errors instanceof Wallride.Validator.ErrorsContainer)) errors = new Wallride.Validator.ErrorsContainer();
    for (var attrName in this.F){
        var attr = this.F[attrName];
        attr.validate(errors);
    }
    var errList = errors.list;
    if (errList.length>0){
        console.log('invalid fields', errList);
//            errList[0].attribute.$element.find('input').first().focus();
        return false;
    }
    return true;
};
/**
 * Returns Object as a string [id] - [name]
 * @returns {String}
 */
Wallride.model._base.prototype.toString = function(params){
    if (!_.isObject(params)) params ={};
    if (!this.getName()) return params.nullLabel || '..';
    if (this.getId().val() && params.showID) return this.getId().val() + ' - ' + this.getName().toString();
    return this.getName().val();
};

Wallride.model._base.prototype.clone = function(){
    var obj = new Wallride.model[this.name];
    for (var key in this.F){
        obj.F[key].val(this.F[key].val());
    }
    return obj;
};
/**
 * Returns Object as HTML code [id] - [name]
 * @returns {String}
 */
Wallride.model._base.prototype.toHTML = function(){
    if (!this.getName()) return '..';
    if (this.getId().val()) return this.getId().val() + ' - ' + this.getName().toHTML();
    return this.getName().val();
};











/**
 * Хранит коллекции моделей и обеспечивает доступ к ним по id
 * @returns {Wallride.Collection}
 */
Wallride.model.Collection = function(){
    this.ids = {};
    this.objects = [];
    return this;
};
Wallride.model.Collection.prototype.update = function(obj){
    this.objects[this.ids['id'+obj.getId().val()]] = obj;
    return this.objects[this.ids['id'+obj.getId().val()]];
};
Wallride.model.Collection.prototype.addList = function(arr){
    for (var i=0; i<arr.length; i++) this.add(arr[i]);
};
Wallride.model.Collection.prototype.get = function(id){
    var i = this.ids['id'+id];
    if (typeof i === 'undefined') return null;
    return this.objects[i];
};
Wallride.model.Collection.prototype.delete = function(id){
    if (this.get(id)){
        var i = this.ids['id'+id];
        this.objects[i]=null;
        delete this.ids['id'+id];
    }
};
Wallride.model.Collection.prototype.count = function(){
    var c=0;
    for (var i=0; i<this.objects.length;i++){
        if (this.objects[i] && this.objects[i].getId()) c++;
    }
    return c;
};
Wallride.model.Collection.prototype.getAll = function(){
    var r =[];
    for (var key in this.ids){
        r.push(this.objects[this.ids[key]]);
    }
    return r;
};
/**
 * Add to collection
 * @param {Wallride.model._base} obj
 * @returns {undefined|Boolean}
 */
Wallride.model.Collection.prototype.add = function(obj){
    if (!(obj instanceof Wallride.model._base)){
        console.error('Trying to add non-model object to collection', obj);
    }
    if (!_.isFunction(obj.getId) || !_.isFunction(obj.getId().val) && _.isNumber(obj.getId().val())){
        console.error('Trying to add non-model object to collection: ', obj);
        return false;
    }
    if (this.get(obj.getId().val())){
        return this.update(obj);

    }
    this.objects.push(obj);
    this.ids['id'+obj.getId().val()] = this.objects.length-1;
    return this.get(obj.getId().val());
};
/**
 * Фильтрует содержимое по значению атрибута и возвращает в новой коллекции
 * @param {string} fieldName Поле, по которому фильтруем
 * @param {string|Int} fieldValues искомое значение
 * @returns {Wallride.model.Collection}
 */
Wallride.model.Collection.prototype.filter = function(fieldName, fieldValues){
    var res = new Wallride.model.Collection();
    if (!_.isArray(fieldValues)) fieldValues = [fieldValues];
    var l = this.getAll();
    for (var i=0; i<l.length; i++){
        var m = l[i];
        if (m.fields[fieldName] && _.isFunction(m.fields[fieldName].val) && $.inArray(m.fields[fieldName].val(), fieldValues)>=0)
            res.add(m);
    }
    return res;
};
/**
 * Gets a collection of children (attributed) models. Models only.
 * @param {string} fieldName Поле, по которому фильтруем
 * @returns {Wallride.model.Collection}
 */
Wallride.model.Collection.prototype.extractValueModels = function(fieldName){
    var res = new Wallride.model.Collection();
    var l = this.getAll();
    for (var i=0; i<l.length; i++){
        var m = l[i];
        var f = m.F[fieldName];
        if (f && f instanceof Wallride.DataTypes.Model){
            var v = f.valueModel;
            if (v && v instanceof Wallride.model._base) res.add(v);
        }
        else{
            throw "Wallride.model.Collection.extractValues: "+fieldName+' is not a model field';
        }
    }
    return res;
};



Wallride.model.collections ={};


/**
 * Makes object mapped collection of specified class.
 * Adds objects to global object library and returns only a part that is defined in data
 * @param {array} data
 * @param {function} modelClass
 * @returns {Wallride.Collection}
 */
Wallride.model.createCollection = function(data, modelClass){
    var className = (new modelClass()).name;
    if (!Wallride.model.collections[className]) Wallride.model.collections[className] = new Wallride.model.Collection();
    var global = Wallride.model.collections[className];
    var c = new Wallride.model.Collection();
    if (!_.isUndefined(data.length)){
        for (var i = 0; i<data.length; i++){
            var obj = new modelClass();
            obj.setData(data[i]);
//            global.add(obj);
//            var o = global.get(obj.getId().val());
            c.add(global.add(obj));
        }
    }
    else{
        var obj = new modelClass();
        obj.setData(data);
//        global.add(obj);
//        c.add(global.get(obj.getId().val()));
        c.add(global.add(obj));
    }
    return c;
};




Wallride.access = {
    models:{},
    hasAccess:function(modelName, methodName){
        if (Wallride.access.models[modelName]){
            if (!Wallride.access.models[modelName][methodName]) return false;
        }
        return true;
    },
    setRights:function(d){
        var models = Wallride.access.models;
        for (var i=0; i<d.length; i++){
            var right = d[i];
            if (!models[right.ObjectName]) models[right.ObjectName] = {};
            models[right.ObjectName][right.MethodName]=true;
            if (Wallride.model[right.ObjectName]){
                var model = Wallride.model[right.ObjectName];
                if (_.isUndefined(model.prototype.access)) model.prototype.access = Wallride.access.models[right.ObjectName];
            }
        }
    }
};

