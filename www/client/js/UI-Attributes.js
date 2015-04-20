/**
 * Обработчики DOM-элементов, реализующие UI для атрибутов моделей. С редактированием, просмотром и т.д.
  */
(function(){
    Wallride.load.css(Wallride.urls.baseURL+'css/UI-Attributes.css', 'UI-Attributes-CSS_2_0');

    
    
    /**
     * 
     * @param {MPS.DataType.BaseType} attribute Атрибут модели
     * @param {object} options опции атрибута (могут быть переопределены)
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
        this.mode = 'view';
        this.events = {};
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
         * Устанавливает режим: 'view', 'edit', 'create'
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
        this.setMode((this.options.mode && this.options.mode=='create') ? this.options.mode : 'view');
        if (this.options.editable || this.mode === 'create') $this.addClass('editable');
        
        this.parts = { //элементы атрибута: просмотр, поле редактирования, кнопки действий
            view: $('<div class="viewValue"></div>').html(this.attribute.toHTML()).appendTo($this),
            edit: $('<div class="editValue"></div>').appendTo($this),
            operations: $('<div class="operations"></div>').appendTo($this)
        };

        /**
         * Переопределяемая функция, генерирующая элементы редактирования
         * @returns {$}
         */
        this.makeInput = function(){
            return $('<input name="'+this.attribute.name+'" value="" class="input" />').appendTo(this.parts.edit).val(this.attribute.val());
        };
        this.$input = this.makeInput();
        
        /**
         * Обновляет значение атрибута в DOM-модели
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
        
        
        this.showError = function(dictionaryID){
            if (!this.errorHint || !(this.errorHint instanceof Wallride.UI.ErrorHint)){
                this.errorHint = new Wallride.UI.ErrorHint(this.parts.edit);
            }
            this.errorHint.message(dictionaryID).show();
        };
        this.bindEvent('onFocus', function(){
            if (_this.errorHint) _this.errorHint.show();
        });
        this.bindEvent('onBlur', function(){
            if (_this.errorHint) window.setTimeout(_this.errorHint.hide, 1000);
        });
        
        // Функция, запускающая валидацию атрибута
        this.validate = function(){
            _this.attribute.val(_this.$input.val(), true);
            var errors = new Wallride.Validator.ErrorsContainer();
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
                console.log('value is invalid: ', _this.attribute, ' Errors:', errors.list);
                $this.addClass('invalid');
                $this.addClass('rollback');
                $this.removeClass('valid');
                _this.showError(errors.list[0].error);
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
            // Когда убираем курсор с поля ввода
            if (_this.$input.val()==_this.initialValue){
                if (_this.mode=='edit') _this.setMode('view');
                $this.removeClass('rollback');
                return;
            }
            _this.validate();
        });
        
//        if (this.mode=='create') return;
        
        /**
         * Запускает процедуру сохранения модели (только с данным атрибутом).
         * @returns {/self}
         */
        this.saveAttribute = function(){
            if (_this.validate()){
                var a = attribute.options.updateWholeModel ? null: attribute;
                _this.attribute.model.getApplication().api.update(attribute.model, function(){
    //                setMode('view');
//                    console.log('onUpdate UI', attribute);
                    _this.attribute.events.fireEvent('onUpdate', attribute);
                    $this.removeClass('rollback');
                    Wallride.UI.Utils.processAttribute($this, attribute.model);
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
        
        
    };
    
    
    
    
    
    
    
    $.fn.attributeInput = function(attribute, options){
        var _this = this;
        var $this = $(this);
        this.attributeAbstract(attribute, options);
        if (!this.options.editable) return;
        
        this.makeInput = function(){
            var v = this.attribute.val();
            if (_.isNull(v) || _.isNaN(v)) v='';
            return $('<input name="'+this.attribute.name+'" value="" class="input" />').appendTo(this.parts.edit.empty()).val(v);
        };
        this.$input = this.makeInput();
        var timer;
        this.$input.keyup(function(){
            clearTimeout (timer);
            timer = window.setTimeout(_this.validate, 100);
        });
        this.$input.focus(function(){
            _this.fireEvent('onFocus');
            $(this).select();
        });
        this.$input.blur(function(){
            _this.fireEvent('onBlur');
        });
        if (this.mode=='create') return;
        this.placeButtonEdit();
        this.placeButtonSave();
        this.placeButtonRollback();
        this.$input.keydown(function (e) {
            if (e.keyCode == 13) {
              _this.saveAttribute();
            }
        });
        
    };








    $.fn.attributeCheckbox = function(attribute, options){
        var _this = this;
        var $this = $(this);
        this.attributeAbstract(attribute, options);
        if (!this.options.editable) return;
        
        this.makeInput = function(){
            return $('<label><input class="checkbox" type="checkbox" name="'+this.attribute.name+'" value="'+this.initialValue+'" /> <span>'
                    +Wallride.Translation.get(this.attribute.toString())+'</span></label>').appendTo(this.parts.edit.empty());
        };
        this.$input = this.makeInput();
        
        this.bindEvent('mode_edit', function(e){
            setTimeout(function(){
                $('html').click(function(e){
                    var $t = $(e.target);
                    if ($t.is('label.editValue') || $t.is('input.checkbox')){
//                        return;
                    }
                    $(this).unbind();
                    _this.setMode('view');
                });
            },100);
        });
        
        this.$input.val = function(v){
            if (_.isUndefined(v)) return (_this.$input.find('input').first().is(':checked'))? 1 : 0;
            if (v && v*1>0) _this.$input.find('input').first().attr('checked', 'checked');
            else _this.$input.find('input').first().removeAttr('checked');
        };
        this.updateVal = function(){
            this.parts.view.html(Wallride.Translation.get(this.attribute.toString()));
            this.$input.find('span').html(Wallride.Translation.get(this.attribute.toString()));
            var v = this.attribute.val();
            if (_.isNull(v)) v='';
            this.$input.val(v);
        };
        this.updateVal();
        this.$input.find('input').change(function(){
            _this.attribute.val( _this.$input.val() );
            _this.updateVal();
            if (this.mode=='create') return;
            if (!_this.attribute.model.getId().val()) return; //сохранять нечего
            _this.saveAttribute();
        });
        if (this.mode=='create') return;
        this.placeButtonEdit();
        
    };
    
    
    


    $.fn.attributeSwitch = function(attribute, options){
        var _this = this;
        var $this = $(this);
        this.attributeAbstract(attribute, options);
        if (!this.options.editable) return;
        
        this.makeInput = function(){
            return $('<ul class="attributeSwitchList"></ul>').appendTo(this.parts.edit.empty());
        };
        this.$input = this.makeInput();
        var $input = this.$input;
        for (var i=0; i<attribute.availableValues.length; i++){
            var o = attribute.availableValues[i];
            o.$element = $('<li data-value="'+o.value+'"></li>');
            o.$element.html(Wallride.Translation.get(o.label));
            o.$element.click(function(){
                $input.children('li').removeClass('selected');
                $(this).addClass('selected');
                attribute.val($(this).data('value'));
                attribute.events.fireEvent('onChange');
            });
            $input.append(o.$element);
        }
        console.log($input);
        
        
        this.$input.val = function(v){
            console.log(v);
            $input.children('li').removeClass('selected');
            $input.children('li[data-value="'+v+'"]').addClass('selected');
        };
        this.updateVal = function(){
            this.parts.view.html(Wallride.Translation.get(attribute.toString()));
            $input.children('li').removeClass('selected');
            console.log(attribute.val());
            $input.children('li[data-value="'+attribute.val()+'"]').addClass('selected');
        };
        this.updateVal();
        if (this.mode=='create') return;
        this.placeButtonEdit();
        
    };
    
    
    
    
    
    /**
     * Дропдаун с выбором связанных моделей
     * @param {type} attribute
     * @param {object} options
     * @returns {undefined}
     */
    $.fn.attributeModelSelect = function(attribute, options){
        var _this = this;
        var $this = $(this);
        this.attributeAbstract(attribute, options);
        
        
        this.makeInput = function(){
            return $('<div class="select"></div>').appendTo(this.parts.edit.empty());
        };
        this.$input = this.makeInput();
        var $input = this.$input;
        var $inputInput = $('<input name="'+this.attribute.name+'" value="'+_this.initialValue+'" class="SelectValue" type="hidden" />').appendTo($input);
        var $inputSearch = $('<input name=""  class="input" />').appendTo($input);
        var $select = $('<div class="dropdown"></div>').appendTo($input);
        $('<div class="selectMarker"></div>').appendTo($this);


        if (attribute.options.searchLocal){
            var searchStrings =[];
            $inputSearch.keyup(function(){
                var s = $(this).val().toLowerCase();
                var $opts = $select.find('.option').show();
                if (s.length<1) return;
                for(var i=0; i<searchStrings.length; i++){
                    if ( searchStrings[i].search(s)<0 ) $opts.eq(i).hide();
                }
            });        
        }
        else{
            $inputSearch.keyup(function(){
                var s = $(this).val().toLowerCase();
                if (s.length>1) loadAvailableCollection(null, {SearchField:s, FetchRows:20});
                else loadAvailableCollection();
            });        
        }
        
        
        var addOption=function(val,label){
            searchStrings.push((val+' '+label).toLowerCase());
            var $opt = $('<div class="option"></div>').attr('value', val).html(label);
            $opt.appendTo($select);
            $opt.data('mps_value',val);
        };
        
        this.setAvailableCollection = function(collection){
            $select.empty();
            searchStrings =[];
            if (!_this.options.required){
                addOption(_this.options.nullValue, Wallride.Translation.get('Dropdown: Select, please'));
            }
            if (!collection) return;
            _this.availableCollection = collection;
            var unavailable = attribute.unavailableValueModels;
            var l = collection.getAll();
            for (var i=0; i<l.length; i++){
                var o = l[i];
                if (unavailable && unavailable.get(o.getId().val())) {
                    continue;
                }
                addOption(o.getId().val(), o.toHTML());
            }
        };
        
//        this.setAvailableCollection(_this.attribute.availableValueModels);

        this.$input.val = function(v){
            if (_.isUndefined(v)) return $inputInput.val();
            $inputInput.val(v);
            $inputSearch.val('').attr('placeholder','');
            $select.slideUp('fast');
            if (v>=0){
                var obj = _this.attribute.valueModel;
                var name = obj.toString();
                $inputSearch.attr('placeholder',name);
                _this.parts.view.html(_this.attribute.valueModel.toHTML());
            }
            return this;
        };
        this.updateVal();
        this.setFocus = function(){
            $inputSearch.focus().val('');
        };
        
        if (!this.options.editable) return;
        // Loading available collection
        var availableIsLoadingNow = false; //to avoid duplicate ajax requests
        var loadAvailableCollection = function(callback, params){
            if (availableIsLoadingNow) return;
            availableIsLoadingNow = true;
            attribute.loadAvailableCollection(function(collection){
//                _this.setAvailableCollection(collection);
                availableIsLoadingNow = false;
                if (_.isFunction(callback)) callback(collection);
            }, params);
        };
        this.bindEvent('onDrop', loadAvailableCollection);
        
        
        
        $inputSearch.focus(function(){
            $select.slideDown('fast');
            _this.fireEvent('onFocus');
            _this.fireEvent('onDrop');
            $('html').mousedown(function(e){
                window.setTimeout(function(){$select.slideUp('fast');},100);
                $('html').unbind();
            });
//            _this.setMode('edit');
            return this;
        });
        $input.mousedown(function(e){
            var $target = $(e.target);
            if ($target.is('.option')){
                _this.attribute.val($target.data('mps_value'));
                _this.validate();
                window.setTimeout(function(){$select.slideUp('fast');},50);
                $('html').unbind();
            }
            if ($target.is('.input')){
                $select.slideDown('fast');
                $inputSearch.focus().select();
            }
            e.stopPropagation();
            e.preventDefault();
        });
        $inputSearch.blur(function(){
            _this.fireEvent('onBlur');
            window.setTimeout(function(){$select.slideUp('fast');},150);
            $('html').unbind();
        });
        if (this.mode=='create') return;
        this.placeButtonEdit();
        this.placeButtonSave();
        this.placeButtonRollback();
    };

    
    
    $.fn.attributeImage = function(attribute, options){
        var _this = this;
        var $this = $(this);
        this.attributeAbstract(attribute, options);
        console.log('file!!');
        this.makeInput = function(){
            console.log('file');
            return $('<input name="file" type="file"/>').appendTo(this.parts.edit.empty());
        };
        this.$input = this.makeInput();
        this.$img = $('<img alt=""/>').appendTo(this.parts.view.empty());
        this.$input.val = function(v){
            if (_.isUndefined(v)) return $inputInput.val();
            $inputInput.val(v);
            $inputSearch.val('').attr('placeholder','');
            $select.slideUp('fast');
            if (v>=0){
                var obj = _this.attribute.valueModel;
                var name = obj.toString();
                _this.parts.view.html(_this.attribute.valueModel.toHTML());
            }
            return this;
        };
        
        this.updateVal();

        
        if (!this.options.editable) return;
        this.placeButtonEdit();
        this.placeButtonSave();
        this.placeButtonRollback();
    };
        
    
    

    
    $.fn.attributeAbstractDateTime = function(attribute, options){
        var _this = this;
        var $this = $(this);
        this.attributeAbstract(attribute, options);
        
        
        this.makeInput = function(){
            return $('<div class="select"></div>').appendTo(this.parts.edit.empty());
        };
        this.$input = this.makeInput();
        var $input = this.$input;
        var $inputInput = $('<input name="'+this.attribute.name+'" value="'+_this.initialValue+'" class="SelectValue" type="hidden" />').appendTo($input);
        var $inputDisplay = $('<input name="" readonly="readonly" class="input" />').appendTo($input);
        var $dropdown = $('<div class="dropdown2"></div>').appendTo($input);
        $('<div class="selectMarker"></div>').appendTo($this);
        this.edit = {
            $inputInput: $inputInput,
            $inputDisplay: $inputDisplay,
            $dropdown: $dropdown
        };

        this.setFocus = function(){
            $inputDisplay.focus().select();
        };
        
        if (!this.options.editable) return;

        $inputDisplay.focus(function(){
            $dropdown.slideDown('fast');
            _this.fireEvent('onFocus');
            _this.fireEvent('onDrop');
            $('html').mousedown(function(e){
                window.setTimeout(function(){$dropdown.slideUp('fast');},100);
                $('html').unbind();
            });
//            _this.setMode('edit');
            return this;
        });
        $input.mousedown(function(e){
            var $target = $(e.target);
            if ($target.is('.input')){
                $dropdown.slideDown('fast');
                $inputDisplay.focus().select();
            }
            e.stopPropagation();
            e.preventDefault();
        });
        $inputDisplay.blur(function(){
            _this.fireEvent('onBlur');
            window.setTimeout(function(){$dropdown.slideUp('fast');},150);
            $('html').unbind();
        });
        if (this.mode=='create') return;
        this.placeButtonEdit();
        this.placeButtonSave();
        this.placeButtonRollback();
    };
    
    
    // Переопределение языковых настроек календаря jQuery UI. Прикручиваем переводы
    var datepickerTranslation ={
        monthNames: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa']
    };
    for (var a in datepickerTranslation){
        for (var i=0; i<datepickerTranslation[a].length; i++){
            datepickerTranslation[a][i] = Wallride.Translation.getText('Calendar: '+datepickerTranslation[a][i]);
        }
    }


    /**
     * Календарь
     * @param {MPS.DataTypes.Date} attribute
     * @param {type} options
     * @returns {undefined}
     */
    $.fn.attributeDate = function(attribute, options){
        var _this = this;
        var $this = $(this);
        this.attributeAbstractDateTime(attribute, options);
        
        var edit = this.edit;
        var $datepicker = $('<div></div>').appendTo(edit.$dropdown);
        var format = attribute.options.dateFormat || 'DD.MM.YYYY';
        $datepicker.datepicker($.extend({
            firstDay:1,
//            changeMonth: true,
//            changeYear: true,
            dateFormat: attribute.options.datepickerFormat || 'dd.mm.yyyy',
            onSelect: function(d){
                attribute.setFormattedValue(d);
                _this.updateVal();
            }
        }, datepickerTranslation));
        if (attribute.options.dateMin) $datepicker.datepicker("option", "minDate",
            moment(attribute.options.dateMin, attribute.serverFormat).format(format)
        );
        if (attribute.options.dateMax) $datepicker.datepicker("option", "maxDate",
            moment(attribute.options.dateMax, attribute.serverFormat).format(format)
        );
        
        this.$input.val = function(v){
            if (_.isUndefined(v)) return edit.$inputInput.val();
            edit.$inputInput.val(v);
            var formattedDate = attribute.toFormat();
            edit.$inputDisplay.val(formattedDate);
//            edit.$dropdown.slideUp('fast');
            _this.parts.view.html(formattedDate);
            $datepicker.datepicker( "setDate", formattedDate );
            return this;
        };
        this.updateVal();
    };
    

})();
