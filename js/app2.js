
var geo_host = 'http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com';
var geo_space = 'c2hgis';
var geo_output = 'application/json'

var map;
var broadbandLayer;
var healthLayer;
var demographicsLayer;
var layerList = [
'c2hgis:broadbandLayer_advdl_gr25000k_onecolor_state',
'c2hgis:broadbandLayer_advdl_gr25000k_onecolor_county',
'c2hgis:broadbandLayer_advul_gr3000k_onecolor_state',
'c2hgis:broadbandLayer_advul_gr3000k_onecolor_county',
'c2hgis:broadbandLayer_wireline_advdl_gr25000k_onecolor_state',
'c2hgis:broadbandLayer_wireline_advdl_gr25000k_onecolor_county',
'c2hgis:broadbandLayer_wireline_advul_gr3000k_onecolor_state',
'c2hgis:broadbandLayer_wireline_advul_gr3000k_onecolor_county',
'c2hgis:broadbandLayer_wireless_advdl_gr25000k_onecolor_state',
'c2hgis:broadbandLayer_wireless_advdl_gr25000k_onecolor_county',
'c2hgis:broadbandLayer_wireless_advul_gr3000k_onecolor_state',
'c2hgis:broadbandLayer_wireless_advul_gr3000k_onecolor_county',

'c2hgis:healthLayer_pcp_pct_onecolor_state',
'c2hgis:healthLayer_pcp_pct_onecolor_county',
'c2hgis:healthLayer_poor_fair_health_pct_onecolor_state',
'c2hgis:healthLayer_poor_fair_health_pct_onecolor_county',
'c2hgis:healthLayer_premature_death_pct_onecolor_state',
'c2hgis:healthLayer_premature_death_pct_onecolor_county',
'c2hgis:healthLayer_adult_obesity_pct_onecolor_state',
'c2hgis:healthLayer_adult_obesity_pct_onecolor_county',
'c2hgis:healthLayer_prevent_hosp_stay_pct_onecolor_state',
'c2hgis:healthLayer_prevent_hosp_stay_pct_onecolor_county',
'c2hgis:healthLayer_health_cost_pct_onecolor_state',
'c2hgis:healthLayer_health_cost_pct_onecolor_county',

'c2hgis:broadbandLayer_advdl_gr25000k_multicolor_state',
'c2hgis:broadbandLayer_advdl_gr25000k_multicolor_county',
'c2hgis:broadbandLayer_advul_gr3000k_multicolor_state',
'c2hgis:broadbandLayer_advul_gr3000k_multicolor_county',
'c2hgis:broadbandLayer_wireline_advdl_gr25000k_multicolor_state',
'c2hgis:broadbandLayer_wireline_advdl_gr25000k_multicolor_county',
'c2hgis:broadbandLayer_wireline_advul_gr3000k_multicolor_state',
'c2hgis:broadbandLayer_wireline_advul_gr3000k_multicolor_county',
'c2hgis:broadbandLayer_wireless_advdl_gr25000k_multicolor_state',
'c2hgis:broadbandLayer_wireless_advdl_gr25000k_multicolor_county',
'c2hgis:broadbandLayer_wireless_advul_gr3000k_multicolor_state',
'c2hgis:broadbandLayer_wireless_advul_gr3000k_multicolor_county',
'c2hgis:broadbandLayer_provider_count_multicolor_state',
'c2hgis:broadbandLayer_provider_count_multicolor_county',

'c2hgis:healthLayer_pcp_pct_multicolor_state',
'c2hgis:healthLayer_pcp_pct_multicolor_county',
'c2hgis:healthLayer_poor_fair_health_pct_multicolor_state',
'c2hgis:healthLayer_poor_fair_health_pct_multicolor_county',
'c2hgis:healthLayer_premature_death_pct_multicolor_state',
'c2hgis:healthLayer_premature_death_pct_multicolor_county',
'c2hgis:healthLayer_adult_obesity_pct_multicolor_state',
'c2hgis:healthLayer_adult_obesity_pct_multicolor_county',
'c2hgis:healthLayer_prevent_hosp_stay_pct_multicolor_state',
'c2hgis:healthLayer_prevent_hosp_stay_pct_multicolor_county',
'c2hgis:healthLayer_health_cost_pct_multicolor_state',
'c2hgis:healthLayer_health_cost_pct_multicolor_county',

'c2hgis:demoLayer_pop_2014_multicolor_state',
'c2hgis:demoLayer_pop_2014_multicolor_county',
'c2hgis:demoLayer_rural_pct_multicolor_state',
'c2hgis:demoLayer_rural_pct_multicolor_county'
];


