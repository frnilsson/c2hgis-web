
var geo_host = 'http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com';
var geo_space = 'c2hgis';
var geo_output = 'application/json'

var geo_type = 'state';
var zoom_type = 'state';
var geo_lat;
var geo_lng;

var geo_id;

var geo_data;
var geo_prop;

var cur_tab = 'insights';

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


var bb_combo_type = 'wn';
var bb_combo_dir = 'dl';

var bb_combo_layer;

var health_sec_type = '';
var health_sec_layer;

var count_type = '';

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
		
		
		//console.log(' geo_type : ' + geo_type );
		
	});
	
	
	map.on('click', function(e) {
		//console.log(' e.latlng : ' + e.latlng );
		
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
		
		//console.log(' geo_lat : ' + geo_lat );
		//console.log(' geo_lng : ' + geo_lng );
		//console.log(' zoom : ' + zoom );
		//console.log(' geo_type : ' + geo_type );
		
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
		
		//console.log(' state_sel : ' + state_sel );
		
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
			if (map.hasLayer(count_layer)) {
				map.removeLayer(count_layer);
			}
			$( '.legend-box').hide(); 
		}
    }); 
	
	// select health
	$('#health-sec-type').on('change', function() {
	
        health_sec_type = $(this).val();
		
		//console.log(' health_sec_type : ' + health_sec_type );
		
		setHealthSec();
		
		
    }); 
	
	
	
	// select broadband
	$('.broadband-type').on('change', function() {
	
        bb_combo_type = $(this).val();
		
		//console.log(' bb_combo_type : ' + bb_combo_type );
		
		setBroadbandCombo();
		
		
    }); 
	
	$('.broadband-speed').on('change', function() {
	
        bb_combo_dir = $(this).val();
		
		//console.log(' bb_combo_dir : ' + bb_combo_dir );
		
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
		
		
		
			setSlider('broadband', slider.values[ 0 ], slider.values[ 1 ]);
		
			
			
			
		}
	});
	
	
	$( '#slider-health' ).slider({
		range: true,
		min: 20,
		max: 40,
		step: 5,
		values: [ 20, 30 ],
		slide: function( event, slider ) {
		
		
			setSlider('health', slider.values[ 0 ], slider.values[ 1 ]);
			
		/*
			
			$( '#label-health' ).val( ''+ slider.values[ 0 ] +'% - '+ slider.values[ 1 ] +'%' );
					
		
						 
						 
					 // health
						 
					var health_column = 'adult_obesity_pct';
					var health_min = slider.values[ 0 ];
					var health_max = slider.values[ 1 ];
					
					//console.log(' health_column : ' + health_column );
					//console.log(' health_min : ' + health_min );
					//console.log(' health_max : ' + health_max );

					var health_filter = health_column + ">=" + health_min + " AND " + health_column + "<=" + health_max;
					health_filter = health_filter + ";" + health_filter;

					//console.log(' health_filter : ' + health_filter );

					if (map.hasLayer(health_layer)) {
						map.removeLayer(health_layer);
					}

					var health_state_layer = 'c2hgis:c2hgis_state';
					var health_county_layer = 'c2hgis:health_county';

					health_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
						 format: 'image/png',
						 transparent: true,
						 cql_filter: health_filter,
						 layers: ['c2hgis:c2hgis_state', 'c2hgis:c2hgis_county'], 
						 styles: ['c2hgis:health_state', 'c2hgis:health_county']
					 }).setZIndex('90').addTo(map);

						*/
			
		}
	});
	
	
	$( '#label-broadband' ).val( ''+ $( '#slider-broadband' ).slider( 'values', 0 ) +'% - '+ $( '#slider-broadband' ).slider( 'values', 1 ) +'%' );
	
	$( '#label-health' ).val( ''+ $( '#slider-health' ).slider( 'values', 0 ) +'% - '+ $( '#slider-health' ).slider( 'values', 1 ) +'%' );
	
	// count_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
	// 		 format: 'image/png',
	// 		 transparent: true,
	// 		 layers: ['c2hgis:c2hgis_state', 'c2hgis:c2hgis_county'], 
	// 		 styles: ['c2hgis:count_pcp_state', 'c2hgis:count_pcp_county']
	// 	 }).setZIndex('999').addTo(map);
	 
}


var map_overlays = {	
	in_broadband: null,
	in_health: null,
	in_count: null	
}

var bb_speed_tiers = {
	3: '< 1.5 mbps',
	4: '1.5 - 3 mbps',
	5: '3 - 6 mbps',
	6: '6 - 10 mbps',
	7: '10 - 25 mbps',
	8: '25 - 50 mbps',
	9: '50 - 100 mbps',
	10: '100 mbps - 1 gbps',
	11: '> 1 gbps'	
};

