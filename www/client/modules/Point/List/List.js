PointListModule = function(){
    var _module = this;
    var app = this.getApplication();
    var searchPoint = new MPS.model.Point();
    searchPoint.fields.Dealer_ID.options.required = false;
    searchPoint.fields.PointType_ID.options.required = false;
    searchPoint.fields.Interface_ID.options.required = false;
    searchPoint.fields.Point_Enabled.options.required = false;
    searchPoint.fields.SearchField = new MPS.DataTypes.String({
            label: ('SearchField'),
            required:false,
            visible:true,
            editable:true,
        });
    searchPoint.fields.MaxChildLevel = new MPS.DataTypes.Boolean({
            label: ('MaxChildLevel'),
            required:false,
            valueLabels:[('No'),('Yes')]            
        });
    searchPoint.initModel(searchPoint);

    var searchParams = {};
    var tableTemplate;
    
    
    this.run = function(callback){
        searchParams.MaxChildLevel = searchPoint.fields.MaxChildLevel.val();
        _module.data.searchPoint = searchPoint;
        MPS.load.tmpl(MPS.urls.baseURL+MPS.urls.modulesPath+'Point/List/ListTable.html', 'Point_List_Table_tmpl', 
            function(tmpl){
                tableTemplate = tmpl;
                _module.render(callback);
            }, 
            function(){console.error('Could not load template for Tariff_Gate')}
        );

    };   
    
    var processTable = function(){
        app.api.getList(
            MPS.model.Point,
            searchParams, /*{},*/
            function(collection){
                _module.data.list = collection;
                var $html = $(tableTemplate(_module.data));
                var $table = _module.$element.find('table.ListTable').empty();
                $html.appendTo($table);
                MPS.UI.Utils.processModelAttributes($table);
                
            },
            function(d){console.log('method call failed', d);}
        );
        
    };
    
    
    this.init = function(callback){
        var $searchForm = _module.$element.find('.searchTable');
        $('input:[name=MaxChildLevel]').click();
        processTable();
        MPS.UI.Utils.processModelAttributes(this.$element.find('.searchTable'), searchPoint);

        this.$element.find('button.show').click(function(){
            searchParams.Dealer_ID = searchPoint.fields.Dealer_ID.val();
            searchParams.PointType_ID = searchPoint.fields.PointType_ID.val();
            searchParams.Interface_ID = searchPoint.fields.Interface_ID.val();
            searchParams.Point_Enabled = searchPoint.fields.Point_Enabled.val();
            searchParams.MaxChildLevel = searchPoint.fields.MaxChildLevel.val();

            for (key in searchParams){
                if (key=="MaxChildLevel"){
                    if (searchParams[key]==1)                
                        searchParams[key] = 10;
                }
                else {
                    if (!searchParams[key] || searchParams[key]==null || searchParams[key]==-1) 
                        delete(searchParams[key]);
                }
            }
            processTable();
        });

        if (typeof(callback)==='function') callback();
        
        var pointID = this.$element.find('');
        this.$element.find('button.update_point').click(function(){
            var pointID = $(this).data('id');
            app.api.ajaxRaw(
                    'portal-api',
                    'Point_Update',
                    {
                        Point_ID: pointID,
                        ActDealerID:app.actDealerId,
                        Point_PointHashTrigger: moment().format('YYYY-MM-DD HH:mm:ss')
                    },
                    function(){
                        MPS.UI.Toast.create(MPS.UI.Toast.type.success,MPS.Translation.get('Configuration successfully updated'));
                        _module.params.dialog.hide();                        
                    },
                    function(d){
                        MPS.UI.Toast.create(MPS.UI.Toast.type.error,MPS.Translation.get('Error'), d.status.message);
                    }
            );            
        });
        
        this.$element.find('button.to_hide').click(function(){
            $searchForm.slideToggle('fast');
        });
        
        this.$element.find('input.search').keyup(function(eventObject){
            searchParams.SearchField = $(this).val();
            processTable();
        });
                
    };  

    return this;
};
PointListModule.prototype = new MPS.View.BaseView();
