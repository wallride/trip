Wallride.UI.Router = Backbone.Router.extend({
    routes: {
        "": "page", 
        "Trip":"trips",
        "Trip/Create":"trips",
        "Trip/:id":"trips",
        "Trip/:id/:module":"trips",
        "Trip/:id/:module?:params":"trips",
        ":pkg": "page",
        ":pkg/:module": "page",
        ":pkg/:module?:params": "page"
    },
    
    trips: function(id, module, params){
        if (!id && !module) module = 'List';
        if (id && !module) module = 'View';
        if (id) params = $.extend( params||{},{tripId:id});
        return this.page('Trip', module, params);
    },

    page: function(pkg, module, params){
        var path = pkg+'/'+module;
        if (Wallride.UI.routeLoadingNow === path) return;
        Wallride.UI.routeLoadingNow = path;
        if (!pkg) pkg = 'Default';
        if (params == undefined) params = {};
//        console.log('switch to page', pkg,module,params);


        var placeModule = function(pkgView, $pkgElement){
            var $container = pkgView.$element.find('._module').first();
            var modViewClassName = '_module_'+pkg+'_'+module;
//            $container.empty();
            if (!module) return;
            
            var $modElement = $container.children('.'+modViewClassName).first();
            var modView = $modElement.data('view');
//            console.log ('try to restore view: ', modView, 'of element ', $modElement, 'in $container ',$container, ' / '+modViewClassName);
            if (modView){
                Wallride.UI.routeLoadingNow = null;
                $modElement.show();
                modView.placeLoader();
                modView.setParams(params);
//                console.log('restored module', module, modView);
                modView.run();
                return;
            } else{
                Wallride.View.dispatcher.resolveView(pkg, module, function(modView){
                    Wallride.UI.routeLoadingNow = null;
                    var $e = $('<div class="'+modViewClassName+'"></div>');
                    modView.setElement($e.appendTo($container.empty()));
                    modView.placeLoader();
                    modView.packageModule = pkgView;
                    modView.setParams(params);
//                    console.log('loaded module', module, $container.get(0));
                    modView.run();
                });
            }
        };
        
        
        $('#_page_container').empty();
        var $elementPackage = $('#_page_container').children('._package_'+pkg).first();
        var packageView = $elementPackage.data('view');
        if (packageView){
            $elementPackage.show();
            packageView.setParams(params);
//                console.log(params);
            packageView.run(function(){
                placeModule(packageView, $elementPackage);
            });
//            console.log('restored package', pkg, packageView);
        }
        else{
//            console.log('load package', pkg);
            Wallride.View.dispatcher.resolveView(pkg, '_layout', function(packageView){
                var $e =$('<div class="_package_'+pkg+'"></div>');
                $('#_page_container').append($e.empty());
                packageView.setElement($e);
                packageView.placeLoader();
                packageView.setParams(params);
                packageView.run(function(){
//                    console.log('loaded package', pkg, packageView);
                    placeModule(packageView, $e);
                });
            });
        }
        
        
    }
    
});

