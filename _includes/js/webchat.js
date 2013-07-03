var chatWindow = null;
var windowFeatures = "width=465,height=452,menubar=0,location=0,resizable=0,scrollbars=0,status=0";

function windowToggle(){
    if (!chatWindow) {
      $('#webchat').removeClass('nodisplay');
    } else {
      $('#webchat').addClass('nodisplay');
    }
}

function startChat(el){
    $(el).click(function(e){
        e.preventDefault();
        {% if page.lang == 'es' %}
        chatWindow = window.open('{{site.baseurl}}/es/chat','WebChat',windowFeatures);
        {% else %}
        chatWindow = window.open('{{site.baseurl}}/chat','WebChat',windowFeatures);
        {% endif %}
        if (!isMobileDevice.any()){windowToggle()}
    })
}
