

$.fn.attributeImage = function(attribute, options){
    var _this = this;
    var $this = $(this);
    this.attributeAbstract(attribute, options);
    this.makeInput = function(){
        return $('<input name="file" type="file"/>').appendTo(this.parts.edit.empty());
    };
    this.$input = this.makeInput();
    var $inputInput = this.$input;
    this.$img = $('<img alt=""/>').appendTo(this.parts.view.empty());
//        this.$input.val = function(v){
//            if (_.isUndefined(v)) return $inputInput.val();
//            
//            return this;
//        };

    this.updateVal();

    this.saveAttribute = function(){
        var file = $inputInput.get(0).files[0];
        if (!file) {console.log('no file'); return;}

        _this.attribute.model.getApplication().api.uploadFile(file, {
            progress: function(){},
            complete: function(){},
            failed: function(){}
        });

        return this;
    };

    if (!this.options.editable) return;
    this.placeButtonEdit();
    this.placeButtonSave();
    this.placeButtonRollback();
};



