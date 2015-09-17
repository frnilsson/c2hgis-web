
var geo_host = 'http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com';
var geo_space = 'c2hgis';
var geo_output = 'application/json'

var geo_type = 'state';

var geo_lat;
var geo_lng;

var geo_id;

var geo_data;

var click_feature;

//var lastZoom = 3;
//var zoomCounty = 6;
//var layerType = 'state';

var click_feature_option = {
	'color': '#ffcc44',
	'fillColor': '#ffcc44',
	'weight': 4,
	'fillOpacity': 0.1
};
var click_data = [];

var ctx;
var genderChart;

function createMap() { 
	

                          
 
     L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
     map = L.mapbox.map('map', 'fcc.k74ed5ge', {
             attributionControl: true,
             maxZoom: 19
         })
         .setView([45, -93], 3);    

     map.attributionControl.addAttribution('<a href="http://fcc.gov/health">FCC Connect2Health</a>');

     baseStreet = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
     baseSatellite = L.mapbox.tileLayer('fcc.k74d7n0g');
     baseTerrain = L.mapbox.tileLayer('fcc.k74cm3ol');
 
    

     L.control.scale({
         position: 'bottomright'
     }).addTo(map);

     geocoder = L.mapbox.geocoder('mapbox.places-v1');

	 
	layerControl = new L.Control.Layers(
		{
			'Street': baseStreet.addTo(map),
			'Satellite': baseSatellite,
			'Terrain': baseTerrain
		}, 
		{},
		{
			position: 'topleft'
		})
		.addTo(map);  
		    
	var wms_border = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
         transparent: true,
         layers: 'c2hgis:border',
		 zIndex: 999
     });        
	 
	 wms_border.addTo(map);
	
	
	map.on('zoomend', function() {
		
		var zoom = map.getZoom();
		
		if (zoom < 7 ) {
			new_geo_type = 'state';
		}
		else if (zoom >= 7 ) {
			new_geo_type = 'county';
		}
		
		if (geo_type !== new_geo_type) {		
			
			if (geo_type === 'county') {
				geo_type = new_geo_type;
				getData();
			}
			geo_type = new_geo_type;		
		}
		
		console.log(' geo_type : ' + geo_type );
		
	});
	
	
	map.on('click', function(e) {
		console.log(' e.latlng : ' + e.latlng );
		
		geo_lat = e.latlng.lat;
		geo_lng = e.latlng.lng;		
		var zoom = map.getZoom();
		
		/*
		var geo_type = 'state';
		if (zoom < 7 ) {
			geo_type = 'state';
		}
		else if (zoom >= 7 ) {
			geo_type = 'county';
		}
		*/
		
		console.log(' geo_lat : ' + geo_lat );
		console.log(' geo_lng : ' + geo_lng );
		console.log(' zoom : ' + zoom );
		console.log(' geo_type : ' + geo_type );
		
		getData();
	});
	
	
    // current location
    $('#btn-geo-current').click(function(e) {
        getCurrentLocation(false);
        return false;
    });
    
    $('#input-geo-search').on('click', function(e) {
        e.preventDefault();
        var search_input = $('#input-geo-location').val();    
        getGeocode(search_input);
    });

    $(document).keypress(function(e) {      
        if (e.which === 13) {
            var search_input = $('#input-geo-location').val();            
            getGeocode(search_input);
        }
    });
     
    // nationwide
    $('#btn-geo-nation').on('click', function() {
        setNationwide();
    });  
     
}

function getCurrentLocation(load) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            map.setView([lat, lng], 10);

        }, function(error) { 
            if (load) { 
                setNationwide();
            }
            else {
                window.alert('Current location not found.');
            }
        }, {
            timeout: 4000
        });
    } 
    else {
        if (load) { 
            setNationwide();
        }
        else {
            window.alert('Current location not found.');
        }
    }
    return false;
}

function getGeocode(location) {

    var geocode_url = 'http://open.mapquestapi.com/nominatim/v1/search.php?format=json&limit=1&countrycode=us&q='+ encodeURIComponent(location);
    //console.log('geocode_url : '+ geocode_url );  
    
    $.ajax({
        type: 'GET',
        url: geocode_url,
        dataType: 'json',
        success: function(data) {

            //console.log('geocode_url data : '+ JSON.stringify(data) );    
                        
            // Nominatim Geocoder
            if (data[0]) {                      
                
                var geo_bounds = data[0].boundingbox;
                
                map.fitBounds([
                    [geo_bounds[0], geo_bounds[2]],
                    [geo_bounds[1], geo_bounds[3]]
                ]);             
            }
            else {
                window.alert('Search results not found.');
            }           
        },
        error: function (request, status, error) {
            
            window.alert('Search results not found.');
        }
    }); 
}   

