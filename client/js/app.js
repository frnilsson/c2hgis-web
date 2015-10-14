var geo_host = 'http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com';
var geo_space = 'c2hgis';
//var geo_host = 'http://kyauk.fcc.gov:8010/geoserver';
//var geo_space = 'fcc';
var geo_output = 'application/json'

var geo_type = 'state';
//var geo_type = 'national';

var zoom_type = 'state';
var geo_lat = 40;
var geo_lng = -93;

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

var nationwideMaps = {
 "Nationwide 1":"nationwide-1",
 "Nationwide 2":"nationwide-2",
 "Nationwide 3":"nationwide-3"
};

var flMaps = {
 "Florida 1":"fl-1",
 "Florida 2":"fl-2",
 "Florida 3":"fl-3"
};

var miMaps = {
 "Michigan 1":"mi-1",
 "Michigan 2":"mi-2",
 "Michigan 3":"mi-3"
};

var msMaps = {
 "Mississippi 1":"ms-1",
 "Mississippi 2":"ms-2",
 "Mississippi 3":"ms-3"
};

var ohMaps = {
 "Ohio 1":"oh-1",
 "Ohio 2":"oh-2",
 "Ohio 3":"oh-3"
};

var vaMaps = {
 "Virginia 1":"va-1",
 "Virginia 2":"va-2",
 "Virginia 3":"va-3"
};

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

var states;

$.getJSON("/data/states.json", function(data) {
    //console.log(data);
    states = data;    
});

var mb_accessToken = 'pk.eyJ1IjoiZmNjIiwiYSI6IlA5cThBQTQifQ.EbifLm_7JkQ1uI_0_qYEAA';