var units = {
	perc: {
		name: 'Percent',
		desc: '%'
	},
	p1: {
		name: 'Per Person',
		desc: 'Per Capita'
	},
	p1000: {
		name: 'Per 1,000 People',
		desc: 'Per 1,000 People'
	},
	p100000: {
		name: 'Per 100,000 People',
		desc: 'Per 100,000 People'
	},
	y100000: {
		name: 'Years Lost Per 100,000 People',
		desc: 'Years Lost Per 100,000 People'
	},
	st: {
		name: 'Speed Tiers',
		desc: 'Speed Tiers'
	}
};

var insight_ly = {
	broadband: {
		in_bb_access: {
			column: 'advdl_gr25000k',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 99,
			step: 20
		},
		in_bb_dl_speed: {
			column: 'most_common_dl',
			unit: 'st',
			min: 3,
			max: 11,
			multiple: 1,
			zindex: 99,
			step: 1
		},
		in_bb_ul_speed: {
			column: 'most_common_ul',
			unit: 'st',
			min: 3,
			max: 11,
			multiple: 1,
			zindex: 99,
			step: 1
		}
	},
	health: {
		in_pcp_access: {
			column: 'pcp_per_capita',
			unit: 'p100000',
			min: 0,
			max: 0.005,
			multiple: 100000,
			zindex: 90,
			step: 1
		},
		in_prm_death: {
			column: 'years_lost_per_100000',
			unit: 'y100000',
			min: 0,
			max: 0.005,
			multiple: 100000,
			zindex: 90,
			step: 1
		},
		in_prv_hosp: {
			column: 'preventable_hospital_stays_per_1000',
			unit: 'p1000',
			min: 0,
			max: 0.005,
			multiple: 100000,
			zindex: 90,
			step: 1
		},
		in_obs_rate: {
			column: 'adult_obesity_pct',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 90,
			step: 1
		}
	},
	count: {
		pcp: {
			column: 'pcp_total',
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
			column: 'provider_count',
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
			column: 'pop_2014',
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
	}
};

function setSlider(type, low, high) {
	
	
	console.log(' type : ' + type );
	console.log(' low : ' + low );
	console.log(' high : ' + high );
	
	
	$( '#label-'+ type ).val( ''+ low +'% - '+ high +'%' );
			
			
					
	//http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=c2hgis%3Astate%2Cc2hgis%3Acounty&STYLES=c2hgis%3Abroadband_state%2Cc2hgis%3Abroadband_county&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&CQL_FILTER=advdl_gr25000k%3E%3D0%20AND%20advdl_gr25000k%3C%3D0.2&SRS=EPSG%3A3857&BBOX=-10018754.171394622,10018754.171394626,-5009377.085697311,15028131.257091932
	
	
	var dropdown = $( '#select-in-'+ type ).val();
	var column = insight_ly[type][dropdown].column;
	var zindex = insight_ly[type][dropdown].zindex;
	
	console.log(' dropdown : ' + dropdown );
	console.log(' column : ' + column );
	console.log(' zindex : ' + zindex );
	



	var filter = column + '>=' + low + ' AND ' + column + '<=' + high;
	filter = filter + ';' + filter;

	console.log(' filter : ' + filter );
	
	
	//var cur_layer = map_overlays['in_'+ type];

	if (map.hasLayer(map_overlays['in_'+ type])) {
		map.removeLayer(map_overlays['in_'+ type]);
	}
	
	var wms_method = 'gwc/service/wms';
	//var wms_method = 'wms';

	map_overlays['in_'+ type] = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/'+ wms_method +'?', {
		 format: 'image/png',
		 transparent: true,
		 cql_filter: filter,
		 //layers: ['c2hgis:c2hgis_state', 'c2hgis:c2hgis_county'], 
		 layers: ['c2hgis:c2hgis_'+ type],
		 //styles: ['c2hgis:'+ type +'_state', 'c2hgis:'+ type +'_county']
	 }).setZIndex(zindex).addTo(map);				
	
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
    ////console.log('geocode_url : '+ geocode_url );  
    
    $.ajax({
        type: 'GET',
        url: geocode_url,
        dataType: 'json',
        success: function(data) {

            ////console.log('geocode_url data : '+ JSON.stringify(data) );    
                        
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


function setHealthSec() {

	if (map.hasLayer(health_sec_layer)) {
		map.removeLayer(health_sec_layer);
	}
	
	health_sec_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
		format: 'image/png',
		transparent: true,
		layers: ['c2hgis:c2hgis_state', 'c2hgis:c2hgis_county'], 
		styles: ['c2hgis:health_sec_'+ health_sec_type +'_state', 'c2hgis:health_sec_'+ health_sec_type +'_county']
	}).setZIndex('999').addTo(map);

}

function setBroadbandCombo() {
	
	//console.log(' setBroadbandCombo : '  );
	
	if (map.hasLayer(bb_combo_layer)) {
		map.removeLayer(bb_combo_layer);
	}
	
	
	bb_combo_layer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
		format: 'image/png',
		transparent: true,
		layers: ['c2hgis:c2hgis_state', 'c2hgis:c2hgis_county'], 
		styles: ['c2hgis:bb_combo_'+ bb_combo_type +'_'+ bb_combo_dir +'_state', 'c2hgis:bb_combo_'+ bb_combo_type +'_'+ bb_combo_dir +'_county']
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
			layers: ['c2hgis:c2hgis_state', 'c2hgis:c2hgis_county'], 
			styles: ['c2hgis:count_'+ type +'_state', 'c2hgis:count_'+ type +'_county']
		}).setZIndex('999').addTo(map);
		

		updateCountLegend();
	}
}

