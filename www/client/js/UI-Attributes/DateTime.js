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
        datepickerTranslation[a][i] = MPS.Translation.getText('Calendar: '+datepickerTranslation[a][i]);
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
        dateFormat: attribute.options.datepickerFormat || 'dd.mm.yy',
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

