Wallride.Translation={
    language: 'en_EN',
    dictionary: new Wallride.model.Collection(),
    api:null, //MPS.Application.api
    setLanguage: function(lang, callback){
        var trans = Wallride.Translation;
        trans.language = lang;
        trans.api.getList(Wallride.model.Translation,{Translation_Lang:trans.language}, function(coll){
            trans.dictionary = coll;
            if (_.isFunction(callback)) callback();
        });
    },
    get:function(id, params){
        var s = Wallride.Translation.getText(id, params);
        var t = Wallride.Translation.dictionary.get(id);
        if (!(t.fields.Translation_IsFinal.val()==1 || t.fields.Translation_Value.val().length>0) && Wallride.access.hasAccess('Translation', 'Update')){
            s = '<span class="translateMe" data-translate="'+id+'">'+s+'</span>';
        }
        return s;
    },
    getText: function(id, params){
        var t = Wallride.Translation.dictionary.get(id);
        var s=id;
        if (params && !_.isArray(params)) params = [params];
        if (!t){
            t = new Wallride.model.Translation();
            t.fields.Translation_ID.val(id);            
            t.fields.Translation_Lang.val('en_EN');
            Wallride.Translation.api.update(t);
            t.fields.Translation_Lang.val(Wallride.model.Translation.language);
            t.fields.Translation_Value.val(id);
            Wallride.Translation.dictionary.add(t);
            
        }
        if (t.fields.Translation_Value.val().length>0) s = t.fields.Translation_Value.val();
        if (params){
            for (var i=0; i<params.length; i++){
                var search = '%'+(i+1)+'%';
                var replace = params[i];
                s = s.replace(search, replace);
            }
        }
        return s;
    }
};