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
    $('.page-menu a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $('.sidebar-navigation-area').toggleClass('active');
        $('.main-menu').toggleClass('active');
    });



    /*---------------------------
                                  Fancybox
    ---------------------------*/
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
        $('.shuffle-item').css('display', 'none');

        $('.shuffle-item').each(function(index, el) {
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