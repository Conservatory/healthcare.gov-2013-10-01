/*
  Route: #part=1/state=nj/question=title
*/

app.router = {
    'routes': (window.location.hash !== '') ? _(window.location.hash.substr(1).split('/'))
        .reduce(function(memo, value) {
          memo[value.split('=')[0]] = value.split('=')[1];
          return memo;
        }, {}) : {},

    'get': function(route, value) {
        switch (route) {
            case 'part':
                $('a#' + value).trigger('click',true);
                break;
            case 'state':
                $('select.state-selector').val(value).trigger('change');
                break;
            case 'question':
                $('select.question-selector').val(value).trigger('change');
                break;
        }
    },

    'set': function(route, value) {
        app.router.routes[route] = value;

        // To avoid questions bleeding between parts, remove question route
        if (route === 'part') delete app.router.routes.question;
        window.location.hash = '#' + _(app.router.routes)
            .map(function(value, route) { return route + '=' + value; })
            .join('/');
    }
};

$(window).load(function(){
    // Start routing
    _(app.router.routes).each(function(value, route) { app.router.get(route, value); });

    // show state based on cookie
    if (!app.router.routes.state && app.quickAnswers && app.quickAnswers.state) {
        var cookieState = app.quickAnswers.state.toLowerCase().replace(/ /g, '-');
        $('select.state-selector').val(cookieState).trigger('change');
    }
});
