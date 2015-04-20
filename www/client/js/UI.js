
Wallride.UI.gotoModelViewPage = function(model){
    var className = (typeof model==='function')? (new model()).name : model.name;
    Wallride.UI.router.navigate(className+'/View/?id='+model.getId().val());
    Wallride.UI.router.page(className+'', 'View', {id:model.getId().val()});
};
Wallride.UI.gotoModelListPage = function(model){
    var className = (typeof model==='function')? (new model()).name : model.name;
    Wallride.UI.router.navigate(className+'/List/');
    Wallride.UI.router.page(className+'', 'List');
};

Wallride.UI.render = {};


/**
 * Decorates Attribute as an html placeholder for the template engine
 * After template is rendered MPS.UI.Utils.processModelAttributes transforms placeholder to interactive input fields with binded logic
 * @param {MPS.DataTypes.BaseType} attr Attribute object
 * @param {string|object} options Attribute options override
 * @returns {string} html
 */
Wallride.UI.render.modelAttribute = function(attr, options) {
    if (!attr || !attr.options) {
        console.error ('Wrong attribute specified', attr);
        return 'error';
    }
    if  (!options) options = {};
    if (typeof options ==='string')options = JSON.parse(options);
    var opt = $.extend($.extend({},attr.options),options);
    var model = attr.model;
    if (model && !model.hasAccess('Update')) opt.editable=false;
    var $container = $('<div class="attributeContainer"></div>');
    $container.attr('data-mps_model', attr.model.name);
    $container.attr('data-mps_model_id', attr.model.getId().val());
    $container.attr('data-mps_attribute', attr.name);
    $container.attr('data-mps_type', attr.type);
    $container.attr('data-mps_options', JSON.stringify(opt));
    $container.text(attr.val());

    var $tmp = $('<div></div>');
    $container.appendTo($tmp);
    return $tmp.html();
};
Wallride.UI.render.modelAttributeLabel = function(attr) {
    if (!attr || !attr.options) {
        console.error ('Wrong attribute specified', attr);
        return 'error';
    }
    return Wallride.Translation.get(attr.options.label);
};

/**
 * Пометка контейнера, содержащего атрибуты модели. Для привязки к модели.
 * @param {type} model
 * @returns {String}
 */
Wallride.UI.render.fn_markDataModel = function(model) {
    if (!model || !model.name) return '';
    var html = 'data-mps_model_container="' +model.name+'" ';
    if (model.getId().val())
        html    += 'data-mps_model_id="' +model.getId().val()+'" ';
    return html;
};


(function() {
    
    var fn_modelLink = function(model, link) {
        if (!link){
            link = '#' + model.name + '/View/?id=' + model.getId().val();
        }
        var html =''
        html += (model.hasAccess('GetInfo')) ? '<a href="'+link+'" class="modelLink">' : '<span class="modelLink">';
        html += '<b>['+model.getId().val()+'] </b>';
        html += '<span>'+model.getName().val()+'</span>';
        html += (model.hasAccess('GetInfo')) ? '</a>' : '</span>';
        return html;
    };
    $.views.converters("modelLink", fn_modelLink);
    $.views.converters("markDataModel", Wallride.UI.render.fn_markDataModel);
    $.views.helpers({
        modelAttribute: Wallride.UI.render.modelAttribute,
        modelAttributeLabel: Wallride.UI.render.modelAttributeLabel,
        log: console.log,
        message:Wallride.Translation.get,
//        message:MPS.dictionaryMessage,
        modelLink:fn_modelLink
    });
    $.views.settings({
        onError: function(e, view, fallback) {
            console.error(e);
        }
    });


})();


Wallride.UI.Utils = {};

/**
 * Обрабатывает плейсхолдер, расставляет инпуты в зависимости от типа атрибута, связывает с моделью
 * @param {jQuery} $attr плейсхолдер
 * @param {MPS.model._base} model
 * @returns {undefined}
 */
Wallride.UI.Utils.processAttribute = function($attr, model){
    var attrName = $attr.data('mps_attribute');
    var attr = model.fields[attrName];
    if (!attr){ console.error ('not found attribute',attrName, 'in model', model); return;}
    var options = $attr.data('mps_options') ? $attr.data('mps_options') : attr.options;
    if (model && !model.hasAccess('Update')) options.editable=false;
    var type = attr.type;
    var mode = options.mode=='create' ? options.mode : 'view';
    
    var fn = 'attributeInput';
    if (type=='Boolean') fn = 'attributeCheckbox';
    else if (type=='Model') fn = 'attributeModelSelect';
    else if (type=='Date') fn = 'attributeDate';
    else if (type=='Enumeration') fn = 'attributeSwitch';
    
    if (options.UIType && _.isFunction($attr['attribute'+options.UIType])) fn = 'attribute'+options.UIType;
    $attr[fn](attr, options);
} ;
/**
 * Находит в DOM-модели плейсхолдеры, которые должны быть связаны с атрибутами моделей. 
 * Декорирует в соответствии с опциями, навешивает логику.
 * Связывает с указанной моделью или всеми моделями в глобальных коллекциях
 * @param {jQuery} $container
 * @param {MPS.model._base} model Если нужно принудительно загонять в определённую модель. Особенно, когда она ещё не имеет id и не в коллекции
 * @returns {undefined}
 */
