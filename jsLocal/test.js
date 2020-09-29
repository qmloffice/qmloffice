var resize = false;
$('#textarea').hover(function (e) {
    e.preventDefault();
    resize = false;
});
$('#grippie').mousemove(function (e) {
    if (resize == true) {
        $('#textarea').height(e.pageY - 18);
    } else {
        $('#textarea').height(e.pageY + 5);
    }
});
$('#grippie').mousedown(function (e) {
    resize = false;
    resize = true;
});
$(window).mouseup(function (e) {
    resize = false;
});