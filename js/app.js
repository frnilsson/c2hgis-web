
var geo_host = 'http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com';
var geo_space = 'c2hgis';
var geo_output = 'application/json'

var geo_type = 'state';
var zoom_type = 'state';
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

var broadband_layer;
var health_layer;
var count_layer;


var broadband_type = 'wireline';
var broadband_speed = 'download';

var bb_combo_layer;

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
	 
	 //wms_border.addTo(map);
	
	
	map.on('zoomend', function() {
		
		var zoom = map.getZoom();
		
		if (zoom < 7 ) {
			new_geo_type = 'state';	
			zoom_type = 'state';			
		}
		else if (zoom >= 7 ) {
			new_geo_type = 'county';
			zoom_type = 'county';
		}
		
		updateCountLegend();
		
		
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
	
	// select state
    $('#select-state').on('change', function() {
	
        var state_sel = $('#select-state').val();
		
		console.log(' state_sel : ' + state_sel );
		
		if (state_sel != "") {
			setState(state_sel);
		}
		else {
			setNationwide();
		}
    }); 
	
	// select count
    $('#select-count').on('change', function() {
	
        var count_sel = $('#select-count').val();
		
		console.log(' count_sel : ' + count_sel );
		
		if (count_sel != "") {
			setCount(count_sel);
		}
		else {
			//setNationwide();
		}
    }); 
	
	
	
	// select broadband
	$('.broadband-type').on('change', function() {
	
        broadband_type = $(this).val();
		
		console.log(' broadband_type : ' + broadband_type );
		
		setBroadbandCombo();
		
		
    }); 
	
	$('.broadband-speed').on('change', function() {
	
        broadband_speed = $(this).val();
		
		console.log(' broadband_speed : ' + broadband_speed );
		
		setBroadbandCombo();		
    }); 
	
	
	
	
	// slider
	
	$( '#slider-broadband' ).slider({
		range: true,
		min: 20,
		max: 100,
		step: 10,
		values: [ 20, 50 ],
		slide: function( event, slider ) {
			$( '#label-broadband' ).val( ''+ slider.values[ 0 ] +'% - '+ slider.values[ 1 ] +'%' );
			
			
					
					//http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=c2hgis%3Astate%2Cc2hgis%3Acounty&STYLES=c2hgis%3Abroadband_state%2Cc2hgis%3Abroadband_county&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&CQL_FILTER=advdl_gr25000k%3E%3D0%20AND%20advdl_gr25000k%3C%3D0.2&SRS=EPSG%3A3857&BBOX=-10018754.171394622,10018754.171394626,-5009377.085697311,15028131.257091932
					
					// broadband_column
					
					var broadband_column = 'advdl_gr25000k';
					var broadband_min = slider.values[ 0 ] / 100;
					var broadband_max = slider.values[ 1 ] / 100;
					
					console.log(' broadband_column : ' + broadband_column );
					console.log(' broadband_min : ' + broadband_min );
					console.log(' broadband_max : ' + broadband_max );

					var broadband_filter = broadband_column + ">=" + broadband_min + " AND " + broadband_column + "<=" + broadband_max;
					broadband_filter = broadband_filter + ";" + broadband_filter;

					console.log(' broadband_filter : ' + broadband_filter );

					if (map.hasLayer(broadband_layer)) {
						map.removeLayer(broadband_layer);
					}

					var broadband_state_layer = 'c2hgis:state';
					var broadband_county_layer = 'c2hgis:county';

					broadband_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
							 format: 'image/png',
							 transparent: true,
							 cql_filter: broadband_filter,
							 layers: ['c2hgis:state', 'c2hgis:county'], 
							 styles: ['c2hgis:broadband_state', 'c2hgis:broadband_county']
						 }).setZIndex('99').addTo(map);				
			
			
		}
	});
	
	
	$( '#slider-health' ).slider({
		range: true,
		min: 20,
		max: 40,
		step: 5,
		values: [ 20, 30 ],
		slide: function( event, slider ) {
			$( '#label-health' ).val( ''+ slider.values[ 0 ] +'% - '+ slider.values[ 1 ] +'%' );
					
		
						 
						 
					 // health
						 
					var health_column = 'adult_obesity_pct';
					var health_min = slider.values[ 0 ];
					var health_max = slider.values[ 1 ];
					
					console.log(' health_column : ' + health_column );
					console.log(' health_min : ' + health_min );
					console.log(' health_max : ' + health_max );

					var health_filter = health_column + ">=" + health_min + " AND " + health_column + "<=" + health_max;
					health_filter = health_filter + ";" + health_filter;

					console.log(' health_filter : ' + health_filter );

					if (map.hasLayer(health_layer)) {
						map.removeLayer(health_layer);
					}

					var health_state_layer = 'c2hgis:state';
					var health_county_layer = 'c2hgis:health_county';

					health_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
							 format: 'image/png',
							 transparent: true,
							 cql_filter: health_filter,
							 layers: ['c2hgis:state', 'c2hgis:county'], 
							 styles: ['c2hgis:health_state', 'c2hgis:health_county']
						 }).setZIndex('90').addTo(map);

										
			
			
			
		}
	});
	
	
	$( '#label-broadband' ).val( ''+ $( '#slider-broadband' ).slider( 'values', 0 ) +'% - '+ $( '#slider-broadband' ).slider( 'values', 1 ) +'%' );
	
	$( '#label-health' ).val( ''+ $( '#slider-health' ).slider( 'values', 0 ) +'% - '+ $( '#slider-health' ).slider( 'values', 1 ) +'%' );
				
	
	
	
	
	count_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
			 format: 'image/png',
			 transparent: true,
			 layers: ['c2hgis:state', 'c2hgis:county'], 
			 styles: ['c2hgis:count_pcp_state', 'c2hgis:count_pcp_county']
		 }).setZIndex('999').addTo(map);
	
	
	
	
	
	
     
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


