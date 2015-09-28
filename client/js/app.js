
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

//var ctx;
//var genderChart;

//var broadband_layer;
//var health_layer;
//var count_layer;


//var bb_combo_type = 'wn';
//var bb_combo_dir = 'dl';

//var bb_combo_layer;

//var health_sec_type = '';
//var health_sec_layer;

//var count_type = '';

function createMap() {  
 
		 
	 
	 L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
     map = L.mapbox.map('map', 'fcc.k74ed5ge', {
             attributionControl: true,
             maxZoom: 19
         })
         .setView([40, -93], 4);    

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
         layers: ''+ geo_space +':border',
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
		
		//console.log(' geo_lat : ' + geo_lat );
		//console.log(' geo_lng : ' + geo_lng );
		
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
		
		//console.log(' count_sel : ' + count_sel );
		
		if (count_sel != "") {
			setCount();
		}
		else {
			if (map.hasLayer(map_overlays['in_count'])) {
				map.removeLayer(map_overlays['in_count']);
			}
			$( '.in-cnt-legend-box').css('display', 'none');
		}
    }); 
	
	// select health
	$('#health-sec-type').on('change', function() {
	
        //health_sec_type = $(this).val();  $('#health-sec-type').val();		
		//console.log(' health_sec_type : ' + health_sec_type );
		
		setHealthSec();	
		
    }); 
	
	
	
	// select broadband
	$('.broadband-type').on('change', function() {
	
        bb_combo_type = $(this).val();
		
		//console.log(' bb_combo_type : ' + bb_combo_type );
		
		setBroadbandCombo();		
		
    }); 
	
	$('.broadband-dir').on('change', function() {
	
        bb_combo_dir = $(this).val();
		
		//console.log(' bb_combo_dir : ' + bb_combo_dir );
		
		setBroadbandCombo();		
    }); 
	
		
	 
}


var map_overlays = {	
	in_broadband: null,
	in_health: null,
	in_count: null,
	health_ov: null,
	broadband_ov: null
}

var bb_speed_tiers = {
	3: {
		range: '< 1.5',
		min: '< 1.5',
		max: '< 1.5'
	},
	4:{
		range: '1.5 - 3',
		min: '1.5',
		max: '3'
	},
	5: {
		range: '3 - 6',
		min: '1.5',
		max: '6'
	},
	6: {
		range: '6 - 10',
		min: '6',
		max: '10'
	},
	7: {
		range: '10 - 25',
		min: '10',
		max: '25'
	},
	8: {
		range: '25 - 50',
		min: '25',
		max: '50'
	},
	9: {
		range: '50 - 100',
		min: '50',
		max: '100'
	},
	10: {
		range: '100 - 1,000',
		min: '100',
		max: '1,000'
	},
	11: {
		range: '> 1,000',
		min: '> 1,000',
		max: '> 1,000'
	},
};

