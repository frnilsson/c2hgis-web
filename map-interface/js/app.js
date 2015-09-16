
var geo_host = 'http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com';
var geo_space = 'c2hgis';
var geo_output = 'application/json'

var lastZoom = 3;
var zoomCounty = 6;
var layerType = "state";

function createMap() {
 
 
     L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
     map = L.mapbox.map('map', 'fcc.k74ed5ge', {
             attributionControl: true,
             maxZoom: 19
         })
         .setView([45, -93], 3);
		 
	lastZoom = map.getZoom();
		 

     map.attributionControl.addAttribution('<a href="http://fcc.gov/maps">FCC Maps</a>');

     baseStreet = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
     baseSatellite = L.mapbox.tileLayer('fcc.k74d7n0g');
     baseTerrain = L.mapbox.tileLayer('fcc.k74cm3ol');
 
	var wms_health_and_broadband_county = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
         transparent: true,
         layers: 'c2hgis:score_health_and_broadband_county'
     });
	 
	var wms_pcp_and_provider_county = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
         transparent: true,
         layers: 'c2hgis:score_pcp_and_provider_county'
     });
	 
	var wms_health_and_broadband_state = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
         transparent: true,
         layers: 'c2hgis:score_health_and_broadband_state'
     });
	 
	var wms_pcp_and_provider_state = L.tileLayer.wms('http://c2hgis-geoserv-tc-dev01.elasticbeanstalk.com/c2hgis/wms?', {
         format: 'image/png',
         transparent: true,
         layers: 'c2hgis:score_pcp_and_provider_state'
     });

     L.control.scale({
         position: 'bottomright'
     }).addTo(map);

     geocoder = L.mapbox.geocoder('mapbox.places-v1');

     layerControl = new L.Control.Layers({
         'Street': baseStreet.addTo(map),
         'Satellite': baseSatellite,
         'Terrain': baseTerrain
     }, {
	 	'Health and Broadband County': wms_health_and_broadband_county,
		'PCP and Provider County': wms_pcp_and_provider_county,
		'Health and Broadband State': wms_health_and_broadband_state.addTo(map),
		'PCP and Provider State': wms_pcp_and_provider_state

     }, {
		position: 'topleft'
	 }
	 ).addTo(map);
	 
	
	map.on("zoomend", function() {
	
		if (lastZoom < zoomCounty && map.getZoom() >= zoomCounty) {
			if (map.hasLayer(wms_health_and_broadband_state)) {
				map.removeLayer(wms_health_and_broadband_state);
			}
			wms_health_and_broadband_county.addTo(map);
		}
		
		if (lastZoom >= zoomCounty && map.getZoom() < zoomCounty) {
			if (map.hasLayer(wms_health_and_broadband_county)) {
				map.removeLayer(wms_health_and_broadband_county);
			}
			wms_health_and_broadband_state.addTo(map);
		}
		
		lastZoom = map.getZoom();
	});
	 
	 
}
	 
	 
function getData() {

var state = "TX";
var url = "getStateData/" + state;
alert("url=" + url);
	$.ajax({
			type: "GET",
			url: url,
			dataType: "json",
			//dataType: "jsonp",
			success: function(data) {
			processData(data);
			}
		});
}
	

function processData(data) {
	
var stateCountyLayer =  L.geoJson(data,  {
      //style: styleShown,
      //onEachFeature: onEachFeature
  }).addTo(map);
}

	
	 
 $(document).ready(function() {
     createMap();
	 //getData();
});	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 