function setBroadbandCombo() {
	
	console.log(' setBroadbandCombo : '  );
	
	if (map.hasLayer(bb_combo_layer)) {
		map.removeLayer(bb_combo_layer);
	}
	
	bb_combo_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
		format: 'image/png',
		transparent: true,
		layers: ['c2hgis:state', 'c2hgis:county'], 
		styles: ['c2hgis:bb_combo_wn_dl_county', 'c2hgis:bb_combo_wn_dl_county']
	}).setZIndex('999').addTo(map);
	

}









var count_types = {
	pcp: {
		layer: 'pcp_total',
		color: '#ba0c0c',
		county: {
			min: 10,
			max: 500
		}, 
		state: {
			min: 1000,
			max: 10000
		}
	},
	ip: {
		layer: 'provider_count',
		color: '#0050cc',
		county: {
			min: 1,
			max: 25
		}, 
		state: {
			min: 25,
			max: 100
		}
	},
	pop: {
		layer: 'pop_2014',
		color: '#a3a3a3',
		county: {
			min: 10000,
			max: 1000000
		}, 
		state: {
			min: 1000000,
			max: 10000000
		}
	}
};

var count_type = 'pcp';

function setCount(type) {

	console.log(' setCount type : ' + type );

	if (count_types[type]) {
	
		count_type = type;
	
		if (map.hasLayer(count_layer)) {
			map.removeLayer(count_layer);
		}
		
		count_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
			format: 'image/png',
			transparent: true,
			layers: ['c2hgis:state', 'c2hgis:county'], 
			styles: ['c2hgis:count_'+ type +'_state', 'c2hgis:count_'+ type +'_county']
		}).setZIndex('999').addTo(map);
		 
		 
		


		updateCountLegend();
	}
}

function updateCountLegend() {
	
	console.log(' count_type : ' + count_type );
	console.log(' geo_type : ' + geo_type );
	
	
	console.log(' zoom_type : ' + zoom_type );
	
	
	if (count_types[count_type][zoom_type]) {
	
	

		var count_min = count_types[count_type][zoom_type].min;
		var count_max = count_types[count_type][zoom_type].max;
		var count_color = count_types[count_type].color;
		console.log(' count_min : ' + count_min );		
		
		$( '.circle-label-min' ).text( '< '+ Number(count_min).toLocaleString('en') );
		$( '.circle-label-max' ).text( '> '+ Number(count_max).toLocaleString('en') );
		$( '.circle-sym' ).css('background-color', count_color);
		
	}
}


var states_in = {
	FL: {
		lat: 28.5953035358968,
		lng: -82.4958094312413,
		zoom: 7
	},
	MS: {
		lat: 32.7509547380987,
		lng: -89.6621633573408,
		zoom: 7
	}, 
	VA: {
		lat: 37.5126006451781,
		lng: -78.7878086547533,
		zoom: 7
	}
};

function setState(state) {

	if (states_in[state]) {
	
		map.setView([states_in[state].lat, states_in[state].lng], states_in[state].zoom);  
		
		
		geo_type = 'state';
		geo_lat = states_in[state].lat;
		geo_lng = states_in[state].lng;
		
		getData();
		
	}

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
     
  
  