var in_units = {
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
		desc: 'Years'
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
			min: 50,
			max: 100,
			multiple: 1,
			zindex: 99,
			step: 5,
			values: [90, 100],
			label: '% Coverage',
			tooltip: 'Percent of population with access to 25 mbps advertised download speeds.'
		},
		in_bb_dl_speed: {
			column: 'most_common_dl',
			unit: 'st',
			min: 3,
			max: 11,
			multiple: 1,
			zindex: 99,
			step: 1,
			values: [8, 11],
			label: 'Download',
			tooltip: 'Most commonly advertised download speed.'
		},
		in_bb_ul_speed: {
			column: 'most_common_ul',
			unit: 'st',
			min: 3,
			max: 11,
			multiple: 1,
			zindex: 99,
			step: 1,
			values: [8, 11],
			label: 'Upload',
			tooltip: 'Most commonly advertised upload speed.'
		}
	},
	health: {
		in_pcp_access: {
			column: 'pcp_per_capita',
			unit: 'p100000',
			min: 0,
			max: 0.002,
			multiple: 100000,
			zindex: 90,
			step: 0.00005,
			values: [0.00025, 0.00075],
			label: 'Physicians',
			tooltip: 'Primary Care Physicians per 100,000 people.'
		},
		in_prm_death: {
			column: 'years_lost_per_100000',
			unit: 'y100000',
			min: 2500,
			max: 20000,
			multiple: 1,
			zindex: 90,
			step: 100,
			values: [7500, 15000],
			label: 'Years Lost',
			tooltip: 'Number of years lost due to premature death before age 75 per 100,000 people.'
		},
		in_prv_hosp: {
			column: 'preventable_hospital_stays_per_1000',
			unit: 'p1000',
			min: 0,
			max: 150,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [60, 120],
			label: 'Hospital Stays',
			tooltip: 'Number of preventable hospital stays per 1,000 people.'
		},
		in_obs_rate: {
			column: 'adult_obesity_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 1,
			values: [30, 40],
			label: '% Obesity',
			tooltip: 'Percentage of adults that report a BMI of 30 or more.'
		}
	},
	count: {
		in_cnt_pcp: {
			column: 'pcp_total',
			style: 'pcp',
			color: '#ba0c0c',
			county: {
				min: 10,
				max: 500
			}, 
			state: {
				min: '1,000',
				max: '10,000'
			}
		},
		in_cnt_ip: {
			column: 'provider_count',
			style: 'ip',
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
		in_cnt_pop: {
			column: 'pop_2014',
			style: 'pop',
			color: '#05ad28',
			county: {
				min: '10,000',
				max: '1&nbsp;million'
			}, 
			state: {
				min: '1&nbsp;million',
				max: '10&nbsp;million'
			}
		}
	}
};

function updateSlider(type) {
	
	var dropdown = $( '#select-in-'+ type ).val();	

	var min = insight_ly[type][dropdown].min;
	var max = insight_ly[type][dropdown].max;
	var step = insight_ly[type][dropdown].step;
	var values = insight_ly[type][dropdown].values;
	
	//console.log(' min : ' + min );
	//console.log(' max : ' + max );
	//console.log(' step : ' + step );	
	
	$( '#slider-'+ type ).slider({
		range: true,
		min: min,
		max: max,
		step: step,
		values: values,
		slide: function( event, slider ) {
		
			setSliderMap(type, slider.values[ 0 ], slider.values[ 1 ]);
		}
	});
	
	setSliderMap(type, values[0], values[1]);	
}
	
function createSlider() {
	
	updateSlider('broadband');
	updateSlider('health');
	
	$('.select-insight').on('change', function() {
	
        var cur_type = $(this).attr('id').split('-')[2];
		
		//console.log(' cur_type : ' + cur_type );
		
		updateSlider(cur_type);	
		
    });	
}

