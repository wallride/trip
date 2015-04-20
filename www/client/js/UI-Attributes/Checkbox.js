$.fn.attributeCheckbox = function(attribute, options){
    var _this = this;
    var $this = $(this);
    this.attributeAbstract(attribute, options);
    if (!this.options.editable) return;

    this.makeInput = function(){
        return $('<label><input class="checkbox" type="checkbox" name="'+this.attribute.name+'" value="'+this.initialValue+'" /> <span>'
                +MPS.Translation.get(this.attribute.toString())+'</span></label>').appendTo(this.parts.edit.empty());
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
        this.parts.view.html(MPS.Translation.get(this.attribute.toString()));
        this.$input.find('span').html(MPS.Translation.get(this.attribute.toString()));
        var v = this.attribute.val();
        if (_.isNull(v)) v='';
        this.$input.val(v);
    };
    this.updateVal();
    this.$input.find('input').change(function(){
        var oldVal = attribute.val();
        attribute.val( _this.$input.val() );
        _this.updateVal();
        if (this.mode=='create') return;
        if (!attribute.model.getId().val()) return; //сохранять нечего
        _this.saveAttribute();
    });
    if (this.mode=='create') return;
    this.placeButtonEdit();

    _this.attribute.events.fireEvent('onInit', attribute);

};



