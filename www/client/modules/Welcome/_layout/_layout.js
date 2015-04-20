Welcome_layoutModule = function(){
    var _module = this;
    var app = this.getApplication();
    var api=app.api;

    /**
     * 
     * @type Wallride.model.Collection
     */
    var stories;

    

    this.run = function(callback){
        api.list(Wallride.model.Story, {}, 
            function(col){
                stories = col;
                _module.data.stories = stories;
                _module.render(callback);
            }
        );
        
        
        
    };

    this.init = function(callback){
        var $container = this.$element.find('._module').first();

        var package = 'Story';
        var module = '_Create';
        var moduleParams = {welcomeModule:this};
        console.log(stories, app);
        
        
        // no stories
        if (stories.count()==0){
            module = '_Create';
            moduleParams.stories=stories;
        }
        // created one
        else if (stories.count()==1 && stories.getAll()[0].F.owner.val() == app.user.getId().val()){
//            module = '_Invite';
            moduleParams.stories=stories;
        }
        else
        console.log(module, moduleParams, $container);

        Wallride.View.dispatcher.resolveView(package, module, function(modView){
            Wallride.UI.routeLoadingNow = null;
            modView.setElement($container.empty());
            modView.setParams(moduleParams);
            modView.run();
            if (typeof(callback)==='function') callback();
        });


    };
    
    return this;
};
Welcome_layoutModule.prototype = new Wallride.View.BaseView();