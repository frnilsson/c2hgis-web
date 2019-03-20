/*
 _____                             _   _____  _   _            _ _   _       _____ _____ _____ 
/  __ \                           | | / __  \| | | |          | | | | |     |  __ \_   _/  ___|
| /  \/ ___  _ __  _ __   ___  ___| |_`' / /'| |_| | ___  __ _| | |_| |__   | |  \/ | | \ `--. 
| |    / _ \| '_ \| '_ \ / _ \/ __| __| / /  |  _  |/ _ \/ _` | | __| '_ \  | | __  | |  `--. \
| \__/\ (_) | | | | | | |  __/ (__| |_./ /___| | | |  __/ (_| | | |_| | | | | |_\ \_| |_/\__/ /
 \____/\___/|_| |_|_| |_|\___|\___|\__\_____/\_| |_/\___|\__,_|_|\__|_| |_|  \____/\___/\____/ 
  
*/


function applyExtFilter(slider, filter, extFilter) {
	var in_styles;

	map.eachLayer(function (layer) {
		// Remove opioid broadband layer
		if (curr_health_measure_type === 'opioid' && slider === 'broadband') {
			if (layer.options.styles && (layer.options.styles === 'opioid_broadband_auto' || layer.options.styles === 'broadband_auto')) {
				map.removeLayer(layer);
			}
		}

		// Remove opioid health layers
		if (curr_health_measure_type === 'opioid' && slider === 'health') {
			if (layer.options.styles && (layer.options.styles === 'opioid_health_auto' || layer.options.styles === 'health_auto')) {
				map.removeLayer(layer);
			}
		}

		// Remove opioid layer
		if (curr_health_measure_type === 'opioid' && slider === 'opioid') {
			if (layer.options.styles && (layer.options.styles.includes('opioid') && layer.options.styles !== 'opioid_broadband_auto')) {
				map.removeLayer(layer);
			}
		}

		// Remove health layer
		if (curr_health_measure_type === 'health' && slider === 'health') {
			if (layer.options.styles && (layer.options.styles === 'health_auto' || layer.options.styles === 'opioid_health_auto')) {
				map.removeLayer(layer);
			}
		}

		// Remove health broadband layer
		if (curr_health_measure_type === 'health' && slider === 'broadband') {
			if (layer.options.styles && (layer.options.styles === 'broadband_auto' || layer.options.styles === 'opioid_broadband_auto')) {
				map.removeLayer(layer);
			}
		}
	});

	// Add opioid health measure layer
	if (curr_health_measure_type === 'opioid' && slider === 'opioid') {
		in_styles = 'opioid_health_auto'
	}

	// Add opioid broadband layer
	if (curr_health_measure_type === 'opioid' && slider === 'broadband') {
		in_styles = 'opioid_broadband_auto';
	}

	// Add health layer
	if (curr_health_measure_type === 'health' && slider === 'health') {
		in_styles = 'health_auto';
	}

	// Add health broadband layer
	if (curr_health_measure_type === 'health' && slider === 'broadband') {
		in_styles = 'broadband_auto';
	}

	// Paginate filters if necessary (character limit)
	var incrementer = 0;

	while (incrementer < extFilter.length) {
		var vals = extFilter.slice(incrementer, incrementer + 100);
		incrementer = incrementer + 100;

		var f = filter + " AND " + "geography_id" + " IN " + "(" + vals + ")";

		L.tileLayer.wms(geo_host + '/' + geo_space + '/wms?', {
			format: 'image/png',
			transparent: true,
			cql_filter: f,
			layers: geo_space + ':c2hgis_201812_' + geo_type + '_2017opioid',
			styles: in_styles
		}).setZIndex(99999).addTo(map);
	}

	setHash();
}

function getExtPopFilter(){
	// Get filtered open integration data from dropdown selection
	var thisExtPop_sel=$("#ov-select-extend").val();

	if(thisExtPop_sel) {
		var _extsFilter=[];
		thisExtPop_sel=thisExtPop_sel+"";
		var selection =  thisExtPop_sel.split('$');
		var data_column=selection[0];
		var thisExtPopRange = selection[1].split('_');
		var low = thisExtPopRange[0];
		var high = thisExtPopRange[1];

		var extsFilter;
		var started=0;
		for (var key in extsdata ) {
			if (extsdata .hasOwnProperty(key)) {
				if (thisExtPopRange[0]<extsdata [key][data_column] && extsdata [key][data_column]<thisExtPopRange[1]){
					if(started==1){
						extsFilter=extsFilter+",'" + extsdata [key]["countyFIPS"]+"'";
						_extsFilter[_extsFilter.length]="'" + extsdata [key]["countyFIPS"]+"'";
					}else{
						extsFilter="'"+extsdata [key]["countyFIPS"]+"'";
						_extsFilter[0]=extsFilter;
						started=1;
					}
				}
			}
		}

		return _extsFilter;
	}else{
		return null;
	}
}