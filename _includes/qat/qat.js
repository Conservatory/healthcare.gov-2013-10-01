{% assign qa = site.tags['quick-answers'][0] %}

var lang = '';
{% if page.lang != 'en' %}
lang = '{{page.lang}}/';
{% endif %}

$(function() {
    var wizardFilters = app.quickAnswers || {},
        path = '{{site.baseurl}}/' + lang + 'quick-answers/#-/-/-/-/-/-/-/-/-/-',
        stepID,
        pathPrev,
        screenerStep = parseInt($('#qa-screener').attr('data-step')),
        showScreener = true,
        completed = $.cookie('qa-complete') || false;

    var wizardMap = {
        {% for item in qa %}
        {% if item[1].options %}
        '{{item[0]}}': {
            {% for opt in item[1].options %}'{{opt.value}}':
                [{% for l in opt.returns %}'{{l.link}}'{% unless forloop.last %},{% endunless %}{% endfor %}]{% unless forloop.last %},{% endunless %}
            {% endfor %}
        }{% unless forloop.last %},{% endunless %}
        {% endif %}
        {% endfor %}
    };
    
    var blurbs = [{% for blurb in site.tags['qat-blurb'] %}'{{blurb['link-url']}}'{% unless forloop.last %},{% endunless %}{% endfor %}];
    
    var audienceSteps = {
        family: $('.qa-step[data-audience~="family"]').length,
        shop: $('.qa-step[data-audience~="shop"]').length,
        business: $('.qa-step[data-audience~="business"]').length
    };
    
    if (!wizardFilters.householdSize) wizardFilters.householdSize = 1;
    formFill(wizardFilters);
    
    var post = Backbone.Model.extend();
    
    var allPosts = Backbone.Collection.extend({
    
        initialize: function() {
            // Create a clone of the entire collection
            this.all = this.models;
        },
        comparator: function(model) {
            return  model.get('title');
        } 
    });
    
    var wizardView = Backbone.View.extend({
        events: {
            'change select.state': 'selectValue',
            'click input[type=radio]': 'selectValue',
            'click input[type=checkbox]': 'selectValue',
            'click .changeHouseholdSize': 'addOrSubtractHouseholdSize'
        },
        
        initialize: function (options) {
            var state = wizardFilters.state || 'Alabama';
            this.calculateFPL(1, state);
        },
        
        selectValue: function(e,trigger) {
            if (!trigger) {
                var option = $(e.target).val(),
                category = $(e.target).attr('name');
                    
                if (category === 'audience') resetQAT();
                
                if (category === 'age') {
                    if (completed && option != '65plus') {
                        $('#qa-pager a.update').hide();
                        $('#qa-pager a.next').show();
                    }
                }
                
                if (category === 'screener') {
                    wizardFilters.householdSize = $('#screenerHouseholdSize').val();
                }
                
                if (category === 'state') {
                    if (option === 'Hawaii') {
                        $('#employees-under50').next().html('<span></span> Under 100');
                        $('#employees-50plus').next().html('<span></span> 100+');
                    } else {
                         $('#employees-under50').next().html('<span></span> Under 50');
                         $('#employees-50plus').next().html('<span></span> 50+');
                    }
                }
                    
                if ($(e.target).attr('type') === 'checkbox') {
                    if (!wizardFilters[category] || wizardFilters[category][0] === '-') {
                        wizardFilters[category] = [];
                    }
                    
                    var idx = wizardFilters[category].indexOf(option);
                    
                    if (idx > -1) {
                        wizardFilters[category].splice(idx,1);
                    } else {
                        wizardFilters[category].push(option);
                    }
                } else {
                    wizardFilters[category] = option;
                }
                
                this.updateResults(wizardFilters);
            }
        },
        
        addOrSubtractHouseholdSize: function(e) {
            e.preventDefault();
        		if (!isNaN($('#screenerHouseholdSize').val())) {
          			var target = e.target.parentNode.id,
          				  currentSize = parseInt($('#screenerHouseholdSize').val(), 10);
          			if (target === 'screenerHouseholdDecrease' && currentSize > 0) {
          				  $('#screenerHouseholdSize').val(currentSize - 1);
          			} else if (target === 'screenerHouseholdIncrease') {
          				  $('#screenerHouseholdSize').val(currentSize + 1);
          			}
        		}
        		var option = $('#screenerHouseholdSize').val();
        		wizardFilters.householdSize = option;
        		this.updateResults(wizardFilters);
        		var state = wizardFilters.state || 'Alabama';
        		this.calculateFPL(option, state);
      	},
      	
        calculateFPL: function(members, fplState) {
            var fpl = '';
            
            // FPL for Alaska
            if (fplState === 'Alaska'){
                fpl = (((419*(members)+777)*4.2)*12);
            }
            // FPL for Hawaii
            else if (fplState === 'Hawaii'){
                fpl = (((385*(members)+718)*4.2)*12);
            }
            // FPL for all other states
            else {
                fpl = (((335*(members)+623)*4.2)*12);
            }
            fpl = Math.round(fpl);
            fpl = formalNumber(fpl);
            $('#fplText').text('$' + fpl);
        },
        
        updateResults: function(filter) {
            updatePath(filter);
            updateShowScreener(filter);
            updateCookie(filter);
            
            var nextStep = parseInt(stepID)+1;
        
            if ((nextStep === screenerStep && !showScreener)
                || (stepID >= audienceSteps[filter.audience] + 1)
                || filter.age === '65plus')
            {
                var pathNext = path;
            } else {
                var pathNext = '{{site.baseurl}}/' + lang + 'quick-answers/#' + filter.audience + '-' + (parseInt(stepID)+1);
            }
            
            $('#qa-pager a.update').attr('href',path);
            $('#qa-pager a.next').attr('href',pathNext);
            if (formComplete()) $('#qa-pager .next').removeClass('disabled').addClass('btn-green');
        }
    });
    
    var resultsView = Backbone.View.extend({
    
        events: {
            'click a.qa-reset': 'reset'
        },
        
        reset: function() {
            resetQAT(true);
            Backbone.history.navigate('#step-1');
        },
    
        resultsTemplate: _.template($('#qa-topinfo-template').html()),
        menuTemplate: _.template($('#qa-menu-template').html()),
        
        initialize: function (options) {
            this.render(options);
            this.collection.on('change',this.render,this);
        },
        
        render: function (options) {
            var that = this,
                filters = options.filters,
                collection = that.collection.models,
                addCheck = false,
                addVet = false;
                
            $('#qa-pager a.pagers').hide();
            $('#qa-pager a.edit').show();
            
            // Top Information For You
            collection = _(collection).filter(function(p) {
                var url = p.get('url') || 'null';
                url = url.replace('/','');
                
                // If answered age:65+, return only that group of results
                if (filters.audience === 'family' && filters.age === '65plus') {
                    return updateHash('age','65plus');
                }
                // If answered employees:none, return only that group of results
                if (filters.audience === 'business' && filters.employees === 'none') {
                    return updateHash('employees','none') || (url === app.wizardData.state.returns);
                }
                // Always return state link
                if (url === app.wizardData.state.returns && filters.employees != '50plus') return true;
                      
                return _(filters).any(function(v,k) {
                    if (k != 'state' && k != 'householdSize' && v != '-') { //state & householdSize have no effect on results, 0 = no answer
                        
                        if (k === 'employees' && v === '50plus') {
                            if (url === 'what-is-the-marketplace-in-my-state' || 
                                url === 'how-do-i-choose-insurance-thats-right-for-my-business' ||
                                url === 'how-can-i-get-ready-for-shop') {
                                return false;
                            }
                        }
                        if (k === 'additional') {
                            return _(v).any(function(val,i) {
                                if (val === 'pregnancy' || val === 'dependent'){
                                    addCheck = true;
                                }
                                if (val === 'veteran'){
                                    addVet = true;
                                } 
                                // Check if link already shown in Options You Might Be Eligible For
                                if (filters.screener != '-' && (blurbs.indexOf(url) > -1)) {
                                    return false;
                                } else {
                                    return updateHash(k, val);
                                }
                            });
                        } else {
                            // Check if link already shown in Options You Might Be Eligible For
                            if (filters.screener != '-' && (blurbs.indexOf(url) > -1)) {
                                return false;
                            } else {
                                return updateHash(k, v);
                            }
                            return updateHash(k, v);
                        }
                    } else {
                        return false;
                    }
                });
                function updateHash(k, v) {
                    return _(wizardMap[k][v]).any(function(val, i) {
                        var urlArray = val.split('#');
                        p.set('hash', urlArray[1]);
                        urlClean =  urlArray[0].replace('/','');
                        return (urlClean === url);
                    });
                }
            }, this);
           

            // Options You Might Be Eligible For
            if ((filters.audience === 'family' && filters.screener === '-')
                || (filters.audience === 'business' && filters.employees != 'none'))
            { if (addVet) {
                $('#qa-options').show();
                $('#qa-options [data-value]').hide();
                $('#qa-options [data-value~="veterans"]').show();
                } else {
                    $('#qa-options').hide();
                }
            } else {
                $('#qa-options').show();
                $('#qa-options [data-value]').hide();
                if (addVet) {
                    $('#qa-options [data-value~="veterans"]').show();
                } 
                if (filters.employees === 'none') {
                    $('#qa-options [data-value~="marketplace"]').show();
                } else {
                    $('#qa-options [data-value~="' + filters.screener + '"]').show();
                    if (!addCheck) {
                        $('#qa-options [data-value~="chip"]').hide();
                    }
                }
            }
            $('#qa-menu').empty().html(this.menuTemplate(filters));
            $('#qa-menu li[data-audience~="' + filters.audience + '"]').show();
            
    
            if (collection.length) {
                $('#qa-info .article').empty();
                _(collection).each(function(model) {
                    $('#qa-info .article').append(that.resultsTemplate({
                        title: model.get('{% if page.lang != "en" %}{{page.lang}}-{% endif %}title'),
                        url: ('{{page.lang}}' === 'es') ? '/es' + model.get('url') : model.get('url'),
                        hash: model.get('hash'),
                        bite: model.get('{% if page.lang != "en" %}{{page.lang}}-{% endif %}bite')
                    }));
                });
                $('#qa-info').show();
            } else {
                $('#qa-info').hide();
            }
            
            var checklist = this.whichChecklist(filters);
            
            if (checklist != '') {
                $('#checklistLink').attr('href','{{site.baseurl}}/downloads/{% if page.lang == "es" %}es/{% endif %}MarketplaceApp_Checklist' + checklist + '.pdf');
                $('.qa-checklist').show();
                $('.qa-signup').removeClass('no-checklist');
            }
        },
        
        whichChecklist: function (filters) {
            var checklist = '',
                status = filters.status;
            
            if (filters.age === '65plus') return '';
            
            if (filters.audience === 'business') {
                checklist = '12';
            } else if (filters.audience === 'shop') {
                checklist = '11';
            } else {
                if (parseInt(filters.householdSize) > 1) {
                    if (status === 'employer-explore' || status === 'employer-leave') checklist = '3';
                    if (status === 'self-eligible') checklist = '1';
                    if (status === 'self-ineligible') checklist = '2';
                    if (status === 'no-eligible') checklist = '4';
                    if (status === 'no-ineligible') checklist = '5';
                } else if (parseInt(filters.householdSize) === 1 || filters.householdSize === '-') {
                    if (status === 'employer-explore' || status === 'employer-leave') checklist = '8';
                    if (status === 'self-eligible') checklist = '6';
                    if (status === 'self-ineligible') checklist = '7';
                    if (status === 'no-eligible') checklist = '9';
                    if (status === 'no-ineligible') checklist = '10';
                }
            }
            
            return checklist;
        }
       
    });
    
    var wizardRouter = Backbone.Router.extend({
        routes: {
            ':step': 'steps',
            ':audience/:state/:age/:gender/:status/:condition/:additional/:householdSize/:screener/:employees/:currently': 'results',
            '*default': 'main'
        },
        
        initialize: function() {
            this.app = new wizardView({
                el: '#wizard'
            });
        },
        
        steps: function(step) {
            $('#wizard-results').hide();
            $('#wizard').show();
            $('#content-start').focus();
            
            updateLangBtn();
            
            var stepType = step.split('-')[0];
            if (!wizardFilters.audience) {
                var audiencePath = stepType;
                wizardFilters.audience = audiencePath;
            } else {
                var audiencePath = wizardFilters.audience;
            }
            
            updatePath(wizardFilters);
            stepID = step.split('-')[1];
            
            $('#wizard .qa-step').removeClass('active').hide();
            $('#wizard .qa-step[data-audience~="' + stepType + '"][data-step="' + stepID + '"]').addClass('active').show();
            
            if (formComplete()) {
                if (stepID < audienceSteps[audiencePath] + 1) {
                    var pathNext = '{{site.baseurl}}/' + lang + 'quick-answers/#' + audiencePath + '-' + (parseInt(stepID)+1);
                } else {
                    var pathNext = path;
                }
                $('#qa-pager .next').attr('href',pathNext);
                $('#qa-pager .next').removeClass('disabled').addClass('btn-green');
            } else {
                $('#qa-pager .next').removeClass('btn-green').addClass('disabled');
            }
            
            if (stepType != 'step') {
                if (stepID === '2') {
                    pathPrev = 'step-1';
                } else {
                    pathPrev = audiencePath + '-' + (parseInt(stepID)-1);
                }
                
                $('#qa-pager .prev').attr('href','{{site.baseurl}}/' + lang + 'quick-answers/#' + pathPrev);
                if (!completed) $('#qa-pager .prev').show();
            } else {
                $('#qa-pager .prev').hide();
            }
        },
    
        results: function(audience, state, age, gender, status, condition, additional, householdSize, screener, employees, currently) {
            $('#wizard').hide();
            $('#wizard-results').show();
            $('#qa-pager a.cancel,#qa-pager a.update').attr('href',window.location.href);
            
            $.cookie('qa-complete', {path:window.location.href}, { expires: 30, path: '/' });
            completed = true;
            
            var that = this,
                filters = {
                    audience: audience,
                    state: state,
                    age: age,
                    gender: gender,
                    status: status,
                    condition: condition,
                    additional: additional.split('&'),
                    householdSize: householdSize,
                    screener: screener,
                    employees: employees,
                    currently: currently
                };
            
            this.data = new allPosts();
                    
            this.data.url = '{{site.baseurl}}/api/index.json';
            
            this.data.fetch({
                success: function () {
                    this.results = new resultsView({
                        el: '#wizard-results',
                        collection: that.data,
                        filters: filters
                    });
                }
            });
            
            app.qaFilters = filters;
            updateCookie(filters);
            updateLangBtn();
        },
        
        main: function() {
            this.navigate('#step-1', {trigger: true});
        }
    });
    
    function updatePath(filter) {
        var adds = filter.additional;
        if (adds) adds = adds.join('&');
        
        var parts = [];
            parts.push(filter.audience || '-');
            parts.push(filter.state || '-');
            parts.push(filter.age || '-');
            parts.push(filter.gender || '-');
            parts.push(filter.status || '-');
            parts.push(filter.condition || '-');
            parts.push(adds || '-');
            parts.push(filter.householdSize || '-');
            parts.push(filter.screener || '-');
            parts.push(filter.employees || '-');
            parts.push(filter.currently || '-');
            
        path = '{{site.baseurl}}/' + lang + 'quick-answers/#' + parts.join('/');
    }
    
    function updateShowScreener(filters) {
        if (filters.age === '65plus' ||
            filters.status === 'employer-stay')
        {
            showScreener = false;
        }
    }
    
    function updateCookie(filters) {
        app.quickAnswers = filters;
        $.cookie('quickAnswers', app.quickAnswers, { expires: 30, path: '/' });
    }
    
    function formComplete() {
        var count = 0;
        
        if ($('.qa-step.active [name="additional"]').length) count++;
        if ($('.qa-step.active #addPeople').length) count++;
        if ($('.qa-step.active select.state').val() !== $('.qa-step.active select.state option:disabled').val()) count++;
        
        _(app.quickAnswers).each(function(v,k) {
            if (($('.qa-step.active [name="' + k + '"]').length && v != 'step' && k != 'householdSize' && k != 'additional')) {
                count++;
            }
        });
        
        if (count >= $('.qa-step.active legend').length) {
            return true;
        } else {
            return false;
        }
    }
    
    function formFill(filters) {
        _(filters).each(function(v,k) {
            if (k === 'state') {
                $('select.state').val(v);
                if (v === 'Hawaii') {
                    $('#employees-under50').next().html('<span></span> Under 100');
                    $('#employees-50plus').next().html('<span></span> 100+');
                }
            } else {
                var type = $('#' + k + '-' + v).attr('type');
                
                if (type === 'radio') {
                    $('#' + k + '-' + v).attr('checked', 'checked');
                } else if (k === 'householdSize') {
                    $('#screenerHouseholdSize').val(v);
                } else if (type === 'checkbox') {
                    _(v).each(function(val,i) {
                        $('#' + k + '-' + val).trigger('click',true);
                    });
                }
            }
        });
    }
    
    function resetQAT(full) {
        $.removeCookie('quickAnswers', { path: '/' });
        $.removeCookie('qa-complete', { path: '/' });
        completed = false;
        app.quickAnswers = {};
        wizardFilters = {};
        $('#qa-pager a.next').show();
        
        if (full) {
            $('input').removeAttr('checked');
            $('#qa-pager a.edit').hide();
        } else {
            $('input[name!="audience"]').removeAttr('checked');
            $('#qa-pager a.update').hide();
        }
        $('select.state').val('{{qa.state.placeholder.[page.lang]}}');
        $('.state.dropdown-menu a.state').removeClass('active');
        $('#screenerHouseholdSize').val(1);
    }
    
    function updateLangBtn() {
        var pathname = window.location.pathname,
            langSwitch = $('.btn-lang').attr('data-lang'),
            langUrl = '';
            
        if (langSwitch != 'en') {
            langUrl = langSwitch + '/';
        }
        
        $('.btn-lang').attr('href','{{site.baseurl}}/' + langUrl + 'quick-answers/' + window.location.hash); 
    }
    
    var wizard = new wizardRouter();
    Backbone.history.start();
});

function label(filter, value) {
    if (app.quickAnswers.audience === 'business' && app.quickAnswers.state === 'Hawaii' && filter === 'employees') {
        if (value === 'under50') return 'Under 100';
        if (value === '50plus') return '100+';
    } else {
        try {
          return _(app.wizardData[filter].options).findWhere({value: value})['{{page.lang}}'];
    
        } catch(e) {
          return value;
        }
    }
}