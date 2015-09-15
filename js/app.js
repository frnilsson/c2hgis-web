(function() {

    $('.layer-switch').on('click', 'a', function(e) {
        var $this = $(this),
            id = $this.attr('id');

        e.preventDefault();

        if (id === 'score') {
            $('.list-healthMaps').addClass('hide');
            $('.list-broadbandMaps').addClass('hide');
            $('.list-demoMaps').addClass('hide');
            $('.list-scoreMaps').removeClass('hide');
            $('#cb1').click();
        }
        else if (id === 'health') {
            $('.list-scoreMaps').addClass('hide');
            $('.list-broadbandMaps').addClass('hide');
            $('.list-demoMaps').addClass('hide');
            $('.list-healthMaps').removeClass('hide');
            $('#cb1').click();
        }
        else if (id === 'broadband') {
            $('.list-healthMaps').addClass('hide');
            $('.list-scoreMaps').addClass('hide');
            $('.list-demoMaps').addClass('hide');
            $('.list-broadbandMaps').removeClass('hide');
            $('#cb1').click();
        } else {
            $('.list-healthMaps').addClass('hide');
            $('.list-scoreMaps').addClass('hide');
            $('.list-broadbandMaps').addClass('hide');
            $('.list-demoMaps').removeClass('hide');            
        }

        $('.layer-switch').find('li').removeClass('active');
        $this.parent('li').addClass('active');
    });


    $('.help-tips').tooltip({
        placement: 'right',
        container: 'body'
    });

    if ($('[data-toggle="floatThead"]:visible').length > 0) { 
    	$('[data-toggle="floatThead"]:visible').floatThead();
    }
        $('.nav-tablist').tabdrop();

    if($('.nav-tablist').length > 0){
        $('.nav-tablist').stickyTabs({
            backToTop: true
        });
    }

    $('[data-toggle="affix"]').each(function(){
        var $menu = $(this),
            $menuParent = $menu.parent(),
            $mainContent = $('.main-content'),
            $contentParent = $mainContent.parent();

        initMenuAffix();

        if($mainContent.find('.collapse').length > 0){
            $mainContent.find('.collapse')
                .on('shown.bs.collapse hidden.bs.collapse',function(){
                    initMenuAffix();
                });
        }

        $menu.on('affix.bs.affix',function(){
            $(this).css('width',$(this).width());
        });

        $menu.on('affixed-top affixed-bottom',function(){
            $(this).css('width','');
        });

        function initMenuAffix(){
            var menuHeight = $menu.outerHeight(true),
                contentHeight = $contentParent.outerHeight(true),
                footerHeight = $('footer').outerHeight(true),
                windowHeight = $(window).height(),
                topOffset = $menuParent.offset().top - 20,
                bottomOffset = footerHeight + 25;

            if(contentHeight > menuHeight && windowHeight > menuHeight){
                $menu.affix({
                    offset: {
                        top: topOffset,
                        bottom: bottomOffset
                    }
                });
                $menuParent.css({
                    'height': contentHeight,
                    'position': 'relative'
                });
            } else {
                $(window).off('.affix');
                $menu
                    .removeClass("affix affix-top affix-bottom")
                    .removeData("bs.affix");

                $menuParent.css('height','');
            }
        }
    });
/*
    if($('.profile-menu-trigger:visible').length > 0){
        $('.profile-menu-trigger').click(function(e){
            e.preventDefault();
            var $menuTrigger = $(this),
                activeClass = 'active',
                divToShow = $menuTrigger.data('show'),
                divToSlide = $menuTrigger.data('slideDown');

            $menuTrigger.toggleClass(activeClass);
            if($menuTrigger.hasClass(activeClass)){
                $(divToShow).show();
                $(divToSlide).slideDown(400);
            } else {
                $(divToSlide).slideUp(400,function(){
                    $(divToShow).hide();
                });
            }
            return false;
        });
    }
*/
})();
