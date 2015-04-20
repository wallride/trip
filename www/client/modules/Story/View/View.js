StoryViewModule = function(){
    var _module = this;
    var app = this.getApplication();
    var api=app.api;
    var className = 'Story';
    var story = Wallride.model.Story;
    var periods = new Wallride.model.Collection();

    this.run = function(callback){
        api.get(Wallride.model.Story, this.params.id, function(s){
            story = s;
            _module.data.story = story;
            _module.render(callback);
        });
        
    };

    this.init = function(callback){
        this.$element.find('.story').on('click', function(){
            var id = $(this).data('id');
            Wallride.UI.router.navigate('Story/View/?id='+id);
            Wallride.UI.router.page('Story', 'View', {id:id});
        });
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
StoryViewModule.prototype = new Wallride.View.BaseView();
