Wallride.UI.form ={
        init: function($form, onSubmit){
            $form.submit(function(e){
                e.preventDefault();
                e.stopPropagation();
                var str = $form.serialize();
                var pars = str.split('&');
                var params = {};
                for (var i=0; i<pars.length;i++){
                    var p = pars[i].split('=');
                    var k = p[0];
                    var v = decodeURIComponent((p[1]+'').replace(/\+/g, '%20'));
                    if (_.isUndefined(params[k])) params[k] = v;
                    else{
                        if (!_.isArray(params[k])) params[k] = [params[k]];
                        params[k].push(v);
                    }
                }
                Wallride.UI.form.markErrors($form,{});
                if (_.isFunction(onSubmit))onSubmit(params);
                return false;
            });
        },
        prepare:function($form, onSubmit){
            $form.submit(function(){
                var data = $form.serialize();
                onSubmit(data);
                $_W.form.markErrors($form,{});
                return false;
            });

        },
        markErrors:function($form, data){
            var $elements = $form.find('input, select, textarea');
            var errors =[];
            if (data && data.data && data.data.errors && data.data.errors.form){
                errors = data.data.errors.form;
            }
            $elements.each(function(){
                var $obj = $(this);
                var name = $obj.attr('name');
                var $err = $form.find('.errorBlock_'+errors[name]+'[name="'+name+'"]');
                if (errors[name]){
                    if ($err) $err.show();
                    $obj.addClass('error');
                }
                else{
                    if ($err) $err.hide();
                    $obj.removeClass('error');
                }
            });

        }
        
    }