function updateCountLegend() {
	
	console.log(' count_type : ' + count_type );
	console.log(' geo_type : ' + geo_type );
	
	
	console.log(' zoom_type : ' + zoom_type );
	
	
	if (count_type != '' && count_types[count_type][zoom_type]) {
		

		var count_min = count_types[count_type][zoom_type].min;
		var count_max = count_types[count_type][zoom_type].max;
		var count_color = count_types[count_type].color;
		//console.log(' count_min : ' + count_min );		
		
		$( '.circle-label-min' ).html( '<&nbsp;'+ Number(count_min).toLocaleString('en') );
		$( '.circle-label-max' ).html( '>&nbsp;'+ Number(count_max).toLocaleString('en') );
		$( '.circle-sym' ).css('background-color', count_color);		
		
		$( '.legend-box').show(); 	
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
	
	//console.log(' data_url : ' + data_url );
	
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
		
	////console.log(' data : ' + JSON.stringify(data) );
	
	if (data.features){
	
		if (data.totalFeatures == 1){
		
			var geography_id = data.features[0].properties.geography_id;
			
			//console.log(' geography_id : ' + geography_id );			
			
			if (geo_id !== geography_id) {
			
				geo_id = geography_id;
				
				geo_data = data;
				
				geo_prop = geo_data.features[0].properties;
			
				var geography_type = geo_prop.geography_type;
				var geography_id = geo_prop.geography_id;
				var geography_desc = geo_prop.geography_desc;
				var pcp_total = geo_prop.pcp_total;
				var provider_count = geo_prop.provider_count;
				var pop_2014 = geo_prop.pop_2014;
				
				var female_total = geo_prop.female_total;
				var male_total = geo_prop.male_total;
				
				//console.log(' geography_type : ' + geography_type );
				//console.log(' geography_desc : ' + geography_desc );
				//console.log(' pcp_total : ' + pcp_total );
				//console.log(' provider_count : ' + provider_count );
				//console.log(' pop_2014 : ' + pop_2014 );
				
				
				$('#geog_name').text(geography_desc);
				$('#geog_pop').text(pop_2014);
				$('#geog_prov').text(provider_count);
				$('#geog_pcp').text(pcp_total);
				
				
				// ***********************************
				
				createCharts();
				
				
				// ***********************************
				
				
				
				//console.log(genderChart.generateLegend());
				
				// ***********************************
				clearClickFeature();
				
				var click_feature = L.mapbox.featureLayer(geo_data).setStyle(click_feature_option).addTo(map);				
				
				click_feature.on('click', function(e) {
					//console.log(' click_feature e.latlng : ' + e.latlng );
					
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
					
					//console.log(' geo_lat : ' + geo_lat );
					//console.log(' geo_lng : ' + geo_lng );
					//console.log(' zoom : ' + zoom );
					//console.log(' geo_type : ' + geo_type );
					
					getData();
				});
			}
			
	
			click_data.push(click_feature);	
				
		}	
	}
	
}


function createStats() {

	
	if (cur_tab == 'health'){
		
	}	
	else if (cur_tab == 'broadband'){
		
	}
	else if (cur_tab == 'population'){
		
	}
	
}

var chart_bb_dl;



function createCharts() {

	
	if (cur_tab == 'health'){
		
	}	
	else if (cur_tab == 'broadband'){
		
		
		
		
		
		
		/*
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
		*/
		
		
		
		
		
		
		
		
		
		
		

		
		// ***********************************************************
		// chart - Number of Providers
		
		var chart_bb_dl_data = {
			labels: ["> 1", "> 2", "> 3", "> 4", "> 5", "> 6", "> 7", "> 8"],
			datasets: [
				{
					label: "Number of Providers",
					fillColor: "rgba(220,220,220,0.4)",
					strokeColor: "rgba(0,80,204,1)",
					pointColor: "rgba(0,80,204,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [geo_prop.prov_gr1*100, geo_prop.prov_gr2*100, geo_prop.prov_gr3*100, geo_prop.prov_gr4*100, geo_prop.prov_gr5*100, geo_prop.prov_gr6*100, geo_prop.prov_gr7*100, geo_prop.prov_gr8*100]
				}
			]
		};
		
		var chart_bb_dl_opts = {
			//bezierCurve: false
			pointHitDetectionRadius : 0,		
			datasetFill : true,
			scaleBeginAtZero: true,
			tooltipTemplate: "<%if (label){%>Number of Providers <%=label%>: <%}%><%= value.toFixed(1) %>%",
			legendTemplate : '<ul class="<%=name.toLowerCase()%>-legends" style="width: 100%; list-style-type: none;"><% for (var i=0; i<datasets.length; i++){%><li><div style="background-color:<%=datasets[i].strokeColor%>; width: 20px; height: 2px; display: inline-block; margin: 4px 0;"></div>&nbsp;<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
			
		};

		if (chart_bb_dl) {
			chart_bb_dl.destroy();
		}
		
		
		chart_bb_dl = new Chart(document.getElementById('ch_canvas_broadband_1').getContext('2d')).Line(chart_bb_dl_data, chart_bb_dl_opts);		

		 $('#ch_legend_broadband_1').html( chart_bb_dl.generateLegend() );


		console.log(' chart_bb_dl.generateLegend : ' + chart_bb_dl.generateLegend());

	}
	else if (cur_tab == 'population'){
			
	}
}


 function clearClickFeature() {
	
	//console.log(' clearClickFeature ! '  );
	
	for (var i = 0; i < click_data.length; i++){
		
		if (map.hasLayer(click_data[i])) {
			map.removeLayer(click_data[i]);
		}
	}
	click_data.length = 0;	
 }

 function generateMenu(){
	$('.layer-switch').on('click', 'a', function(e) {


        e.preventDefault();
	
		cur_tab = $(this).attr('id');
	
        if (cur_tab === 'insights') {
            $('.list-healthMaps').addClass('hide');
            $('.list-broadbandMaps').addClass('hide');            
            $('.list-insightsMaps').removeClass('hide');        

            if (map.hasLayer(broadband_layer)) {
				map.removeLayer(broadband_layer);
			}
			if (map.hasLayer(health_layer)) {
				map.removeLayer(health_layer);
			}
			if (map.hasLayer(count_layer)) {
				map.removeLayer(count_layer);
			} 
			if (map.hasLayer(health_sec_layer)) {
				map.removeLayer(health_sec_layer);
			}    
        }
        else if (cur_tab === 'health') {
            $('.list-insightsMaps').addClass('hide');
            $('.list-broadbandMaps').addClass('hide');            
            $('.list-healthMaps').removeClass('hide'); 

			if (map.hasLayer(broadband_layer)) {
				map.removeLayer(broadband_layer);
			}
			if (map.hasLayer(health_layer)) {
				map.removeLayer(health_layer);
			}
			if (map.hasLayer(count_layer)) {
				map.removeLayer(count_layer);
			}
			if (map.hasLayer(health_sec_layer)) {
				map.removeLayer(health_sec_layer);
			}				
        }
        else if (cur_tab === 'broadband') {
            $('.list-healthMaps').addClass('hide');
            $('.list-insightsMaps').addClass('hide');            
            $('.list-broadbandMaps').removeClass('hide');  

			if (map.hasLayer(broadband_layer)) {
				map.removeLayer(broadband_layer);
			}
			if (map.hasLayer(health_layer)) {
				map.removeLayer(health_layer);
			}
			if (map.hasLayer(count_layer)) {
				map.removeLayer(count_layer);
			}
			if (map.hasLayer(health_sec_layer)) {
				map.removeLayer(health_sec_layer);
			}
        }

        $('.layer-switch').find('li').removeClass('active');
        $(this).parent('li').addClass('active');
    });
 }
     
 $(document).ready(function() {
     createMap();
     generateMenu();
	 
	 $(".selectpicker").selectpicker({});
     
});  
     
  
  