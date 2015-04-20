/**
 * РћР±СЂР°Р±РѕС‚С‡РёРєРё DOM-СЌР»РµРјРµРЅС‚РѕРІ, СЂРµР°Р»РёР·СѓСЋС‰РёРµ UI РґР»СЏ Р°С‚СЂРёР±СѓС‚РѕРІ РјРѕРґРµР»РµР№. РЎ СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµРј, РїСЂРѕСЃРјРѕС‚СЂРѕРј Рё С‚.Рґ.
  */
(function(){
    MPS.load.css(MPS.urls.baseURL+'css/UI-Attributes.css', 'UI-Attributes-CSS_2_0');

    
    
    /**
     * 
     * @param {MPS.DataType.BaseType} attribute РђС‚СЂРёР±СѓС‚ РјРѕРґРµР»Рё
     * @param {object} options РѕРїС†РёРё Р°С‚СЂРёР±СѓС‚Р° (РјРѕРіСѓС‚ Р±С‹С‚СЊ РїРµСЂРµРѕРїСЂРµРґРµР»РµРЅС‹)
     * @returns {}
     */
    $.fn.attributeAbstract = function(attribute, options){
        this.attribute = attribute;
        this.initialValue = this.attribute.val();
        attribute.$element = this;
        this.options = _.isObject(options) ? options : attribute.options;
        var _this = this;
        var $this = $(this).empty();
        if (this.options.css) $this.attr('style', options.css);
        this.mode = this.options.mode || 'view';
        this.events = this.events || {};
        /**
         * 
         * @param {string} eventName Name of the event to call. 
         * @param {function} fn
         * @returns {int} key of function in array of events for the specified name
         */
        this.bindEvent = function(eventName, fn){
            if (!_.isFunction(fn)){ 
                console.error('bindEvent called with non-function parametr: ', fn);
                return;
            }
            if (_.isUndefined(this.events[eventName])) this.events[eventName] = [];
            this.events[eventName].push(fn);
            return this.events[eventName].length-1;
        };

        /**
         * Calls functions binded to the specified eventName
         * @param {string} eventName
         * @returns {undefined}
         */
        this.fireEvent = function(eventName){
            var fns = this.events[eventName];
            if (_.isArray(fns)){
                for (var i=0; i<fns.length; i++){
                    fns[i](this);
                }
            }
        };
        /**
         * РЈСЃС‚Р°РЅР°РІР»РёРІР°РµС‚ СЂРµР¶РёРј: 'view', 'edit', 'create'
         * @param {string} m
         * @returns {/self}
         */
        this.setMode = function(m){
            this.mode = m;
            $this.attr('data-mps_mode', this.mode);
            this.fireEvent('mode_'+m);
            return this;
        };
        if (this.options.mode=='create') this.options.editable = true;
        this.setMode(this.mode);
        if (this.options.editable || this.mode === 'create') $this.addClass('editable');

        this.parts = { //СЌР»РµРјРµРЅС‚С‹ Р°С‚СЂРёР±СѓС‚Р°: РїСЂРѕСЃРјРѕС‚СЂ, РїРѕР»Рµ СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ, РєРЅРѕРїРєРё РґРµР№СЃС‚РІРёР№
            view: $('<div class="viewValue"></div>').html(this.attribute.toHTML()).appendTo($this),
            edit: $('<div class="editValue"></div>').appendTo($this),
            operations: $('<div class="operations"></div>').appendTo($this)
        };

        /**
         * РџРµСЂРµРѕРїСЂРµРґРµР»СЏРµРјР°СЏ С„СѓРЅРєС†РёСЏ, РіРµРЅРµСЂРёСЂСѓСЋС‰Р°СЏ СЌР»РµРјРµРЅС‚С‹ СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ
         * @returns {$}
         */
        this.makeInput = function(){
            return $('<input name="'+this.attribute.name+'" value="" class="input" />').appendTo(this.parts.edit).val(this.attribute.val());
        };
        this.$input = this.makeInput();
        
        /**
         * РћР±РЅРѕРІР»СЏРµС‚ Р·РЅР°С‡РµРЅРёРµ Р°С‚СЂРёР±СѓС‚Р° РІ DOM-РјРѕРґРµР»Рё
         * @returns {undefined}
         */
        this.updateVal = function(){
            this.parts.view.html(this.attribute.toHTML());
            var v = this.attribute.val();
            if (_.isNull(v)) v='';
            this.$input.val(v);
            return this;
        };
        this.updateVal();
        if (!this.options.editable) return;
        
        
        this.showError = function(text){
            if (!this.errorHint || !(this.errorHint instanceof MPS.UI.ErrorHint)){
                this.errorHint = new MPS.UI.ErrorHint(this.parts.edit);
            }
            this.errorHint.message(text).show(5000);
        };
        this.showHint = function(text){
            if (!this.infoHint || !(this.infoHint instanceof MPS.UI.InfoHint)){
                this.infoHint = new MPS.UI.InfoHint(this.parts.edit);
            }
            this.infoHint.message(text).show(10000);
        };
        this.bindEvent('onFocus', function(){
            if (_this.errorHint) _this.errorHint.show();
            if (_this.infoHint) _this.infoHint.show();
        });
        this.bindEvent('onBlur', function(){
            if (_this.errorHint) window.setTimeout(_this.errorHint.hide, 1000);
            if (_this.infoHint) window.setTimeout(_this.infoHint.hide, 2000);
        });
        
        // Р¤СѓРЅРєС†РёСЏ, Р·Р°РїСѓСЃРєР°СЋС‰Р°СЏ РІР°Р»РёРґР°С†РёСЋ Р°С‚СЂРёР±СѓС‚Р°
        this.validate = function(){
            _this.attribute.val(_this.$input.val(), true);
            console.log(_this.attribute.name, _this.attribute.value, _this.attribute.model.F);
            var errors = new MPS.Validator.ErrorsContainer();
            _this.attribute.validate(errors);        
            if (errors.list.length<=0){
                $this.addClass('valid');
                $this.addClass('rollback');
                $this.removeClass('invalid');
                if (_this.errorHint) _this.errorHint.destroy();
                delete _this.errorHint;
                return true;
            }
            else{
                console.log('value is invalid: ', errors.list, _this.attribute);
                $this.addClass('invalid');
                $this.addClass('rollback');
                $this.removeClass('valid');
                _this.showError(MPS.Translation.get(errors.list[0].errorLabel,errors.list[0].params));
                return false;
            }
        };

        this.setFocus = function(){
            _this.fireEvent('onFocus');
            this.$input.focus().select();
        };
        
        this.parts.view.click(function(){
            _this.setMode('edit');
            _this.setFocus();
        });
        this.bindEvent('onBlur', function(){
            // РљРѕРіРґР° СѓР±РёСЂР°РµРј РєСѓСЂСЃРѕСЂ СЃ РїРѕР»СЏ РІРІРѕРґР°
            if (_this.$input.val()==_this.initialValue){
                if (_this.mode=='edit') _this.setMode('view');
                $this.removeClass('rollback');
                return;
            }
            _this.validate();
        });
        
//        if (this.mode=='create') return;
        
        /**
         * Р—Р°РїСѓСЃРєР°РµС‚ РїСЂРѕС†РµРґСѓСЂСѓ СЃРѕС…СЂР°РЅРµРЅРёСЏ РјРѕРґРµР»Рё (С‚РѕР»СЊРєРѕ СЃ РґР°РЅРЅС‹Рј Р°С‚СЂРёР±СѓС‚РѕРј).
         * @returns {/self}
         */
        this.saveAttribute = function(){
            console.log(attribute.name, attribute.model);
            if (_this.validate()){
                var a = attribute.options.updateWholeModel ? null: attribute;
                _this.attribute.model.getApplication().api.update(attribute.model, function(){
    //                setMode('view');
//                    console.log('onUpdate UI', attribute);
                    _this.attribute.events.fireEvent('onUpdate', attribute);
                    $this.removeClass('rollback');
                    MPS.UI.Utils.processAttribute($this, attribute.model);
                },
                a);
            }
            return this;
        };

        this.placeButtonEdit = function(){
            $('<button type="button" class="edit"></button>').appendTo(this.parts.operations).click(function(){
                 _this.setMode('edit');
                 _this.parts.edit.find('.input').focus().select();
            });
        };
        this.placeButtonSave = function(){
            $('<button type="button" class="save"></button>').appendTo(this.parts.operations).click(this.saveAttribute);
        };
        this.placeButtonRollback = function(){
            $('<button type="button" class="rollback"></button>').appendTo(this.parts.operations).click(function(){
                _this.attribute.val(_this.initialValue);
                _this.updateVal();
                _this.validate();
                if (_this.mode=='edit'){
                    if (_this.validate()){
                        $this.removeClass('rollback');
                        _this.setMode('view');
                    }
                }
                if (_this.mode=='view'){
                    if (_this.validate()){
                        _this.saveAttribute();
                    }
                }
            });
        };
        
        _this.attribute.events.fireEvent('onInit', attribute);
        
    };
    

    
    
    MPS.DataTypes.Model.prototype.toHTML = function(){
        var id = null;
        try{
            id = this.valueModel.getId().val(); 
        }
        catch (e){}
        if (!(id>0)) return '..';
        if (!this.options.showLink) return this.valueModel.getName().toString();
        return '<a href="#'+this.valueModelName+'/View/?id='+id+'">'+this.valueModel.getName().toString()+'</a>';
    }

    

})();