function setNationwide() {          
    map.setView([40, -97], 3);  
}  
     
function getData() {			
	
	var data_url = geo_host +'/'+ geo_space +'/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName='+ geo_space +':'+geo_type+'&maxFeatures=1&outputFormat=text/javascript&cql_filter=contains(geom,%20POINT(' + geo_lng + ' ' + geo_lat + '))&format_options=callback:callbackData';
	
	console.log(' data_url : ' + data_url );
	
		$.ajax({
			type: 'GET',
			url: data_url,
			//dataType: 'json',
			dataType: 'jsonp',
			jsonpCallback: 'callbackData',
			success: function(data) {
				processData(data);
			}
		});
}
    

function processData(data) {
		
	//console.log(' data : ' + JSON.stringify(data) );
	
	if (data.features){
	
		if (data.totalFeatures == 1){
		
			var geography_id = data.features[0].properties.geography_id;
			
			console.log(' geography_id : ' + geography_id );			
			
			if (geo_id !== geography_id) {
			
				geo_id = geography_id;
				
				geo_data = data;
			
				var geography_type = geo_data.features[0].properties.geography_type;
				var geography_id = geo_data.features[0].properties.geography_id;
				var geography_desc = geo_data.features[0].properties.geography_desc;
				var pcp_total = geo_data.features[0].properties.pcp_total;
				var provider_count = geo_data.features[0].properties.provider_count;
				var pop_2014 = geo_data.features[0].properties.pop_2014;
				
				var female_total = geo_data.features[0].properties.female_total;
				var male_total = geo_data.features[0].properties.male_total;
				
				console.log(' geography_type : ' + geography_type );
				console.log(' geography_desc : ' + geography_desc );
				console.log(' pcp_total : ' + pcp_total );
				console.log(' provider_count : ' + provider_count );
				console.log(' pop_2014 : ' + pop_2014 );
				
				
				$('#geog_name').text(geography_desc);
				$('#geog_pop').text(pop_2014);
				$('#geog_prov').text(provider_count);
				$('#geog_pcp').text(pcp_total);
				
				// ***********************************
				
											
				var genderData = [
				   {
					  value: male_total,
					  label: 'Male',
					  color: '#56e053'
				   },
				   {
					  value: female_total,
					  label: 'Female',
					  color: '#5384e0'
				   }				   
				];
				var genderOptions = {
					animationEasing: 'easeOutQuart',
					tooltipTemplate: '<%=label%>: <%= value.toLocaleString() %> (<%= Math.round(circumference / 6.283 * 1000) / 10 %>%)',
					legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
				};

				ctx = document.getElementById('chart_js').getContext('2d');
				if (genderChart) {
					genderChart.destroy();
				}
				genderChart = new Chart(ctx).Doughnut(genderData, genderOptions);		
				
				 $('#chart_legend').html( genderChart.generateLegend() );
				
				
				console.log(genderChart.generateLegend());
				
				// ***********************************
				clearClickFeature();
				
				var click_feature = L.mapbox.featureLayer(geo_data).setStyle(click_feature_option).addTo(map);				
				
				click_feature.on('click', function(e) {
					console.log(' click_feature e.latlng : ' + e.latlng );
					
					geo_lat = e.latlng.lat;
					geo_lng = e.latlng.lng;		
					var zoom = map.getZoom();
					
					/*
					var geo_type = 'state';
					if (zoom < 7 ) {
						geo_type = 'state';
					}
					else if (zoom >= 7 ) {
						geo_type = 'county';
					}
					*/
					
					console.log(' geo_lat : ' + geo_lat );
					console.log(' geo_lng : ' + geo_lng );
					console.log(' zoom : ' + zoom );
					console.log(' geo_type : ' + geo_type );
					
					getData();
				});
			}
			
	
			click_data.push(click_feature);	
				
		}	
	}
	
}

 function clearClickFeature() {
	
	console.log(' clearClickFeature ! '  );
	
	for (var i = 0; i < click_data.length; i++){
		
		if (map.hasLayer(click_data[i])) {
			map.removeLayer(click_data[i]);
		}
	}
	click_data.length = 0;	
 }

    
     
 $(document).ready(function() {
     createMap();
     //getData();
});  
     
  
  