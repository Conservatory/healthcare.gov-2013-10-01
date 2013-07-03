$(function() {
    // Add lang button if it exist
    if ('{{page.lang}}' == 'es') {
        var url = window.location.href.replace('cuidadodesalud.gov','healthcare.gov').replace('/es/','/');
        $('.span1 a.btn-mini.btn-lang, #header .lang').removeClass('nodisplay').attr('href', url);
    }
    if ('{{page.lang}}' == 'en') {
        if ('{{site.baseurl}}'.length > 0) {
            var url = window.location.href.replace('{{site.baseurl}}','{{site.baseurl}}/es');
        } else {
            var url = window.location.protocol + '//' + window.location.host + '/es' + window.location.pathname;
        }
        $('.span1 a.btn-mini.btn-lang, #header .lang').removeClass('nodisplay').attr('href', url);
    }
    
    // Set language cookie whenever user manually switches
    $('.btn-mini.btn-lang').click(function(e) {
        var newLang = $(this).attr('data-lang');
        $.cookie('language', {lang:newLang}, { expires: 90, path: '/' });
    });
});



/* Needs to support x-domain requests */

/*
$(function() {
    //Fallback for IE
    if($.browser.msie) {
        $('.span1 a.btn-mini.btn-lang').removeClass('nodisplay');
    }else{
        // Add lang button if it exist
        if('{{page.lang}}' == 'es'){
            var url = window.location.href.replace('cuidadodesalud.gov','healthcare.gov').replace('/es/','/');
            $.ajax({
                url: url,
                type: 'HEAD',
                success: function(){
                    $('.span1 a.btn-mini.btn-lang').removeClass('nodisplay').attr('href', url);
                },
                error: function(){}
            });
        }

        if('{{page.lang}}' == 'en'){
            if ('{{site.baseurl}}'.length > 0) {
                var url = window.location.href.replace('{{site.baseurl}}','{{site.baseurl}}/es');
            } else {
                var url = window.location.origin + '/es' + window.location.pathname;
            }

            $.ajax({
                url: url + '?ACA=DF342DFe6&redirect=false',
                type: 'HEAD',
                success: function(){
                    $('.span1 a.btn-mini.btn-lang').removeClass('nodisplay').attr('href', url);
                },
                error: function(){}
            });
        }
        
        // Set language cookie whenever user manually switches
        $('.btn-mini.btn-lang').click(function(e) {
            var newLang = $(this).attr('data-lang');
            $.cookie('language', {lang:newLang}, { expires: 90, path: '/' });
        });
    }
});
*/