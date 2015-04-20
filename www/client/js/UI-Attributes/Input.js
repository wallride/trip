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

