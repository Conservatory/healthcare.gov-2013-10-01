function showRemaining() {
    var _second = 1000,
        _minute = _second * 60,
        _hour = _minute * 60,
        _day = _hour * 24;
        
    var end = new Date('10/1/2013 12:00 AM'),
        now = new Date(),
        distance = end - now;
        
    if (distance < 0) {
        $('.countdown').html('0');
    } else {
        var days = Math.ceil(distance / _day);
        $('.countdown').html(days);
    }
}

showRemaining();