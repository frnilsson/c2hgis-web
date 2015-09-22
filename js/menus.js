(function($, document, window, viewport) {
  $(function () {
    $('.expand-tertiary').click(function (e) {
        e.preventDefault();

        var parent_menu = $(this).parents('.top-level-menu, .tertiary-menu');
        var selected_menu = e.target.href.split('#')[1];

        parent_menu.hide("slide", { direction: "left" }, 500, function(){
          $("#" + selected_menu).show("slide", { direction: "right"}, 500);
        });

    });

    $('.collapse-tertiary').click(function (e) {
        e.preventDefault();

      var parent_menu = $(this).parents('.top-level-menu, .tertiary-menu');
      var selected_menu = e.target.href.split('#')[1];

      parent_menu.hide("slide", { direction: "right" }, 500, function(){
        $("#" + selected_menu).show("slide", { direction: "left"}, 500);
      });
    });

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

    // var $navbar = $('.navbar');
    // $('.navbar-secondary li.dropdown').mouseenter(function(){
    //   if (!isMobileLayout()) {
    //     $(this).addClass('open');
    //   }
    // }).mouseleave(function(){
    //   $(this).removeClass('open');
    // })
    // $('.navbar-secondary li.dropdown > a.dropdown-toggle').click(function() {
    //   if (!isMobileLayout()) {
    //     window.location = this.href;
    //   }
    // });
    
    // function isMobileLayout() {
    //   if ($navbar.hasClass('navbar-static-top')) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }

  });
})(jQuery, document, window, ResponsiveBootstrapToolkit);