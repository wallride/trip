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
    var $optionsContainer = $('<div style="position:relative;"></div>').appendTo($select);
    $('<div class="selectMarker"></div>').appendTo($this);

    var selectCursor = {
        current:null,
        inc:function(i){
            var $options = $optionsContainer.children('.option:visible').removeClass('selected');
            if ($options.length==0) {
                selectCursor.current=null;
                return;
            }
            if (_.isNull(selectCursor.current)) selectCursor.current = i>0 ? -1 : $options.length;
            selectCursor.current+=i;
            if (selectCursor.current<0) selectCursor.current = $options.length-1;
            if (selectCursor.current>=$options.length) selectCursor.current = 0;
            var $s = $options.eq(selectCursor.current).addClass('selected');
            $inputSearch.attr('placeholder',$s.text());
            $select.slideDown('fast');
            var y = $s.position().top;
            $select.animate({scrollTop:y-$select.height()/2+20},300);
        },
        reset:function(){
            selectCursor.current=null;
            $optionsContainer.children('.option').removeClass('selected');
            $inputSearch.attr('placeholder','');
        },
        select:function(){
            if (!_.isNull(selectCursor.current)){
                var $s = $optionsContainer.children('.option:visible').eq(selectCursor.current);
                $input.val($s.data('mps_value'));
                _this.validate();
            }
            window.setTimeout(function(){$select.slideUp('fast');},50);
        },
        handleKeyup:function(event){
            var c = event.which;
            if (c==38){
                selectCursor.inc(-1);
                return true;
            }
            if (c==40){
                selectCursor.inc(1);
                return true;
            }
            if (c==13){
                selectCursor.select();
                return true;
            }
            if (c==27){
                $select.slideUp('fast');
                $inputSearch.val('').attr('placeholder',attribute.toString());
                $this.find('button.rollback').click();
                loadAvailableCollection();
                return true;
            }
            return false;
        }
    };


    var searchStrings =[];
    if (attribute.options.searchLocal){
        $inputSearch.keyup(function(event){
            if (selectCursor.handleKeyup(event)) return;
            selectCursor.current=null;
            var s = $(this).val().toLowerCase();
            var $opts = $select.find('.option').show();
            if (s.length<1) return;
            for(var i=0; i<searchStrings.length; i++){
                if ( searchStrings[i].search(s)<0 ) $opts.eq(i).hide();
            }
        });        
    }
    else{
        var timer;
        $inputSearch.keyup(function(event){
            if (selectCursor.handleKeyup(event)) return;
            clearTimeout (timer);
            var s = $(this).val();
            timer = window.setTimeout(function(){
                $optionsContainer.empty().html(MPS.Translation.get('Loading...'));
                selectCursor.current=null;
                if (s.length>1) loadAvailableCollection(null, {SearchField:s, FetchRows:20});
                else loadAvailableCollection();
            }, 100);
        });        
    }


    var addOption=function(val,label){
        searchStrings.push((val+' '+label).toLowerCase());
        var $opt = $('<div class="option"></div>').html(label);
        $opt.data('mps_value',val);
        $opt.appendTo($optionsContainer);
    };

    this.setAvailableCollection = function(collection){
        $optionsContainer.empty();
        selectCursor.current=null;
        searchStrings =[];
        if (!_this.options.required){
            addOption(_this.options.nullValue, MPS.Translation.get('Dropdown: Select, please'));
        }
        if (!collection) return;
        _this.availableCollection = collection;
        var unavailable = attribute.unavailableValueModels;
        var l = collection.getAll();
        for (var i=0; i<l.length; i++){
            var o = l[i];
            if (!o){
                console.error(o, i);
                continue;
            }
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
        _this.fireEvent('onSelect');
        if (v>0){
            var obj = _this.attribute.valueModel;
            if (!obj) console.error('ERROR MODEL',attribute.model.name, attribute.name, attribute.value, attribute);
            var name = obj ? obj.toString() : '*****';
            $inputSearch.attr('placeholder',name);
            _this.parts.view.html(_this.attribute.toHTML());
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
            $input.val($target.data('mps_value'));
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