Wallride.UI.Utils.processModelAttributes = function($container, targetModel){
    var processModel = function(model, $modelElement){
        $modelElement.find('.attributeContainer[data-mps_attribute]').each(function(){
            var $attr = $(this);
            return Wallride.UI.Utils.processAttribute($attr, model);
        });
    };
    
    if (!targetModel){
        //�?щем и вяжем всё подряд
        var selector = '[data-mps_model_container]';
        $container.find(selector).andSelf().filter(selector).each(function(){
            var $modelElement = $(this);
            var className = $modelElement.data('mps_model_container');
            var modelId = $modelElement.data('mps_model_id');
            if (className && modelId && Wallride.model.collections[className]){
                var model = Wallride.model.collections[className].get(modelId);
                if (model){
                    processModel(model, $modelElement);
                }
            }
        });
    }
    else{
        //ищем поля для конкретной модели по её классу
        var selector = '[data-mps_model_container]';
        var $modelElement = $container.find(selector).andSelf().filter(selector).first();
        if ($modelElement){
                processModel(targetModel, $modelElement);
        }
    }
};


/**
 * Adds error hint to an element.
 * @param {jQuery} $container $ element
 * @returns {MPS.UI.ErrorHint}
 */
Wallride.UI.ErrorHint = function($container){
    var _this = this;
    this.text = '';
    var $error = $('<div class="errorMessage"></div>').hide();
    var $text=$('<p></p>').appendTo($error);
    
    
    /**
     * Set text for the error hint
     * @param {String} text Dictionary key
     * @returns {MPS.UI.ErrorHint|String}
     */
    this.message = function(text){
        if (_.isUndefined(text)) return this.text;
        this.text = Wallride.Translation.get(text);
        $text.html(text);
        return this;
    };
    
    /**
     * 
     * @param {Int} autohide [optional] number of milliseconds to wait till it hides automaticaly
     * @returns {MPS.UI.ErrorHint}
     */
    this.show = function(autohide){
        $error.fadeIn('slow');
        if (_.isNumber(autohide)){
            window.setTimeout(this.hide, autohide);
        }
        return this;
    };
    this.hide = function(){
        $error.fadeOut('slow');
        return this;
    };
    
    this.destroy = function(){
        $error.empty().remove();
        delete this;
    };
    
    $error.appendTo($container);
    return this;
};



/**
 * Всплывающие сообщения для уведомлений, ошибок и успешных операций 
 **/
Wallride.UI.Toast = {
    $container: $('<div id="toastContainer"></div>').appendTo($('body')),
    $messageTpl: $('<div class="toast"><button class="close"></button></div>'),
    type:{
        error:'error',
        success:'success',
        notice:'notice'
    },
    ToastMessage:function(type, header, message, duration){
        var _this = this;
        if (_.isUndefined(Wallride.UI.Toast.type[type])) type=Wallride.UI.Toast.type.notice;
        this.$element = Wallride.UI.Toast.$messageTpl.clone().appendTo(Wallride.UI.Toast.$container);
        this.$element.addClass(type);
        this.$element.append('<h4>'+header+'</h4>');
        if (_.isString(message) && message.length>0) this.$element.append('<p>'+message+'</p>');
        this.onClose = function(){};
        var t;
        this.close = function(e){
            window.clearTimeout(t);
            _this.$element.slideUp(500, function(){
                _this.$element.empty().remove();
                _this.onClose();
            });
            if (e) e.stopPropagation();
        };
        t=window.setTimeout(function(){_this.close();}, duration);
        this.$element.click(function(){
            window.clearTimeout(t);
            $(this).addClass('selected');
        });
        this.$element.find('button.close').click(_this.close);
        this.$element.hide().slideDown(300);
        return this;
    },
    /**
     * Создаёт и отображает всплывающее сообщение. Возвращает его объект для последующих манипуляций (если понадобятся).
     * @param {MPS.UI.Toast.type} type default is MPS.UI.Toast.type.notice
     * @param {String} header
     * @param {String} message
     * @param {Int} duration in milliseconds. default is 3000
     * @returns {MPS.UI.Toast.ToastMessage}
     */
    create:function(type, header, message, duration){
        if (_.isUndefined(duration) || !_.isNumber(duration)) duration = 3000;
        return new Wallride.UI.Toast.ToastMessage(type, header, message, duration);
    }
};




// In-Place translation
if (Wallride.access.hasAccess('Translation', 'Update')){
    $('.translateMe').live('click', function(){
        var id = $(this).data('translate');
        var dialog = new Wallride.UI.Dialog({});
        Wallride.View.dispatcher.resolveView('_Utils', 'Translation', function(modView){
            Wallride.UI.routeLoadingNow = null;
            modView.setElement(dialog.getElement());
//                modView.placeLoader();
            modView.setParams({
                dialog: dialog,
                Translation_ID: id
            });
            modView.run();
        });
    });
}




Wallride.UI.Dialog = function(options){
    var _this = this;
    if (options.className){
        
    }
    var $container = $('<div class="dialogContainer"></div>').appendTo($('body')).hide();
    if (options.className) this.$container.addClass(options.className);
    var $bg = $('<div class="bg"></div>').appendTo($container);
    var $window = $('<div class="window"></div>').appendTo($container);
    var $close = $('<div class="close"></div>').appendTo($window);
    var $element = $('<div></div>').appendTo($window);
    this.getElement = function(){return $element;};
    $window.css({
        left:'calc(50% - '+($element.width()/2)+'px)',
        top:0
    });
    
    this.show = function(){
        $container.fadeIn('slow');
        $window.css({
            left:'calc(50% - '+($element.width()/2)+'px)'
        });
        $window.animate({top:'30%'}, 500);
        
    };
    this.hide = function(){
        $container.fadeOut('slow', function(){$container.empty().remove();});
        $window.animate({top:'90%'}, 500);
    };
    $close.click(this.hide);
    $bg.click(this.hide);
    
};