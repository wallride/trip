StoryListModule = function(){
    var _module = this;
    var app = this.getApplication();
    var api=app.api;
    var className = 'Story';
    var stories = new Wallride.model.Collection();

    this.run = function(callback){
        api.list(Wallride.model.Story, {}, function(col){
            stories = col;
            _module.data.stories = stories;
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
StoryListModule.prototype = new Wallride.View.BaseView();