function createMap() {  
	 
	 L.mapbox.accessToken = mb_accessToken;
	 
     map = L.mapbox.map('map', 'fcc.k74ed5ge', {
             attributionControl: true,
             maxZoom: 19
         })
         .setView([40, -95], 4);    

     map.attributionControl.addAttribution('<a href="http://fcc.gov/health">FCC Connect2Health</a>');

     baseStreet = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
     baseSatellite = L.mapbox.tileLayer('fcc.k74d7n0g');
     baseTerrain = L.mapbox.tileLayer('fcc.k74cm3ol');
    
     L.control.scale({
         position: 'bottomright'
     }).addTo(map);

     //geocoder = L.mapbox.geocoder('mapbox.places-v1');
	 
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
		    
    var wms_border = L.tileLayer.wms( geo_host + '/' + geo_space + '/wms?', {
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
    $('#insight-select-state').on('change', function() {
	
        var state_sel = $('#insight-select-state').val();		
		console.log(' state_sel : ' + state_sel );

		updateInsightContent(state_sel);
		
		console.log('map options updated for :' + state_sel );		
		if (state_sel == "nationwide") {
			setNationwide();
		}
		else {
			setState(state_sel);
		}
    }); 
	
	// select count
    $('#select-in-count').on('change', function() {
	
        var count_sel = $('#select-in-count').val();		
		console.log(' count_sel : ' + count_sel );
		
		if (count_sel != "") {
			setCount();
			updateStats();
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
	
	// select population
	$('#pop-sec-type').on('change', function() {
		
		setPopSec();			
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
	broadband_ov: null,
	pop_ov: null
};

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
	}
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
			tooltip: 'Percent of population with access to 25 mbps advertised download speeds.',
			name: 'Broadband Access',
			suffix: '%'
		},		
		in_bb_wn_access: {
			column: 'wireline_advdl_gr25000k',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 99,
			step: 5,
			values: [75, 100],
			label: '% Coverage',
			tooltip: 'Percent of population with access to 25 mbps advertised wireline download speeds.',
			name: 'Wireline Access',
			suffix: '%'
		},
		in_bb_ws_access: {
			column: 'wireless_advdl_gr25000k',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 99,
			step: 5,
			values: [75, 100],
			label: '% Coverage',
			tooltip: 'Percent of population with access to 25 mbps advertised wireless download speeds.',
			name: 'Wireless Access',
			suffix: '%'
		},
		in_bb_dl_speed: {
			column: 'most_common_dl',
			unit: 'st',
			min: 3,
			max: 11,
			multiple: 1,
			zindex: 99,
			step: 1,
			values: [10, 11],
			label: 'Download',
			tooltip: 'Most commonly advertised download speed.',
			name: 'Download Speed',
			suffix: 'mbps'
		},
		in_bb_ul_speed: {
			column: 'most_common_ul',
			unit: 'st',
			min: 3,
			max: 11,
			multiple: 1,
			zindex: 99,
			step: 1,
			values: [10, 11],
			label: 'Upload',
			tooltip: 'Most commonly advertised upload speed.',
			name: 'Upload Speed',
			suffix: 'mbps'
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
			values: [0.00000, 0.00065],
			label: 'Physicians',
			tooltip: 'Primary Care Physicians per 100,000 people.',
			name: 'Physician Access',
			suffix: 'per 100,000'
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
			label: 'Years',
			tooltip: 'Number of years lost due to premature death before age 75 per 100,000 people.',
			name: 'Premature Death',
			suffix: 'per 100,000'
		},
		in_prv_hosp: {
			column: 'preventable_hospital_stays_per_1000',
			unit: 'p1000',
			min: 0,
			max: 150,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [60, 120],
			label: 'Hospital Stays',
			tooltip: 'Number of preventable hospital stays per 1,000 people.',
			name: 'Preventable Hospital',
			suffix: 'per 1,000'
		},
		in_inj_death: {
			column: 'injury_deaths_per_100000',
			unit: 'p1000000',
			min: 0,
			max: 200,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [70, 100],
			label: 'Injury Deaths',
			tooltip: 'Number of deaths due to injury per 100,000 population.',
			name: 'Injury Deaths',
			suffix: 'per 100,000'
		},
		in_sick_days: {
			column: 'poor_physical_health_days_within_last_30_days',
			unit: 'days',
			min: 1,
			max: 10,
			multiple: 1,
			zindex: 90,
			step: 0.5,
			values: [4, 6],
			label: 'Sick Days',
			tooltip: 'Average number of physically unhealthy days reported in past 30 days (age-adjusted).',
			name: 'Sick Days',
			suffix: 'days'
		},
		in_obs_rate: {
			column: 'adult_obesity_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [30, 40],
			label: '% Obesity',
			tooltip: 'Percentage of adults that report a BMI of 30 or more.',
			name: 'Obesity Rate',
			suffix: '%'
		},
		in_long_commute: {
			column: 'long_commute_driving_alone',
			unit: 'perc',
			min: 0,
			max: 70,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [35, 50],
			label: '% Commuters',
			tooltip: 'Among workers who commute in their car alone, the percentage that commute more than 30 minutes.',
			name: 'Long Commute',
			suffix: '%'
		},
		in_driving_alone: {
			column: 'driving_alone_to_work',
			unit: 'perc',
			min: 0,
			max: 100,
			multiple: 1,
			zindex: 90,
			step: 10,
			values: [80, 100],
			label: '% Alone',
			tooltip: 'Percentage of the workforce that drives alone to work.',
			name: 'Driving Alone',
			suffix: '%'
		},
		in_diabetes_rate: {
			column: 'diabetes_pct',
			unit: 'perc',
			min: 0,
			max: 20,
			multiple: 1,
			zindex: 90,
			step: 2,
			values: [10, 20],
			label: '% Diabetes',
			tooltip: 'Percentage of adults with diabetes.',
			name: 'Diabetes Rate',
			suffix: '%'
		},
		in_smoking_rate: {
			column: 'smoking_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [20, 50],
			label: '% Smoking',
			tooltip: 'Percentage of adults who are current smokers.',
			name: 'Smoking Rate',
			suffix: '%'
		},
		in_drinking_rate: {
			column: 'drinking_pct',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [15, 50],
			label: '% Drunk',
			tooltip: 'Percentage of adults reporting binge or heavy drinking.',
			name: 'Excessive Drinking',
			suffix: '%'
		},
		in_phys_inactivity: {
			column: 'physical_inactivity',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [25, 50],
			label: '% Inactive',
			tooltip: 'Percentage of adults aged 20 and over reporting no leisure-time physical activity.',
			name: 'Physical Inactivity',
			suffix: '%'
		},
		in_severe_housing: {
			column: 'severe_housing_problems',
			unit: 'perc',
			min: 0,
			max: 50,
			multiple: 1,
			zindex: 90,
			step: 5,
			values: [20, 50],
			label: '% Severe',
			tooltip: 'Percentage of households with at least 1 of 4 housing problems: overcrowding, high housing costs, or lack of kitchen or plumbing facilities.',
			name: 'Severe Housing',
			suffix: '%'
		}
	},	
	count: {
		in_cnt_pcp: {
			layer: 'c2hgis',
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
			},
			name: 'Physicians',
			suffix: ''
		},
		in_cnt_ip: {
			layer: 'c2hgis',
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
			},
			name: 'Internet Providers',
			suffix: ''
		},
		in_cnt_pop: {
			layer: 'c2hgis',
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
			},
			name: 'Population',
			suffix: ''
		},
		in_cnt_tele: {
			layer: 'telehealth_cms',
			column: 'telehealth_beneficiary_total',
			style: 'telehealth',
			color: '#9d5978',
			county: {
				min: '10',
				max: '100'
			}, 
			state: {
				min: '10',
				max: '100'
			},
			name: 'Telehealth',
			suffix: ' beneficiaries'
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
		
		updateStats();
		
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

	map_overlays['in_'+ type] = L.tileLayer.wms( geo_host + '/' + geo_space + '/' + wms_method +'?', {
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

function getGeocode(search_input) {

    var geocode_url = 'https://api.mapbox.com/v4/geocode/mapbox.places/'+ encodeURIComponent(search_input) +'.json?access_token='+ mb_accessToken;
		
    //console.log('geocode_url : '+ geocode_url );  
    
    $.ajax({
        type: 'GET',
        url: geocode_url,
        dataType: 'json',
        success: function(data) {

            //console.log('geocode_url data : '+ JSON.stringify(data.features[0]) );    
                        
            if (data.features[0]) {                      
                
                var geo_bounds = data.features[0].bbox;
                
                map.fitBounds([
                    [geo_bounds[1], geo_bounds[0]],
                    [geo_bounds[3], geo_bounds[2]]
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

var pop_ly = {
	pop_density: {
		column: 'pop_density',
		style: 'pop_density',
		unit: 'pkm',
		min: '<25',
		max: '>250',
		zindex: 90,
		label: '',
		tooltip: 'Population density per square kilometer.'
	}
}

function setPopSec() {

	var pop_type = $('#pop-sec-type').val();
	
	console.log('pop_type : '+ pop_type );  
	
	if (pop_ly[pop_type]) {
	
		var pop_style = pop_ly[pop_type].style;
		
		if (map.hasLayer(map_overlays['pop_ov'])) {
			map.removeLayer(map_overlays['pop_ov']);
		}
		
		map_overlays['pop_ov'] = L.tileLayer.wms(geo_host + '/' + geo_space + '/wms?', {
			format: 'image/png',
			transparent: true,
			layers: [''+ geo_space +':c2hgis_state', ''+ geo_space +':c2hgis_county'], 
			styles: [''+ geo_space +':'+ pop_style +'_state', ''+ geo_space +':'+ pop_style +'_county']
		}).setZIndex('999').addTo(map);
		
		updatePopLegend();
	}
}

function updatePopLegend() {	

	var pop_type = $('#pop-sec-type').val();
	
	if (pop_ly[pop_type]) {

		var pop_min = pop_ly[pop_type].min;
		var pop_max = pop_ly[pop_type].max;
		var pop_label = pop_ly[pop_type].label;
		var pop_tooltip = pop_ly[pop_type].tooltip;
		
		$( '.pop-label-min' ).html( pop_min );
		$( '.pop-label-max' ).html( pop_max );
		//$( '.circle-sym' ).css('background-color', count_color);		
		
		$( '.in-cnt-legend-box').css('display', 'inline-block');	
		
		$( '#hh-tooltip-pop' ).attr( 'title', pop_tooltip ).tooltip('fixTitle');		
		
		$( '.pop-table-label' ).html( pop_label );			
	}
}
																			
var health_ly = {
	hh_pcppc: {
		column: 'pcp_per_capita',
		style: 'health_sec_pcppc',
		unit: 'p100000',
		min: '>90',
		max: '<60',
		label: 'PCP/100,000',
		tooltip: 'Primary Care Physicians per 100,000 people.'
	},
	hh_poorfair: {
		column: 'poor_fair_health_pct',
		style: 'health_sec_poorfair',
		unit: 'perc',
		min: '<10',
		max: '>17.5',
		label: '% Poor/Fair Health',
		tooltip: 'Percentage of adults reporting fair or poor health (age-adjusted).'
	},
	hh_obesity: {
		column: 'adult_obesity_pct',
		style: 'health_sec_obesity',
		unit: 'perc',
		min: '<25',
		max: '>32.5',
		label: '% Obesity',
		tooltip: 'Percentage of adults that report a BMI of 30 or more.'
	},
	hh_prematured: {
		column: 'years_lost_per_100000',
		style: 'health_sec_prematured',
		unit: 'y100000',
		min: '<5,000',
		max: '>8,000',
		label: '# Years Lost',
		tooltip: 'Number of years lost due to premature death before age 75 per 100,000 people.'
	},
	hh_preventhosp: {
		column: 'preventable_hospital_stays_per_1000',
		style: 'health_sec_preventhosp',
		unit: 'p1000',
		min: '<40',
		max: '>70',
		label: '# Hospital Stays',
		tooltip: 'Number of preventable hospital stays per 1,000 people.'
	}
}

function setHealthSec() {

	var health_type = $('#health-sec-type').val();
	
	if (health_ly[health_type]) {
	
		var health_style = health_ly[health_type].style;
		
		if (map.hasLayer(map_overlays['health_ov'])) {
			map.removeLayer(map_overlays['health_ov']);
		}
		
		map_overlays['health_ov'] = L.tileLayer.wms(geo_host + '/' + geo_space + '/wms?', {
			format: 'image/png',
			transparent: true,
			layers: [''+ geo_space +':c2hgis_state', ''+ geo_space +':c2hgis_county'], 
			styles: [''+ geo_space +':'+ health_style +'_state', ''+ geo_space +':'+ health_style +'_county']
		}).setZIndex('999').addTo(map);
		
		updateHealthLegend();
	}
}

function updateHealthLegend() {	

	var health_type = $('#health-sec-type').val();
	
	if (health_ly[health_type]) {

		var health_min = health_ly[health_type].min;
		var health_max = health_ly[health_type].max;
		var health_label = health_ly[health_type].label;
		var health_tooltip = health_ly[health_type].tooltip;
		
		$( '.health-label-min' ).html( health_min );
		$( '.health-label-max' ).html( health_max );
		//$( '.circle-sym' ).css('background-color', count_color);		
		
		$( '.in-cnt-legend-box').css('display', 'inline-block');	
		
		$( '#hh-tooltip-health' ).attr( 'title', health_tooltip ).tooltip('fixTitle');		
		
		$( '.health-table-label' ).html( health_label );			
	}
}

function setBroadbandCombo() {
	
	//console.log(' setBroadbandCombo : '  );
	
	var type =  $('.broadband-type:checked').val();
	var dir = $('.broadband-dir:checked').val();
	
	//console.log(' type : '+ type  );
	//console.log(' dir : '+ dir );
	
	if (map.hasLayer(map_overlays['broadband_ov'])) {
		map.removeLayer(map_overlays['broadband_ov']);
	}	
	
	map_overlays['broadband_ov'] = L.tileLayer.wms( geo_host + '/' + geo_space + '/wms?', {
		format: 'image/png',
		transparent: true,
		layers: [''+ geo_space +':c2hgis_state', ''+ geo_space +':c2hgis_county'], 
		styles: [''+ geo_space +':bb_combo_'+ type +'_'+ dir +'_state', ''+ geo_space +':bb_combo_'+ type +'_'+ dir +'_county']
	}).setZIndex('999').addTo(map);	

}

function setCount() {

	//console.log(' setCount type : ' + type );
	
	var type = $('#select-in-count').val();
	
	//console.log(' setCount type : ' + type );

	if (insight_ly.count[type]) {
		
		var count_layer = insight_ly.count[type].layer;
		var count_style = insight_ly.count[type].style;		
		
		console.log(' count_layer : ' + count_layer );	
		console.log(' count_style : ' + count_style );			
	
		if (map.hasLayer(map_overlays['in_count'])) {
			map.removeLayer(map_overlays['in_count']);
		}
		
		var count_layers = [''+ geo_space +':c2hgis_state', ''+ geo_space +':c2hgis_county'];
		var count_styles = [''+ geo_space +':count_'+ count_style +'_state', ''+ geo_space +':count_'+ count_style +'_county'];
		
		if (count_layer != 'c2hgis') {
			count_layers = ''+ geo_space +':' + count_layer;
			count_styles = ''+ geo_space +':count_' + count_style;
		}
		
		console.log(' count_layers : ' + count_layers );	
		console.log(' count_styles : ' + count_styles );
		
		map_overlays['in_count'] = L.tileLayer.wms(geo_host + '/' + geo_space + '/wms?', {
			format: 'image/png',
			transparent: true,
			layers: count_layers, 
			styles: count_styles
		}).setZIndex('999').addTo(map);		

		updateCountLegend();
	}
}

function updateCountLegend() {
	
	//console.log(' count_type : ' + count_type );
	//console.log(' geo_type : ' + geo_type );	
	//console.log(' zoom_type : ' + zoom_type );
	
	var count_type = $('#select-in-count').val();	
	
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
	MI: {
		lat: 44.3715397944714,
		lng: -85.4376684832842,
		zoom: 7
	}, 
	MS: {
		lat: 32.7509547380987,
		lng: -89.6621633573408,
		zoom: 7
	}, 
	OH: {
		lat: 40.1903624,
		lng: -82.6692525,
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
	//geo_type = 'national';        
    map.setView([40, -95], 3);  
    //getData();
	
	geo_prop = national_data.features[0].properties;
	 
	clearClickFeature();
	
	createCharts();	 
	updateStats();
	setDownloadLinks();
}  

function updateMapOptions(state_sel) {
	$('#select-curate-map').empty();

	var mapOptions;

	if (state_sel == "nationwide") {
		mapOptions	= nationwideMaps;
	}
	else if (state_sel == "FL") {
		mapOptions	= flMaps;
	}
	else if (state_sel == "MI") {
		mapOptions	= miMaps;
	}
	else if (state_sel == "MS") {
		mapOptions	= msMaps;
	}
	else if (state_sel == "OH") {
		mapOptions	= ohMaps;
	}
	else if (state_sel == "VA") {
		mapOptions	= vaMaps;
	}

	$("#select-curate-map")
       .html(mapOptions)
       .selectpicker('refresh');
    

	/*if (state_sel == "nationwide") {
		$.each(nationwideMaps, function(key, value) {
	 		$('#select-curate-map').append($("<option></option>").attr("value", value).text(key));
		});
	}
	else if (c
		var newOption = $('<option value="1">test</option>');
		$('#select-curate-map').append(newOption);
	}
	$('#select-curate-map').trigger("chosen:updated");
	*/
}

function updateInsightContent(state_sel) {
	var insightContent;
	
	
	if (state_sel == 'nationwide') {
		insightContent	= 'This is the brief description of the <b>Nationwide</b> insight map. Please click the more link to see the full insights. This is the brief description of the <b>Nationwide</b> insight map. Please click the more link to see the full insights. <br/><br/>This is the brief description of the <b>Nationwide</b> insight map. Please click the more link to see the full insights. This is the brief description of the <b>Nationwide</b> insight map. Please click the more link to see the full insights.';
	}
	else if (state_sel == 'FL') {
		insightContent	= 'This is the brief description of the <b>Florida</b> insight map. Please click the more link to see the full insights. This is the brief description of the <b>Florida</b> insight map. <br/><br/>Please click the more link to see the full insights. This is the brief description of the <b>Florida</b> insight map. Please click the more link to see the full insights. ';
	}
	else if (state_sel == 'MI') {
		insightContent	= 'This is the brief description of the <b>Michigan</b> insight map. Please click the more link to see the full insights. This is the brief description of the <b>Michigan</b> insight map. <br/><br/>Please click the more link to see the full insights. This is the brief description of the <b>Michigan</b> insight map. Please click the more link to see the full insights. ';
	}
	else if (state_sel == 'MS') {
		insightContent	= 'This is the brief description of the <b>Mississippi</b> insight map. Please click the more link to see the full insights. This is the brief description of the <b>Mississippi</b> insight map. <br/><br/>Please click the more link to see the full insights. This is the brief description of the <b>Mississippi</b> insight map. Please click the more link to see the full insights.';
	}
	else if (state_sel == 'OH') {
		insightContent	= 'This is the brief description of the <b>Ohio</b> insight map. Please click the more link to see the full insights. This is the brief description of the <b>Ohio</b> insight map. <br/><br/>Please click the more link to see the full insights. This is the brief description of the <b>Ohio</b> insight map. Please click the more link to see the full insights. ';
	}
	else if (state_sel == 'VA') {
		insightContent	= 'This is the brief description of the <b>Virginia</b> insight map. Please click the more link to see the full insights. This is the brief description of the <b>Virginia</b> insight map. <br/><br/>Please click the more link to see the full insights. This is the brief description of the <b>Virginia</b> insight map. Please click the more link to see the full insights. ';
	}
	
	var insightURL = 'insights.html';	
	if (state_sel != 'nationwide') {
		insightURL += '#'+ state_sel;
	}
	
	$('.full-insights-link').attr('href', insightURL);
	
	$('#state-insights').html(insightContent);
	//$('#state-insights').show();	
}

function setDownloadLinks() {
	
	var data_type = geo_prop.geography_type;	
	var download_layer = 'c2hgis_'+ data_type;
	
	var download_filter = '';	
	if (data_type != 'national') {	
		download_filter = '&cql_filter=geography_id='+ geo_prop.geography_id;
	}
	
	//console.log(' data_type : ' + data_type );
	//console.log(' download_filter : ' + download_filter );
	
	$('#download-data-json').attr('href', geo_host + '/' + geo_space + '/wfs?service=WFS&version=1.0.0&request=GetFeature&maxFeatures=1&outputFormat=application/json&typeName='+ geo_space +':'+ download_layer + download_filter );
	$('#download-data-xml').attr('href', geo_host + '/' + geo_space + '/wfs?service=WFS&version=1.0.0&request=GetFeature&maxFeatures=1&outputFormat=GML3&typeName='+ geo_space +':'+ download_layer + download_filter );
	$('#download-data-shp').attr('href', geo_host + '/' + geo_space + '/wfs?service=WFS&version=1.0.0&request=GetFeature&maxFeatures=1&outputFormat=shape-zip&typeName='+ geo_space +':'+ download_layer + download_filter );
	$('#download-data-kml').attr('href', geo_host + '/' + geo_space + '/wms/kml?layers='+ geo_space +':'+ download_layer );
	$('#download-data-csv').attr('href', geo_host + '/' + geo_space + '/wfs?service=WFS&version=1.0.0&request=GetFeature&maxFeatures=1&outputFormat=csv&typeName='+ geo_space +':'+ download_layer + download_filter );
}

function getData() {	

	var data_url = geo_host +'/'+ geo_space +'/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName='+ geo_space +':c2hgis_'+ geo_type +'&maxFeatures=1&outputFormat=text/javascript&cql_filter=contains(geom,%20POINT(' + geo_lng + ' ' + geo_lat + '))&format_options=callback:callbackData';
	
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
		
	//console.log('processData : ' + JSON.stringify(data) );
	
	if (data.features){
	
		if (data.totalFeatures == 1){
		
			var geography_id = data.features[0].properties.geography_id;
			
			//console.log(' geography_id : ' + geography_id );			
			
			if (geo_id !== geography_id) {
			
				geo_id = geography_id;
				
				geo_data = data;
				
				geo_prop = geo_data.features[0].properties;
				
				// ***********************************		
				setDownloadLinks();
				updateStats();	
				createCharts();				
				clearClickFeature();
				
				// ***********************************		
				if (geo_type != 'national') {
				
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
						
						getData();
					});
				}
			}			
	
			click_data.push(click_feature);					
		}	
	}
	
}

function updateStats() {
	
	var geography_type = geo_prop.geography_type;
	var geography_id = geo_prop.geography_id;
	var geography_desc = geo_prop.geography_desc;	

	if (geography_type == 'county'){
		var abbr = states[geography_id.substring(0,2)]["abbr"];
		//geography_desc = geography_desc.concat(", ").concat(abbr); 
		geography_desc += ', '+ abbr; 
	}
	else if (geography_type == 'national'){
		geography_desc = 'Nationwide';
	}
	
	geography_desc += ' Statistics:';
	
	//console.log(' geography_type : ' + geography_type );
	//console.log(' geography_desc : ' + geography_desc );	
	
	$('.geog-name').text(geography_desc);
	$('.geog-pop').text(formatStat(geo_prop.pop_2014));
	$('.geog-prov').text(formatStat(geo_prop.provider_count));	
		
	// Insight Stats	
	
	var broadband_sel = $('#select-in-broadband').val();
	var health_sel = $('#select-in-health').val();
	var count_sel = $('#select-in-count').val();
	
	var broadband_stat_value, health_stat_value, count_stat_value;
	
	if ((broadband_sel == 'in_bb_dl_speed') || (broadband_sel == 'in_bb_ul_speed')) {
		broadband_stat_value = bb_speed_tiers[geo_prop[insight_ly.broadband[broadband_sel].column]].range +' '+ insight_ly.broadband[broadband_sel].suffix;
	}
	else {
		broadband_stat_value = formatStat(geo_prop[insight_ly.broadband[broadband_sel].column]) +' '+ insight_ly.broadband[broadband_sel].suffix;
	}		
	
	health_stat_value = formatStat((geo_prop[insight_ly.health[health_sel].column] * insight_ly.health[health_sel].multiple), 1) +' '+ insight_ly.health[health_sel].suffix;
	
	count_stat_value = formatStat(geo_prop[insight_ly.count[count_sel].column]) +' '+ insight_ly.count[count_sel].suffix;
	
	$('#in-broadband-stat-name').text(insight_ly.broadband[broadband_sel].name +' : ');
	$('#in-broadband-stat-value').text(broadband_stat_value);
	
	$('#in-health-stat-name').text(insight_ly.health[health_sel].name +' : ');
	$('#in-health-stat-value').text(health_stat_value);
	
	console.log(' count_sel : ' + count_sel );	
	
	$('#in-count-stat-name').text(insight_ly.count[count_sel].name +' : ');
	$('#in-count-stat-value').text(count_stat_value);
	
	// Health Stats
	$('.geog-pcp').text(formatStat(geo_prop.pcp_total));
	$('.geog-dentists').text(formatStat(geo_prop.dentist_total));
	$('.geog-mental').text(formatStat(geo_prop.mhp_total));
	
	$('.geog-poorfair').text(formatStat(geo_prop.poor_fair_health_total));
	$('.geog-prematured').text(formatStat(geo_prop.years_lost_per_100000, 1) +' per 100,000');
	$('.geog-prevhosp').text(formatStat(geo_prop.preventable_hospital_stays_per_1000, 1) +' per 1,000');	
	$('.geog-injuryd').text(formatStat(geo_prop.injury_deaths_per_100000, 1) +' per 100,000');
	$('.geog-sickdays').text(formatStat(geo_prop.poor_physical_health_days_within_last_30_days, 1) +' days per month');	
	
	$('.geog-longcommute').text(formatStat(geo_prop.long_commute_driving_alone, 1) +'%');
	$('.geog-drivealone').text(formatStat(geo_prop.driving_alone_to_work, 1) +'%');
	
	$('.geog-obes').text(formatStat(geo_prop.adult_obesity_pct, 1) + '%');
	$('.geog-diab').text(formatStat(geo_prop.diabetes_pct, 1) + '%');
	$('.geog-smok').text(formatStat(geo_prop.smoking_pct, 1) + '%');
	$('.geog-drin').text(formatStat(geo_prop.drinking_pct, 1) + '%');
	$('.geog-inac').text(formatStat(geo_prop.physical_inactivity, 1) + '%');
	//$('.geog-inse').text(formatStat(geo_prop.physical_inactivity, 3) + '%');	
	$('.geog-severehousing').text(formatStat(geo_prop.severe_housing_problems, 1) + '%');
	
	// Broadband Stats
	$('.geog-provcount').text(formatStat(geo_prop.provider_count) );
	
	$('.geog-combdl').text(formatStat(geo_prop.advdl_gr25000k, 1) + '%');
	$('.geog-combul').text(formatStat(geo_prop.advul_gr3000k, 1) + '%');
	$('.geog-wldl').text(formatStat(geo_prop.wireline_advdl_gr25000k, 1) + '%');
	$('.geog-wlul').text(formatStat(geo_prop.wireline_advul_gr3000k, 1) + '%');
	$('.geog-wsdl').text(formatStat(geo_prop.wireless_advdl_gr25000k, 1) + '%');
	$('.geog-wsul').text(formatStat(geo_prop.wireless_advul_gr3000k, 1) + '%');	
	
	$('.geog-commondl').text((bb_speed_tiers[geo_prop.most_common_dl].range) + ' mbps');
	$('.geog-commonul').text((bb_speed_tiers[geo_prop.most_common_ul].range) + ' mbps');
	$('.geog-greatdl').text((bb_speed_tiers[geo_prop.greatest_dl].range) + ' mbps');
	$('.geog-greatul').text((bb_speed_tiers[geo_prop.greatest_ul].range) + ' mbps');
	
	// Population Stats
	$('.geog-pop-total').text(formatStat(geo_prop.pop_2014) );	
	$('.geog-pop-density').text(formatStat(geo_prop.pop_density, 1) + 'per sq km');
	
	$('.geog-pop-urban').text(formatStat(geo_prop.urban_total, 0) + '');
	$('.geog-pop-rural').text(formatStat(geo_prop.rural_total, 0) + '');
	
	$('.geog-pop-male').text(formatStat(geo_prop.male_total, 0) + '');
	$('.geog-pop-female').text(formatStat(geo_prop.female_total, 0) + '');	
}

function formatStat(input, decimal) {
	
	var output = '';
	
	if ($.isNumeric( input )) {
		
		if (decimal) {
			output = Number(input.toFixed(decimal)).toLocaleString('en');
		}
		else {
			output = input.toLocaleString('en');
		}		
	}
	else {
		output = 'N/A ';
	}
	
	return output;	
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
	
	//console.log(' cur_tab : ' +  cur_tab );
	
	if (cur_tab == 'health'){		

		//console.log(' health chart : '  );	
		//console.log(' geo_prop.adult_obesity_pct : ' + geo_prop.adult_obesity_pct  );
		//console.log(' geo_prop : ' +  JSON.stringify(geo_prop) );

		updateStats();
		
		chart_obj.health.measurements.data = {
			labels: ["Obesity", "Diabetes", "Smoking", "Excessive Drinking", "Physical Inactivity", "Severe Housing"],
			datasets: [
				{
					label: "Health Behaviours",
					fillColor: "rgba(220,220,220,0.2)",
					strokeColor: "rgba(186,12,12,0.5)",
					pointColor: "rgba(186,12,12,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [geo_prop.adult_obesity_pct, geo_prop.diabetes_pct, geo_prop.smoking_pct, geo_prop.drinking_pct, geo_prop.physical_inactivity, geo_prop.severe_housing_problems]
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
			
		var current_slide = $('.carousel-inner div.active').index() + 1;
		
		//console.log(' current_slide : ' + current_slide );	
		
		if (chart_obj.broadband.dl_tiers.chart) {
			chart_obj.broadband.dl_tiers.chart.destroy();
		}
		if (chart_obj.broadband.num_providers.chart) {
			chart_obj.broadband.num_providers.chart.destroy();
		}
		
		// ***********************************************************
		// chart - Download Tiers
		
		if (current_slide == 2) {
		
			chart_obj.broadband.dl_tiers.data = [
			   {
				  value: geo_prop.advdl_gr768k_lt1500k,
				  label: '0.768 - 1.5',
				  color: '#919190'
			   },
			   {
				  value: geo_prop.advdl_gr1500k_lt3000k,
				  label: '1.5 - 3',
				  color: '#dcdcc6'
			   },
			   {
				  value: geo_prop.advdl_gr3000k_lt6000k,
				  label: '3 - 6',
				  color: '#baf200'
			   },
			   {
				  value: geo_prop.advdl_gr6000k_lt10000k,
				  label: '6 - 10',
				  color: '#baf200'
			   },
			   {
				  value: geo_prop.advdl_gr10000k_lt25000k,
				  label: '10 - 25',
				  color: '#5ae200'
			   },
			   {
				  value: geo_prop.advdl_gr25000k_lt50000k,
				  label: '25 - 50',
				  color: '#0bb81d'
			   },
			   {
				  value: geo_prop.advdl_gr50000k_lt100000k,
				  label: '50 - 100',
				  color: '#00807a'
			   },
			   {
				  value: geo_prop.advdl_gr100000k_lt1gig,
				  label: '100 - 1,000',
				  color: '#0050cc'
			   }
			];
			
			chart_obj.broadband.dl_tiers.options = {
				animationEasing: 'easeOutQuart',
				tooltipTemplate: '<%=label%>: <%= Number(value).toLocaleString() %>%',
				//legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
			};

			if (chart_obj.broadband.dl_tiers.chart) {
				chart_obj.broadband.dl_tiers.chart.destroy();
			}
			chart_obj.broadband.dl_tiers.chart = new Chart(document.getElementById('ch-canvas-broadband-2').getContext('2d')).Doughnut(chart_obj.broadband.dl_tiers.data, chart_obj.broadband.dl_tiers.options);		
			
			 $('#ch-legend-broadband-2').html( 'Download Speed Tiers' );
		}
		
		// ***********************************************************
		// chart - Upload Tiers
		
		if (current_slide == 3) {
		
			chart_obj.broadband.ul_tiers.data = [
			   {
				  value: geo_prop.advul_gr768k_lt1500k,
				  label: '0.768 - 1.5',
				  color: '#919190'
			   },
			   {
				  value: geo_prop.advul_gr1500k_lt3000k,
				  label: '1.5 - 3',
				  color: '#dcdcc6'
			   },
			   {
				  value: geo_prop.advul_gr3000k_lt6000k,
				  label: '3 - 6',
				  color: '#baf200'
			   },
			   {
				  value: geo_prop.advul_gr6000k_lt10000k,
				  label: '6 - 10',
				  color: '#baf200'
			   },
			   {
				  value: geo_prop.advul_gr10000k_lt25000k,
				  label: '10 - 25',
				  color: '#5ae200'
			   },
			   {
				  value: geo_prop.advul_gr25000k_lt50000k,
				  label: '25 - 50',
				  color: '#0bb81d'
			   },
			   {
				  value: geo_prop.advul_gr50000k_lt100000k,
				  label: '50 - 100',
				  color: '#00807a'
			   },
			   {
				  value: geo_prop.advul_gr100000k_lt1gig,
				  label: '100 - 1,000',
				  color: '#0050cc'
			   }
			];
			
			chart_obj.broadband.ul_tiers.options = {
				animationEasing: 'easeOutQuart',
				tooltipTemplate: '<%=label%>: <%= Number(value).toLocaleString() %>%',
				//legendTemplate : '<% for (var i = segments.length-1; i >= 0; i--){%><div style="background-color:<%=segments[i].fillColor%>; width: 16px; height: 16px; display: inline-block;"></div>&nbsp;<%=segments[i].label%> &nbsp; <%}%>'			
			};

			if (chart_obj.broadband.ul_tiers.chart) {
				chart_obj.broadband.ul_tiers.chart.destroy();
			}
			chart_obj.broadband.ul_tiers.chart = new Chart(document.getElementById('ch-canvas-broadband-3').getContext('2d')).Doughnut(chart_obj.broadband.ul_tiers.data, chart_obj.broadband.ul_tiers.options);		
			
			 $('#ch-legend-broadband-3').html( 'Upload Speed Tiers' );
		}
		
		// ***********************************************************
		// chart - Number of Providers
		
		if (current_slide == 1) {
		
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
						data: [geo_prop.prov_gr1, geo_prop.prov_gr2, geo_prop.prov_gr3, geo_prop.prov_gr4, geo_prop.prov_gr5, geo_prop.prov_gr6, geo_prop.prov_gr7, geo_prop.prov_gr8]
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

			if (chart_obj.broadband.num_providers.chart) {
				chart_obj.broadband.num_providers.chart.destroy();
			}		
			
			chart_obj.broadband.num_providers.chart = new Chart(document.getElementById('ch-canvas-broadband-1').getContext('2d')).Line(chart_obj.broadband.num_providers.data, chart_obj.broadband.num_providers.options);		

			 $('#ch-legend-broadband-1').html( chart_obj.broadband.num_providers.chart.generateLegend() );

			//console.log(' chart_bb_dl.generateLegend : ' + chart_bb_dl.generateLegend());
		
		}
		
	}
	else if (cur_tab == 'population'){		
		
		chart_obj.population.gender.data = [
		   {
			  value: geo_prop.male_total,
			  label: 'Male',
			  color: '#05ad28'
		   },
		   {
			  value: geo_prop.female_total,
			  label: 'Female',
			  color: '#fffc1e'
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

	//console.log(' clearMap ! '  );
	
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
			var count_sel = $('#select-in-count').val();
			if (count_sel != "") {
				setCount();
			}
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
			
			setPopSec();
        }
		
		createCharts();

        $('.layer-switch').find('li').removeClass('active');
        $(this).parent('li').addClass('active');
    });
 }
     
 $(document).ready(function() {
 
     //geo_data = national_data;
	 geo_prop = national_data.features[0].properties;
	 
	 createMap();
     generateMenu();
	 
	 createSlider();
	 
	 setCount();
	 
	 updateStats();	
	 
	 $(".selectpicker").selectpicker({});
	 
	 $('.in-tooltip, .hh-tooltip').tooltip();
	
	$('#carousel-bb').bind('slid.bs.carousel', function (e) {
		//console.log('slide event!');
		createCharts();
	});
    
});  
       
  