function setSliderMap(type, low, high) {	
	
	//console.log(' type : ' + type );
	//console.log(' low : ' + low );
	//console.log(' high : ' + high );
	
	var dropdown = $( '#select-in-'+ type ).val();
	var column = insight_ly[type][dropdown].column;
	var zindex = insight_ly[type][dropdown].zindex;
	var unit = insight_ly[type][dropdown].unit;
	var multiple = insight_ly[type][dropdown].multiple;
	var label = insight_ly[type][dropdown].label;
	var tooltip = insight_ly[type][dropdown].tooltip;
	
	//console.log(' dropdown : ' + dropdown );
	//console.log(' column : ' + column );
	//console.log(' zindex : ' + zindex );	
	
	var label_text = '';
	
	if (unit == 'st') {
		
		if (low != high) {
			label_text = bb_speed_tiers[low].min +' to '+ bb_speed_tiers[high].max +' mbps';
		}
		else {
			label_text = bb_speed_tiers[low].range +' mbps';
		}			
	}
	else {
		label_text = Number(low*multiple).toLocaleString('en') +' - '+ Number(high*multiple).toLocaleString('en') +' '+ label;
	}	

	$( '#label-'+ type ).text( label_text );	
	
	$( '#in-tooltip-'+ type ).attr( 'title', tooltip ).tooltip('fixTitle');

	var filter = column + '>=' + low + ' AND ' + column + '<=' + high;
	filter = filter + ';' + filter;

	//console.log(' filter : ' + filter );	
	
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
		 //layers: [''+ geo_space +':c2hgis_state', ''+ geo_space +':c2hgis_county'], 
		 layers: [''+ geo_space +':c2hgis_'+ type],
		 //styles: [''+ geo_space +':'+ type +'_state', ''+ geo_space +':'+ type +'_county']
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


function setHealthSec() {

	var type = $('#health-sec-type').val();
	
	if (map.hasLayer(map_overlays['health_ov'])) {
		map.removeLayer(map_overlays['health_ov']);
	}
	
	map_overlays['health_ov'] = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
		format: 'image/png',
		transparent: true,
		layers: [''+ geo_space +':c2hgis_state', ''+ geo_space +':c2hgis_county'], 
		styles: [''+ geo_space +':health_sec_'+ type +'_state', ''+ geo_space +':health_sec_'+ type +'_county']
	}).setZIndex('999').addTo(map);

}

function setBroadbandCombo() {
	
	console.log(' setBroadbandCombo : '  );
	
	var type =  $('.broadband-type:checked').val();
	var dir = $('.broadband-dir:checked').val();
	
	console.log(' type : '+ type  );
	console.log(' dir : '+ dir );
	
	if (map.hasLayer(map_overlays['broadband_ov'])) {
		map.removeLayer(map_overlays['broadband_ov']);
	}	
	
	map_overlays['broadband_ov'] = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
		format: 'image/png',
		transparent: true,
		layers: [''+ geo_space +':c2hgis_state', ''+ geo_space +':c2hgis_county'], 
		styles: [''+ geo_space +':bb_combo_'+ type +'_'+ dir +'_state', ''+ geo_space +':bb_combo_'+ type +'_'+ dir +'_county']
	}).setZIndex('999').addTo(map);	

}

function setCount() {

	//console.log(' setCount type : ' + type );
	
	var type = $('#select-count').val();
	
	//console.log(' setCount type : ' + type );

	if (insight_ly.count[type]) {
	
		var style = insight_ly.count[type].style;
		
		//console.log(' style : ' + style );	
	
		if (map.hasLayer(map_overlays['in_count'])) {
			map.removeLayer(map_overlays['in_count']);
		}
		
		map_overlays['in_count'] = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
			format: 'image/png',
			transparent: true,
			layers: [''+ geo_space +':c2hgis_state', ''+ geo_space +':c2hgis_county'], 
			styles: [''+ geo_space +':count_'+ style +'_state', ''+ geo_space +':count_'+ style +'_county']
		}).setZIndex('999').addTo(map);		

		updateCountLegend();
	}
}