function createMap() {
 
 
     L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
     map = L.mapbox.map('map', 'fcc.k74ed5ge', {
             attributionControl: true,
             maxZoom: 19
         })
         .setView([45, -93], 3);

     map.attributionControl.addAttribution('<a href="http://fcc.gov/maps">FCC Maps</a>');

     baseStreet = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
     baseSatellite = L.mapbox.tileLayer('fcc.k74d7n0g');
     baseTerrain = L.mapbox.tileLayer('fcc.k74cm3ol');
	 
	 baseLayerNames = {
	     'Street': baseStreet.addTo(map),
         'Satellite': baseSatellite,
         'Terrain': baseTerrain
		 }
	 
	 broadbandLayer_advdl_gr25000k_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['broadbandLayer_advdl_gr25000k_multicolor_state', 'broadbandLayer_advdl_gr25000k_multicolor_county']
     }).setZIndex('1');
	 
	 broadbandLayer_advul_gr3000k_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['broadbandLayer_advul_gr3000k_multicolor_state', 'broadbandLayer_advul_gr3000k_multicolor_county']
     }).setZIndex('1');
	 
	broadbandLayer_wireline_advdl_gr25000k_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['broadbandLayer_wireline_advdl_gr25000k_multicolor_state', 'broadbandLayer_wireline_advdl_gr25000k_multicolor_county']
     }).setZIndex('1'); 

	 broadbandLayer_wireline_advul_gr3000k_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['broadbandLayer_wireline_advul_gr3000k_multicolor_state', 'broadbandLayer_wireline_advul_gr3000k_multicolor_county']
     }).setZIndex('1');
	 
	 broadbandLayer_wireless_advdl_gr25000k_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['broadbandLayer_wireless_advdl_gr25000k_multicolor_state', 'broadbandLayer_wireless_advdl_gr25000k_multicolor_county']
     }).setZIndex('1');
	 
	 broadbandLayer_wireless_advul_gr3000k_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['broadbandLayer_wireless_advul_gr3000k_multicolor_state', 'broadbandLayer_wireless_advul_gr3000k_multicolor_county']
     }).setZIndex('1');
	 
	 
	healthLayer_pcp_pct_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['healthLayer_pcp_pct_multicolor_state', 'healthLayer_pcp_pct_multicolor_county']
     }).setZIndex('1');
	 
	 healthLayer_premature_death_pct_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['healthLayer_premature_death_pct_multicolor_state', 'healthLayer_premature_death_pct_multicolor_county']
     }).setZIndex('1');
	 
	 healthLayer_poor_fair_health_pct_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['healthLayer_poor_fair_health_pct_multicolor_state', 'healthLayer_poor_fair_health_pct_multicolor_county']
     }).setZIndex('1');
	 
	 healthLayer_adult_obesity_pct_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['healthLayer_adult_obesity_pct_multicolor_state', 'healthLayer_adult_obesity_pct_multicolor_county']
     }).setZIndex('1');
	 
	 healthLayer_prevent_hosp_stay_pct_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['healthLayer_prevent_hosp_stay_pct_multicolor_state', 'healthLayer_prevent_hosp_stay_pct_multicolor_county']
     }).setZIndex('1');

	 healthLayer_health_cost_pct_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['healthLayer_health_cost_pct_multicolor_state', 'healthLayer_health_cost_pct_multicolor_county']
     }).setZIndex('1');
	 
	 	 
	 broadbandLayer_provider_count_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['broadbandLayer_provider_count_multicolor_state', 'broadbandLayer_provider_count_multicolor_county']
     }).setZIndex('1');
	 
	 
	demoLayer_pop_2014_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['demoLayer_pop_2014_multicolor_state', 'demoLayer_pop_2014_multicolor_county']
     }).setZIndex('1');
	 
	 demoLayer_rural_pct_multicolor = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
		 transparent: true,
         layers: ['demoLayer_rural_pct_multicolor_state', 'demoLayer_rural_pct_multicolor_county']
     }).setZIndex('1');
	 
	 
	 wmsNames = {
	'advdl_gr25000k': broadbandLayer_advdl_gr25000k_multicolor,
	 'advul_gr3000k': broadbandLayer_advul_gr3000k_multicolor,
	'wireline_advdl_gr25000k': broadbandLayer_wireline_advdl_gr25000k_multicolor,
	'wireline_advul_gr3000k': broadbandLayer_wireline_advul_gr3000k_multicolor,
	'wireless_advdl_gr25000k': broadbandLayer_wireless_advdl_gr25000k_multicolor,
	'wireless_advul_gr3000k': broadbandLayer_wireless_advul_gr3000k_multicolor,
	'pcp_pct': healthLayer_pcp_pct_multicolor,
	'premature_death_pct': healthLayer_premature_death_pct_multicolor,
	'poor_fair_health_pct': healthLayer_poor_fair_health_pct_multicolor,
	'adult_obesity_pct': healthLayer_adult_obesity_pct_multicolor,
	'prevent_hosp_stay_pct': healthLayer_prevent_hosp_stay_pct_multicolor,
	'health_cost_pct': healthLayer_health_cost_pct_multicolor,
	'provider_count': broadbandLayer_provider_count_multicolor,
	'pop_2014': demoLayer_pop_2014_multicolor,
	'rural_pct': demoLayer_rural_pct_multicolor
	};
	 
	 
	 
     L.control.scale({
         position: 'bottomright'
     }).addTo(map);

     geocoder = L.mapbox.geocoder('mapbox.places-v1');

     layerControl = new L.Control.Layers(baseLayerNames, wmsNames, {}, {
		position: 'topleft'
	 }
	 ).addTo(map);
	
