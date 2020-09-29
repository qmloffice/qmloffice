$(document).ready(function() {


    // PAGE404
    var GV_KEY_STORE_PARAM_PAGE_404 = "996asdsfad6asdasd67sss676adsas";
    var GV_PARAM_PAGE_404_INFO = {};


    if (
        $.jStorage.get(GV_KEY_STORE_PARAM_PAGE_404) != null &&
        $.jStorage.get(GV_KEY_STORE_PARAM_PAGE_404) != undefined
    ) {
        GV_PARAM_PAGE_404_INFO = $.jStorage.get(
            GV_KEY_STORE_PARAM_PAGE_404
        );

        $('#div_textERR').html(GV_PARAM_PAGE_404_INFO.errCode)

    }









})