function updateCountLegend() {
	
	//console.log(' count_type : ' + count_type );
	//console.log(' geo_type : ' + geo_type );
	
	
	//console.log(' zoom_type : ' + zoom_type );
	
	var count_type = $('#select-count').val();	
	
	if (count_type != '' && insight_ly.count[count_type][zoom_type]) {		

		var count_min = insight_ly.count[count_type][zoom_type].min;
		var count_max = insight_ly.count[count_type][zoom_type].max;
		var count_color = insight_ly.count[count_type].color;
		//console.log(' count_min : ' + count_min );		
		
		//$( '.circle-label-min' ).html( '<&nbsp;'+ Number(count_min).toLocaleString('en') );
		//$( '.circle-label-max' ).html( '>&nbsp;'+ Number(count_max).toLocaleString('en') );
		
		$( '.circle-label-min' ).html( '<'+ count_min );
		$( '.circle-label-max' ).html( '>'+ count_max );
		$( '.circle-sym' ).css('background-color', count_color);		
		
		$( '.in-cnt-legend-box').css('display', 'inline-block');	
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
	
	var data_url = geo_host +'/'+ geo_space +'/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName='+ geo_space +':c2hgis_'+geo_type+'&maxFeatures=1&outputFormat=text/javascript&cql_filter=contains(geom,%20POINT(' + geo_lng + ' ' + geo_lat + '))&format_options=callback:callbackData';
	
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

var chart_obj = {
	health: {
		measurements: {
			chart: null,
			data: null,
			options: null
		}
	},
	broadband: {
		num_providers: {
			chart: null,
			data: null,
			options: null
		},
		dl_tiers: {
			chart: null,
			data: null,
			options: null
		},
		ul_tiers: {
			chart: null,
			data: null,
			options: null
		}
	},
	population: {
		gender: {
			chart: null,
			data: null,
			options: null
		}	
	}
	
};

function createCharts() {

	
	console.log(' cur_tab : ' +  cur_tab );
	
	if (cur_tab == 'health'){
		

		console.log(' health chart : '  );
		
		
		/*
		premature_death_total: 30050,
		premature_death_pct: 1.03,
		poor_fair_health_total: 368811,
		poor_fair_health_pct: 12.7,
		adult_obesity_total: 879663,
		adult_obesity_pct: 30.29,
		pcp_total: 2133,
		pcp_pct: 0.07,
		prevent_hosp_stay_total: 328509,
		prevent_hosp_stay_pct: 11.31,
		health_cost_total: 1041631,
		health_cost_pct: 3.5270087487936372,
		cost_no_dr_total: 74394,
		cost_no_dr_pct: 2.56175833439221,
		submission_cycle: "2015-09",
		smoking_total: 79118,
		smoking_pct: 2.7244293343608743,
		drinking_total: 77728,
		drinking_pct: 2.6765646667155645,
		dentist_total: 1528,
		dentist_pct: 0.052616699397146235,
		mhp_total: 4984,
		mhp_pct: 0.17162410326922567,
		diabetes_total: 197549,
		diabetes_pct: 6.802602322779347,
		health_cost_national_total: 29532986,
		car_death_total: 2956,
		car_death_pct: 0.10178989752484573,
		health_cost_state_avg: 9387,
		
		advdl_gr25000k: 0.8168,
advul_gr3000k: 0.9977,
wireline_advdl_gr25000k: 0.8168,
wireline_advul_gr3000k: 0.7829,
wireless_advdl_gr25000k: 0,
wireless_advul_gr3000k: 0.9967,
advdl_gr768k_lt1500k: 0.0001,
advdl_gr1500k_lt3000k: 0,
advdl_gr3000k_lt6000k: 0.0011,
advdl_gr6000k_lt10000k: 0.0005,
advdl_gr10000k_lt25000k: 0.1815,
advdl_gr25000k_lt50000k: 0.0249,
advdl_gr50000k_lt100000k: 0.0829,
advdl_gr100000k_lt1gig: 0.6408,
advul_gr200k_lt768k: 0.0001,
advul_gr768k_lt1500k: 0.0001,
advul_gr1500k_lt3000k: 0.0021,
advul_gr3000k_lt6000k: 0.1724,
advul_gr6000k_lt10000k: 0.2575,
advul_gr10000k_lt25000k: 0.3891,
advul_gr25000k_lt50000k: 0.0693,
advul_gr50000k_lt100000k: 0.0202,
advul_gr100000k_lt1gig: 0.0221,
most_common_dl: 10,
greatest_dl: 11,
most_common_ul: 7,
greatest_ul: 11,
provider_count: 85,
prov_0: 0,
prov_gr1: 1,
prov_gr2: 1,
prov_gr3: 0.9976,
prov_gr4: 0.9686,
prov_gr5: 0.8935,
prov_gr6: 0.7772,
prov_gr7: 0.5751,
prov_gr8: 0.229,
pop_2014: 2904021,
		
		geo_prop.adult_obesity_pct
		*/
	
		console.log(' geo_prop.adult_obesity_pct : ' + geo_prop.adult_obesity_pct  );
		
		//console.log(' geo_prop : ' +  JSON.stringify(geo_prop) );
		
		chart_obj.health.measurements.data = {
			labels: ["Obesity", "Diabetes", "Smoking", "Excessive Drinking", "Physical Inactivity", "Food Insecurity"],
			datasets: [
				{
					label: "Health Behaviours",
					fillColor: "rgba(220,220,220,0.2)",
					strokeColor: "rgba(186,12,12,0.5)",
					pointColor: "rgba(186,12,12,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [geo_prop.adult_obesity_pct, geo_prop.diabetes_pct, geo_prop.smoking_pct, geo_prop.drinking_pct, geo_prop.adult_obesity_pct*.7, geo_prop.diabetes_pct*1.5]
				}
			]
		};
		
		chart_obj.health.measurements.options = {
			//animationEasing: 'easeOutQuart',
			//tooltipTemplate: '<%=label%>: <%= value.toLocaleString() %> (<%= Math.round(circumference / 6.283 * 1000) / 10 %>%)',
			//legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
		
			tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value.toFixed(1) %>%",
			legendTemplate : '<ul class="<%=name.toLowerCase()%>-legends" style="width: 100%; list-style-type: none;"><% for (var i=0; i<datasets.length; i++){%><li><div style="background-color:<%=datasets[i].strokeColor%>; width: 20px; height: 2px; display: inline-block; margin: 4px 0;"></div>&nbsp;<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
		
		};


		if (chart_obj.health.measurements.chart) {
			chart_obj.health.measurements.chart.destroy();
		}
		chart_obj.health.measurements.chart = new Chart(document.getElementById('ch-canvas-health-1').getContext('2d')).Radar(chart_obj.health.measurements.data, chart_obj.health.measurements.options);		
		
		$('#ch-legend-health-1').html( chart_obj.health.measurements.chart.generateLegend() );	
		
	}	
	else if (cur_tab == 'broadband'){
		
		
	
		
		// ***********************************************************
		// chart - Download Tiers
		
		chart_obj.broadband.dl_tiers.data = [
		   {
			  value: geo_prop.advdl_gr768k_lt1500k,
			  label: '0.768 - 1.5',
			  color: '#3500cc'
		   },
		   {
			  value: geo_prop.advdl_gr1500k_lt3000k,
			  label: '1.5 - 3',
			  color: '#00b2cc'
		   },
		   {
			  value: geo_prop.advdl_gr3000k_lt6000k,
			  label: '3 - 6',
			  color: '#00cc82'
		   },
		   {
			  value: geo_prop.advdl_gr6000k_lt10000k,
			  label: '6 - 10',
			  color: '#005bcc'
		   },
		   {
			  value: geo_prop.advdl_gr10000k_lt25000k,
			  label: '10 - 25',
			  color: '#000ecc'
		   },
		   {
			  value: geo_prop.advdl_gr25000k_lt50000k,
			  label: '25 - 50',
			  color: '#0090cc'
		   },
		   {
			  value: geo_prop.advdl_gr50000k_lt100000k,
			  label: '50 - 100',
			  color: '#00cca3'
		   },
		   {
			  value: geo_prop.advdl_gr100000k_lt1gig,
			  label: '100 - 1,000',
			  color: '#003acc'
		   }
		];
		
		chart_obj.broadband.dl_tiers.options = {
			animationEasing: 'easeOutQuart',
			//tooltipTemplate: '<%=label%>: <%= value.toLocaleString() %>',
			//legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
		};


		if (chart_obj.broadband.dl_tiers.chart) {
			chart_obj.broadband.dl_tiers.chart.destroy();
		}
		chart_obj.broadband.dl_tiers.chart = new Chart(document.getElementById('ch-canvas-broadband-2').getContext('2d')).Doughnut(chart_obj.broadband.dl_tiers.data, chart_obj.broadband.dl_tiers.options);		
		
		 //$('#ch-legend-broadband-2').html( chart_obj.broadband.dl_tiers.chart.generateLegend() );
		 
		
		// ***********************************************************
		// chart - Number of Providers
		
		chart_obj.broadband.num_providers.data = {
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
		
		chart_obj.broadband.num_providers.options = {
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
		
		chart_obj.broadband.num_providers.chart = new Chart(document.getElementById('ch-canvas-broadband-1').getContext('2d')).Line(chart_obj.broadband.num_providers.data, chart_obj.broadband.num_providers.options);		

		 $('#ch-legend-broadband-1').html( chart_obj.broadband.num_providers.chart.generateLegend() );


		//console.log(' chart_bb_dl.generateLegend : ' + chart_bb_dl.generateLegend());

	}
	else if (cur_tab == 'population'){
		
		
		chart_obj.population.gender.data = [
		   {
			  value: geo_prop.male_total,
			  label: 'Male',
			  color: '#5ce4f0'
		   },
		   {
			  value: geo_prop.female_total,
			  label: 'Female',
			  color: '#f0cb5c'
		   }				   
		];
		
		chart_obj.population.gender.options = {
			animationEasing: 'easeOutQuart',
			tooltipTemplate: '<%=label%>: <%= value.toLocaleString() %> (<%= Math.round(circumference / 6.283 * 1000) / 10 %>%)',
			legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
		};


		if (chart_obj.population.gender.chart) {
			chart_obj.population.gender.chart.destroy();
		}
		chart_obj.population.gender.chart = new Chart(document.getElementById('ch-canvas-population-1').getContext('2d')).Doughnut(chart_obj.population.gender.data, chart_obj.population.gender.options);		
		
		 $('#ch-legend-population-1').html( chart_obj.population.gender.chart.generateLegend() );	
	}
}

function clearMap() {

	console.log(' clearMap ! '  );
	
	for (var k in map_overlays) {
		
		if (map.hasLayer(map_overlays[k])) {
			map.removeLayer(map_overlays[k]);
		}
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
	
		clearMap();
	
        if (cur_tab === 'insights') {
            $('.list-health-panel').addClass('hide');
            $('.list-broadband-panel').addClass('hide'); 
			$('.list-population-panel').addClass('hide'); 
            $('.list-insight-panel').removeClass('hide'); 
			
			createSlider();
        }
        else if (cur_tab === 'health') {
            $('.list-insight-panel').addClass('hide');
            $('.list-broadband-panel').addClass('hide');  
			$('.list-population-panel').addClass('hide'); 
            $('.list-health-panel').removeClass('hide'); 
			
			setHealthSec();
        }
        else if (cur_tab === 'broadband') {
            $('.list-health-panel').addClass('hide');
            $('.list-insight-panel').addClass('hide');  
			$('.list-population-panel').addClass('hide'); 
            $('.list-broadband-panel').removeClass('hide');  
			
			
			setBroadbandCombo();
			
        }
		else if (cur_tab === 'population') {
            $('.list-health-panel').addClass('hide');
            $('.list-insight-panel').addClass('hide');   
			$('.list-broadband-panel').addClass('hide'); 
            $('.list-population-panel').removeClass('hide');  			
        }
		
		createCharts();

        $('.layer-switch').find('li').removeClass('active');
        $(this).parent('li').addClass('active');
    });
 }
     
 $(document).ready(function() {
     createMap();
     generateMenu();
	 
	 createSlider();
	 
	 setCount();
	 
	 $(".selectpicker").selectpicker({});
	 
	 $('.in-tooltip').tooltip();
	 
	 //geo_data = national_data;
	 geo_prop = national_data.features[0].properties;
     
});  
       
  