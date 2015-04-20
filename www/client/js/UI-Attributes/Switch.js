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
        o.$element.html(MPS.Translation.get(o.label));
        o.$element.click(function(){
            $input.children('li').removeClass('selected');
            $(this).addClass('selected');
            attribute.val($(this).data('value'));
            attribute.events.fireEvent('onChange');
        });
        $input.append(o.$element);
    }
//        console.log($input);


    this.$input.val = function(v){
//            console.log(v);
        $input.children('li').removeClass('selected');
        $input.children('li[data-value="'+v+'"]').addClass('selected');
    };
    this.updateVal = function(){
        this.parts.view.html(MPS.Translation.get(attribute.toString()));
        $input.children('li').removeClass('selected');
        console.log(attribute.val());
        $input.children('li[data-value="'+attribute.val()+'"]').addClass('selected');
    };
    this.updateVal();
    if (this.mode=='create') return;
    this.placeButtonEdit();

};




