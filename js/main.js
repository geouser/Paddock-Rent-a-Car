// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.toggle-menu'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });

    $('.sound-mute').click(function(){
        var video = $(this).data('video');
        $(this).toggleClass('muted');
        if ($(this).hasClass('muted')) {
            $('' + video + '').prop('muted', true);
            $(this).children('span').text('Sound off');
        } else {
            $('' + video + '').prop('muted', false);
            $(this).children('span').text('Sound on');
        }
    });


    /*---------------------------
                                  File input logic
    ---------------------------*/
    $('input[type=file]').each(function(index, el) {
        $(this).on('change', function(event) {
            event.preventDefault();
            var placeholder = $(this).siblings('.placeholder');
        
            if ( this.files.length > 0 ) {
                if ( this.files[0].size < 5000000 ) {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    if ( filename == '' ) {
                        filename = placeholder.attr('data-label');
                    }
                    placeholder.text(filename);
                } else {
                    alert('Maximum file size is 5Mb');
                }    
            } else {
                placeholder.text( placeholder.attr('data-label') );
            }
            
        });
    });
    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.page-anchors a').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 800);
        $('.page-anchors a').removeClass('active');
        $(this).addClass('active');
        return false;
    });

    $(document).on("scroll", onScroll);

    function onScroll(event){
        var scrollPos = $(document).scrollTop();
        $('.page-anchors a').each(function () {
            var currLink = $(this);
            var wh = $(window).height();
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos + (wh / 1.5) && refElement.position().top + refElement.height() > scrollPos) {
                $('.page-anchors a').removeClass("active");
                currLink.addClass("active");
            }
            else{
                currLink.removeClass("active");
            }
        });
    }

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $('.sidebar-navigation-area').toggleClass('active');
        $('.main-menu').toggleClass('active');
    });


    $('.js-toggle-site-menu').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $('.sidebar').toggleClass('active')
    });



    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox.request-service').on('click', function(event) {
        var service = $(this).attr('data-service');
        var target = $(this).attr('href');
        $(target).find('.service-title').text(service);
        $(target).find('input[name="service"]').val(service);
    }); 
    $('.fancybox').fancybox({
        
    });


    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }


    /*---------------------------
                                  jQuery UI datepicker
    ---------------------------*/
    $( ".js-date" ).datepicker({
        minDate: 0,
        dateFormat: "MM dd, yy"
    });


    /*---------------------------
                                  mCustomScrollar
    ---------------------------*/
    if ( !window.params.isMobile ) {
        $(".scroll-y").mCustomScrollbar({
            axis: 'y',
            mouseWheel: { 
                scrollAmount: 90
            }
        });

        $(".scroll-x").mCustomScrollbar({
            axis: 'x',
            advanced: {
                autoExpandHorizontalScroll: 2
            }
        });    
    }
    



    $('.shuffle-trigger').on('click', function(event) {
        event.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        var filter = $(this).attr('data-group');
        var container = $( $(this).parents('.filter-options').attr('data-shuffle-box') );
        container.find('.shuffle-item').css('display', 'none');
        console.log(container)

        container.find('.shuffle-item').each(function(index, el) {
            var groups = jQuery.parseJSON($(this).attr('data-groups'));
            if ( jQuery.inArray(filter, groups) > -1 ) {
                $(this).fadeIn();
            }
        });
        if ( !window.params.isMobile ) {
            $(".scroll-x").mCustomScrollbar("destroy");
            $(".scroll-x").mCustomScrollbar({
                axis: 'x',
                advanced:{ autoExpandHorizontalScroll: 2 }
            });
            $('.gallery-grid').each(function(index, el) {
                gridWidth( $(this) );
            });
        }
         
        
    });


    /*---------------------------
                                  Gallery
    ---------------------------*/
    function gridWidth( element ) {
        element.each(function(index, el) {
            var rows = $(this).attr('data-rows')*1;
            var count = $(this).find('.gg-item:visible').length;
            var itemWidth = $('.gg-item').outerWidth();
            var parentWidth = Math.floor($('.scroll-block').width());
            //$('.scroll-block').width(parentWidth);
            var width;

            if ( (itemWidth * count) >= ( Math.floor(parentWidth / itemWidth) * itemWidth * rows ) ) {
                width = (Math.ceil(count / rows)) * $('.gg-item').outerWidth();
            } else {
                width = parentWidth - 5;
            }           
            $(this).width(width)
        }); 
    }

    if ( !window.params.isMobile ) {
        $('.gallery-grid').each(function(index, el) {
            gridWidth( $(this) );
        }); 
    }

    $(window).on('resize', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ( !window.params.isMobile ) {
            $('.gallery-grid').each(function(index, el) {
                gridWidth( $(this) );
            }); 
        }
    });
    






    /*---------------------------
                                  Car Select
    ---------------------------*/
    $('.js-select-button').on('click', function(event) {
        event.preventDefault();
        var list = $(this).siblings('.select-list');
        list.toggleClass('active');
    });


    $('.select-list .list-item').on('click', function(event) {
        event.preventDefault();
        var list = $(this).parents('.select-list');
        var button = list.siblings('.js-select-button');
        var input = list.siblings('input');

        var value = $(this).attr('data-value');
        button.addClass('selected').text(value);
        input.val(value);
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        list.removeClass('active');
    });

    $(document).on('click', function(event) {
        if ( !$(event.target).closest('.js-select-button').length && !$(event.target).closest('.select-list').length ) {
            $('.select-list').removeClass('active')
        }
    });

    /*---------------------------
                                  Form submit
    ---------------------------*/
    $('.ajax-form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });



    /*---------------------------
                                  Google map init
    ---------------------------*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var styles = [];

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 16,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        var styledMapType=new google.maps.StyledMapType(styles,{name:'Styled'});
        map.mapTypes.set('Styled',styledMapType);
        map.setMapTypeId('Styled');

        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Site Title"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( exist( '#map_canvas' ) ) {
        googleMap_initialize();
    }

}); // end file