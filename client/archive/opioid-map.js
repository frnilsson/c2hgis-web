function updateOpioidMap(curr_health_measure_type) {
        var opioid_type = $('#opioid-sec-type').val();
        var opioidMeasure = $('#select-in-opioid').val();
        var selectedDataOverlay = $('#select-in-count').val();

        clearMap();
        
        // Add Chronic Disease related layers
        if (curr_health_measure_type === 'health') {
        	var healthLayerIndex =  map_overlays.in_health.length - 1;
        	var healthLayer = map_overlays.in_health[healthLayerIndex];
        	var bbLayerIndex =  map_overlays.in_broadband.length - 1;
        	var bbLayer = map_overlays.in_broadband[bbLayerIndex];

        	bbLayer.options.styles = 'broadband_auto';
        	bbLayer.wmsParams.styles = 'broadband_auto';

        	map.addLayer(healthLayer);
        	map.addLayer(bbLayer);
        }

        // Add Opioid related layers
        if (curr_health_measure_type === 'opioid') {
        	var healthLayerIndex =  map_overlays.in_opioid.length - 1;
        	var healthLayer = map_overlays.in_opioid[healthLayerIndex];
        	
        	var bbLayerIndex =  map_overlays.in_broadband.length - 1;
        	var bbOpioidLayer = map_overlays.in_broadband[bbLayerIndex];

        	bbOpioidLayer.options.styles = 'opioid_broadband_auto';
        	bbOpioidLayer.wmsParams.styles = 'opioid_broadband_auto';

        	map.addLayer(healthLayer);
        	map.addLayer(bbOpioidLayer);
        }

        // Add Data Overlay if selected
        if (selectedDataOverlay !== 'none' && map_overlays.in_count.length > 0) {
        	var dataOverlayIndex = map_overlays.in_count.length - 1;
        	map.addLayer(map_overlays.in_count[dataOverlayIndex]);
        }

        //Reset health measure tab change flag
        healthMeasureChange = false;    
}