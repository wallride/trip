TripCreateModule = function(){
    var _module = this;
    var app = this.getApplication();
    var api=app.api;
    var className = 'Trip';
    var gmap;

    var places = [],
        placeLines = [];

    this.run = function(callback){
        gmap = this.packageModule.gmap;
        _module.render(callback);
    };

    this.init = function(callback){
        var autocomplete = new google.maps.places.Autocomplete(
            _module.$element.find('.cityChoose').get(0),
            {
                types:['(cities)']
            }
        );        
        var mapBounds = new google.maps.LatLngBounds();
        var placesLine;
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            console.log(place);
            places.push(place);
            var $line = $('<li>'+place.name+'</li>');
            $line.append($('<i class="glyphicon glyphicon-minus fRight" style="color: red"></i>').data('n',places.length).click(function(){
                var n = $(this).data('n');
                $(this).parent().empty().remove();
                places.splice(n-1,1);
            }));
            _module.$element.find('ul.list').append($line);
            _module.$element.find('.cityChoose').val('').focus();
            
            if (place.geometry.viewport) {
                mapBounds.union(place.geometry.viewport);
            } else {
                mapBounds.extend(place.geometry.location);
            }
            gmap.fitBounds(mapBounds);
            placeLines.push(place.geometry.location);
            if (placesLine) delete placesLine.setMap(null);
            placesLine = new google.maps.Polyline({
                path: placeLines,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            placesLine.setMap(gmap);                
            
        });
        
        this.$element.find('button.btnCreateTrip').on('click', function(){
            console.log(places);
            var trip = new Wallride.model.Trip();
            trip.F.id.options.save=false;
            trip.F.id.options.required=false;
            var name = '';
            var paramPlaceName=[];
            var paramPlaceLat=[];
            var paramPlaceLng=[];
            for (var i=0; i<places.length; i++){
                name += (i>0 ? ' - ': '') + places[i].name;
                paramPlaceName.push(places[i].name);
                paramPlaceLat.push(places[i].geometry.location.lat());
                paramPlaceLng.push(places[i].geometry.location.lng());
            }
            trip.F.name.val(name);
            var params = $.extend({placesNames:paramPlaceName, placesLat:paramPlaceLat, placesLng:paramPlaceLng}, trip.prepareFieldsParams());
            console.log (params);
        });
        
        
        if (typeof(callback)==='function') callback();
    };
    

    return this;
};
TripCreateModule.prototype = new Wallride.View.BaseView();
