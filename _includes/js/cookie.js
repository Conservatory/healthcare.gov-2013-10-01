var userHistory = [],
    page = {
        url: '{{page.url}}',
        data: {
            tags: [{% for tag in page.tags %}'{{tag | replace: "'", "\'"}}'{% unless forloop.last %},{% endunless %}{% endfor %}],
            topics: [{% for topic in page.topics %}'{{topic | replace: "'", "\'"}}'{% unless forloop.last %},{% endunless %}{% endfor %}],
            audience: [{% for audience in page.audience %}'{{audience | replace: "'", "\'"}}'{% unless forloop.last %},{% endunless %}{% endfor %}],
            status: [{% for status in page.['insurance-status'] %}'{{status | replace: "'", "\'"}}'{% unless forloop.last %},{% endunless %}{% endfor %}],
            state: [{% for state in page.state %}'{{state | replace: "'", "\'"}}'{% unless forloop.last %},{% endunless %}{% endfor %}],
            condition: [{% for condition in page.condition %}'{{condition | replace: "'", "\'"}}'{% unless forloop.last %},{% endunless %}{% endfor %}]
        }
    },
    repeatVisit = false;

if ($.cookie('history') !== undefined) {
    userHistory = JSON.parse($.cookie('history'));

    $.each(userHistory, function(i,h) {
        if ('{{page.url}}' === h.url ||
            '{{page.url}}' === '/es' + h.url ||
            '/es{{page.url}}' === h.url)
        {
            repeatVisit = true;
        }
    });
}

if (!repeatVisit) {
    userHistory.unshift(page);
}
if (userHistory.length > 5) {
    userHistory.pop();
}
app.history = userHistory;

$.cookie.json = true;
$.cookie('history', userHistory, { expires: 30, path: '/' });

if ($.cookie('quickAnswers') !== undefined) {
    app.quickAnswers = $.cookie('quickAnswers');
}
