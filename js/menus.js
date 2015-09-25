(function($, document, window, viewport) {
  $(function () {


    $('.layer-switch').on('click', 'a', function(e) {
        var $this = $(this),
            id = $this.attr('id');

        e.preventDefault();

        if (id === 'insights') {
            $('.list-healthMaps').addClass('hide');
            $('.list-broadbandMaps').addClass('hide');            
            $('.list-insightsMaps').removeClass('hide');            
        }
        else if (id === 'health') {
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
			
        }
        else if (id === 'broadband') {
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

			
        }

        $('.layer-switch').find('li').removeClass('active');
        $this.parent('li').addClass('active');
    });



  });
})(jQuery, document, window, ResponsiveBootstrapToolkit);