var app = {};
app.search = [];
app.sidebar = queue(1);
app.sidebarData = [];

app.topics = {
    'en': {
        {% for topic in site.tags.topic %}
        {% if topic.lang == 'en' %}
        '{{topic.url | remove:"/"}}': '{{topic.title | escape}}'{% unless forloop.last %},{% endunless %}
        {% endif %}
        {% endfor %}
    },
    'es': {
        {% for topic in site.tags.topic %}
        {% if topic.lang == 'es' %}
        '{{topic.url | remove:"/es/"}}': '{{topic.title | escape}}'{% unless forloop.last %},{% endunless %}
        {% endif %}
        {% endfor %}
    }
};

app.topContent = {
    {% for lang in site.languages %}{% assign count = 0 %}
    '{{lang.value}}': "{% for post in site.posts %}{% if post.audience and lang.value == post.lang and count < 3 %}<li><a href='{{site.baseurl}}{{post.url}}' class='row-fluid'><div class='span2'></div><div class='span10'>{{ post.title | replace:'"','\"' }}</div></a></li>{% assign count = count | plus: 1 %}{% endif %}{% if count == 3%}{% break %}{% endif %}{% endfor %}"
    {% unless forloop.last %},{% endunless %}
    {% endfor %}
};

app.popularContent = { {% for lang in site.languages %}'{{lang.value}}':[]{% unless forloop.last %},{% endunless %}{% endfor %} };
{% for lang in site.languages %}{% assign count = 0 %}
    {% for post in site.posts %}
    {% unless post.categories contains 'blog' %}
    {% if post.topics and post.lang == lang.value and count < 9 %}
    app.popularContent['{{lang.value}}'].push("<li><a href='{{site.baseurl}}{{post.url}}'>{{post.title | replace: '"', '\"'}}</a></li>");
    {% assign count = count | plus: 1 %}
    {% endif %}
    {% endunless %}
    {% if count == 9 %}{% break %}{% endif %}
    {% endfor %}
{% endfor %}

// checks screen size
var isMobile = {
    any: function() {
        return($(window).width()<=599);
        // nexus7 width is 600 (window.innerWidth)
        // this will not run any reformatting for the phone layout on nexus
    }
};

// checks device
var isMobileDevice = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobileDevice.Android() || isMobileDevice.BlackBerry() || isMobileDevice.iOS() || isMobileDevice.Opera() || isMobileDevice.Windows());
    }
};

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function numValid(number) {
    number.replace(/[^\d]/g,'');
    if(number && (number.length===9||number.length===0)) {
        return number;
    }
}

// Format a number with commas representing the thousandth place
function formalNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Find a word in a string and bold it (for search results)
function boldWord(input, query) {
    return input.replace(new RegExp('(^|.)(' + query + ')(.|$)','ig'), '$1<b>$2</b>$3');
}

{% include js/glossary-tooltip.js %}

$.fn.accessibleDropDown = function () {
    var el = $(this);

    // Setup dropdown menus for IE 6

    $('li', el).mouseover(function() {
        $(this).addClass('hover open');
    }).mouseout(function() {
        $(this).removeClass('hover open');
    });

    // Make dropdown menus keyboard accessible

    $('a', el).focus(function() {
        $(this).closest('.dropdown').addClass('hover open');
    });
};

// Via https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        'use strict';
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

$(function() {
    if ('ontouchstart' in document.documentElement) {
        $('body').removeClass('no-touch');
    };
    if (isMobileDevice.any()) {
        $('.btn-grey.print').remove();
    }
    if (!isMobile.any()) {
        $('form .signup').removeAttr('href').attr('data-toggle','modal').attr('data-target','#subscribe');
        $(".g-plus").attr('data-width','272');
    } else {
        $(".g-plus").attr('data-width','100');
        $(".g-plus").attr('data-height','131');
    }
    if ($.browser.opera) {
        $('#header .btn-lang').show();
    }

    key1 = 'BpbEyi2zDJAVbeyHJ11vzg1GETQHU6yj';
    key2 = 'gs2wYNwY8VvAsYcW1RB12CwovPgx3TWB';

});
