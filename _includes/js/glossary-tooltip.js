$(function() {
    $('a[title="glossary"]').each(function() {
        var $el = $(this),
            term = $el.attr('href');
            
        $.getJSON(term + '.json', function(data) {
            $el.attr('data-toggle', 'popover');
            $el.attr('data-original-title', data.title);
            $el.attr('data-content', $(data.content).text().replace("$('#header .btn-lang').remove();", ''));
        });
    });
    if (!isMobile.any()) {
        $('a[title="glossary"]')
    		  	.addClass('glossary-term')
            .popover({
              	trigger: 'hover focus',
              	container: 'body'
          	});
    }
});