console.log(layerList);	
console.log(layerList.length);
	
}
	 
	 
function setupListener() {
$("#btn-score").on("click", function() {
clickScore();
});


}

function clickScore() {

var broadband_layer_name = $("#broadband-layer-name").val();
var broadband_value_min = $("#broadband-value-min").val();
var broadband_value_max = $("#broadband-value-max").val();

var filter = broadband_layer_name + ">=" + broadband_value_min + " AND " + broadband_layer_name + "<=" + broadband_value_max;
var filter = filter + ";" + filter;

console.log(filter)

if (map.hasLayer(broadbandLayer)) {
	map.removeLayer(broadbandLayer);
}

var state_layer = "c2hgis:broadbandLayer_" + broadband_layer_name + '_onecolor_state';
var county_layer = "c2hgis:broadbandLayer_" + broadband_layer_name + '_onecolor_county';

broadbandLayer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
         transparent: true,
		 cql_filter: filter,

         layers: [state_layer, county_layer]
     }).setZIndex('1').addTo(map);



	 
	 
var health_layer_name = $("#health-layer-name").val();
var health_value_min = $("#health-value-min").val();
var health_value_max = $("#health-value-max").val();

var filter = health_layer_name + ">=" + health_value_min + " AND " + health_layer_name + "<=" + health_value_max;
var filter = filter + ";" + filter;

console.log(filter);

if (map.hasLayer(healthLayer)) {
	map.removeLayer(healthLayer);
}

var state_layer = "c2hgis:healthLayer_" + health_layer_name + '_onecolor_state';
var county_layer = "c2hgis:healthLayer_" + health_layer_name + '_onecolor_county';


console.log(state_layer);
healthLayer = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
         transparent: true,
		 cql_filter: filter,
         layers: [state_layer, county_layer]
     }).setZIndex('1').addTo(map); 
	 

	 
	 

return;




}


	 
 $(document).ready(function() {
     createMap();
	 setupListener();
	 //getData();
});	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 