var GV_Server_Address = "";

var GV_link_index_page = '';
var GV_link_userManager = '';
var GV_link_detail = "";
var GV_link_page404 = "";

var GV_auth_google = "";


var run_on_env = 'server'; // local <=> server

if (run_on_env == 'local') {
    GV_Server_Address = "http://localhost:3000";
    GV_link_index_page = '/';
    GV_link_userManager = "/usermanager.html";
    GV_link_detail = "/detail.html";
    GV_link_page404 = "/page404.html";
    GV_auth_google = '/auth/login/googleLocal';
} else {
    // server
    //GV_Server_Address = "https://officeonlinetest.herokuapp.com"; // account heroku : qmloffice.babymommycare@gmail.com
    GV_Server_Address = "http://qmloffice.site:3000";
    GV_link_index_page = '/';
    GV_link_userManager = "/usermanager.html";
    GV_link_detail = "/detail.html";
    GV_link_page404 = "/page404.html";
    GV_auth_google = '/auth/login/googleServer';
}

// sign IN
var GV_CK_SIGNIN_STORE_INFO = "234234asdas2sfsdf33asd4343";
var GV_STORE_SIGN_IN_INFO = {};
var GV_CK_SIGNIN_SUCCESS = "asdfjslfjklsadfjklsdj235492348iofujskdjf";

// TASK_GRP_TASK_DETAIL 
var GV_STORE_TASK_GRP_TASK_DETAIL = {};
var GV_KEY_STORE_TASK_GRP_TASK_DETAIL = "234234aasd24sdas2sfssdf33asssd4343";

var GV_SIGN_IN_1_TIME = "1t";
var GV_SIGN_IN_EXP = "exp";
var GV_AUT_CODE_MASTER = "1";
var GV_CHECK = "";

var _user;

var DBContext = {
    AUTHORITY: "",
    COMMENT: "",
    M_KEEP: "",
    MENU: "",
    TASK: "",
    USER: "",
};

// configure cookie
$.cookie.json = true;

var GV_array_file_video_extention = [
    ".webm",
    ".mkv",
    ".flv",
    ".vob",
    ".ogv",
    ".ogg",
    ".drc",
    ".gif",
    ".gifv",
    ".mng",
    ".avi",
    ".mts",
    ".m2ts",
    ".ts",
    ".mov",
    ".qt",
    ".wmv",
    ".yuv",
    ".rm",
    ".rmvb",
    ".viv",
    ".asf",
    ".amv",
    ".mp4",
    ".m4p",
    ".m4v",
    ".mpg",
    ".mp2",
    ".mpeg",
    ".mpe",
    ".mpv",
    ".mpg",
    ".mpeg",
    ".m2v",
    ".m4v",
    ".svi",
    ".3gp",
    ".3g2",
    ".mxf",
    ".roq",
    ".nsv",
    ".f4v ",
    ".f4p ",
    ".f4a ",
    ".f4b",
];

var GV_array_file_image_extention = [
    ".jpeg",
    ".jpg",
    ".png",
    ".gif",
    ".tiff",
    ".psd",
    ".eps",
    ".ai",
    ".indd",
    ".raw",
];

function GF_ShowToastrSignInSuccess() {
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "md-toast-top-full-width",
        preventDuplicates: false,
        onclick: null,
        showDuration: 300,
        hideDuration: 100,
        timeOut: 1000,
        extendedTimeOut: 100,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };

    toastr.success("Thành Công !");
}

function GF_ShowToastrWrongPass() {
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "md-toast-top-full-width",
        preventDuplicates: false,
        onclick: null,
        showDuration: 300,
        hideDuration: 100,
        timeOut: 1000,
        extendedTimeOut: 100,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };

    toastr.warning("User/pass SAI !");
}

function GF_ShowToastrWarning(text) {
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "md-toast-top-full-width",
        preventDuplicates: false,
        onclick: null,
        showDuration: 300,
        hideDuration: 100,
        timeOut: 1000,
        extendedTimeOut: 100,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };

    toastr.warning(text);
}

function GF_ShowToastrSuccess(text) {
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "md-toast-top-full-width",
        preventDuplicates: false,
        onclick: null,
        showDuration: 300,
        hideDuration: 100,
        timeOut: 1000,
        extendedTimeOut: 100,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };

    toastr.success(text);
}

function GF_HandleSignOut() {
    // $.cookie(GV_CK_SIGNIN_SUCCESS, "", {
    //     expires: 1,
    //     path: '/'
    // });

    // $.cookie(GV_CK_SIGNIN_STORE_INFO, "", {
    //     expires: 1,
    //     path: '/'
    // });
    // $.removeCookie(GV_CK_SIGNIN_SUCCESS, {
    //     path: "/",
    // });

    // $.removeCookie(GV_CK_SIGNIN_STORE_INFO, {
    //     path: "/",
    // });

    $.jStorage.deleteKey(GV_CK_SIGNIN_SUCCESS);
    $.jStorage.deleteKey(GV_CK_SIGNIN_STORE_INFO);
    $.jStorage.deleteKey(GV_KEY_STORE_TASK_GRP_TASK_DETAIL);

    // $("body").load("signIn.html");
    window.open("signIn.html", "_self");
}

function GF_HandleSignInSuccessBackToSignInWhenLoginFail() {
    if ($.jStorage.get(GV_CK_SIGNIN_SUCCESS) == GV_SIGN_IN_1_TIME) {
        console.log("1 lan");
        flgSignInSuccess = true;
    } else {
        if (
            $.jStorage.get(GV_CK_SIGNIN_SUCCESS) == null ||
            $.jStorage.get(GV_CK_SIGNIN_SUCCESS) == undefined
        ) {
            //$("body").load("signIn.html");
            GF_HandleSignOut();
            // window.load("signIn.html");
        } else {
            console.log("N lan");
            flgSignInSuccess = true;
        }
    }

    if (flgSignInSuccess == false) {
        console.log("NNNN lan");
        GF_HandleSignOut();
    }
    if (
        $.jStorage.get(GV_CK_SIGNIN_STORE_INFO) == null ||
        $.jStorage.get(GV_CK_SIGNIN_STORE_INFO) == undefined
    ) {
        console.log("GV_CK_SIGNIN_STORE_INFO lan");
        GF_HandleSignOut();
    }
}

function GF_GetDateFrom_SysDate(formatType) {
    // https://www.w3schools.com/js/js_date_methods.asp

    var date = new Date();

    var dd = date.getDate().toString().padStart(2, "0");
    var MM = (date.getMonth() + 1).toString().padStart(2, "0");
    var yyyy = date.getFullYear().toString().padStart(4, "0");
    var hh = date.getHours().toString().padStart(2, "0");
    var mm = date.getMinutes().toString().padStart(2, "0");
    var se = date.getSeconds().toString().padStart(2, "0");

    var MII = date.getMilliseconds().toString().padStart(3, "0");

    var text = "";

    // 20-08-2020 10:12
    // dd-mm-yyyy hh:mm
    if (formatType == 1) {
        text = dd + "-" + MM + "-" + yyyy + " " + hh + ":" + mm;
    }

    // 20-08-2020 10:12:12
    // dd-mm-yyyy hh:mm:se
    else if (formatType == 2) {
        text = dd + "-" + MM + "-" + yyyy + " " + hh + ":" + mm + ":" + se;
    } else if (formatType == 3) { } else if (formatType == 4) { }

    return text;
}

// input yyyyMMddHHmmssMI
function GF_Ex_ParseTime(input, format) {
    var date = input;
    var y = date.substring(0, 4);
    var mon = date.substring(4, 6);
    var d = date.substring(6, 8);

    var h = "";
    var min = "";
    var milisecond = "";

    var text = "";
    if (date.length > 8) {
        var h = date.substring(8, 10);
        var min = date.substring(10, 12);
        var milisecond = date.substring(12, 14);

        if (format == "yyyy-MM-dd hh:mm:mili") {
            text = y + "-" + mon + "-" + d + " " + h + ":" + min + ":" + milisecond;
        } else if (format == "dd-MM-yyyy hh:mm:mili") {
            text = d + "-" + mon + "-" + y + " " + h + ":" + min + ":" + milisecond;
        }
    }

    if (format == "yyyyMMdd") {
        text = y.padStart(4, "0") + mon.padStart(2, "0") + d.padStart(2, "0");
    } else if (
        format == "yyyy-MM-dd" ||
        format == "yyyy/MM/dd" ||
        format == "yyyy.MM.dd"
    ) {
        text =
            y.padStart(4, "0") +
            "-" +
            mon.padStart(2, "0") +
            "-" +
            d.padStart(2, "0");

        if (format == "yyyy/MM/dd") {
            text = text.replace("-", "/");
        } else if (format == "yyyy.MM.dd") {
            text = text.replace("-", ".");
        } else if (format == "yyyy-MM-dd") {
            text = text;
        }
    }

    if (text != "") {
        return text;
    }
    return "";
}

function GenUserID() {
    var dtNow = new Date();
    var dd = dtNow.getDate().toString().padStart(2, "0");
    var MM = (dtNow.getMonth() + 1).toString().padStart(2, "0");
    var yyyy = dtNow.getFullYear().toString().padStart(4, "0");
    var hh = dtNow.getHours().toString().padStart(2, "0");
    var mm = dtNow.getMinutes().toString().padStart(2, "0");
    var sc = dtNow.getSeconds().toString().padStart(2, "0");
    var ms = dtNow.getMilliseconds().toString().padStart(4, "0");
    return (yyyy + MM + dd + hh + mm + sc + ms).toString();
}

function GetSysDate() {
    var dtNow = new Date();
    var dd = dtNow.getDate().toString().padStart(2, "0");
    var MM = (dtNow.getMonth() + 1).toString().padStart(2, "0");
    var yyyy = dtNow.getFullYear().toString().padStart(4, "0");

    return (yyyy + MM + dd).toString();
}

function GetSysTime() {
    var dtNow = new Date();
    var hh = dtNow.getHours().toString().padStart(2, "0");
    var mm = dtNow.getMinutes().toString().padStart(2, "0");
    var sc = dtNow.getSeconds().toString().padStart(2, "0");
    return (hh + mm + sc).toString();
}

function GF_SetjStorage(keyStore, objectStored) {
    var timeDate = 1000 * 60 * 60 * 3; // 3h
    $.jStorage.deleteKey(keyStore);
    $.jStorage.set(keyStore, objectStored);
    $.jStorage.setTTL(keyStore, timeDate);
}

function GF_GetLinkImgForIconFile(fileName) {
    var file_extention = fileName.split(".").pop();
    file_extention = file_extention.toLowerCase();
    var iconLinkType = "";

    if (
        iconLinkType == "" &&
        GV_array_file_video_extention.includes("." + file_extention)
    ) {
        iconLinkType = "img/icon/video-icon_1.png";
    }
    if (
        iconLinkType == "" &&
        GV_array_file_image_extention.includes("." + file_extention)
    ) {
        iconLinkType = "img/icon/video-icon_1.png";
    }

    if (iconLinkType == "") {
        if (file_extention == "doc" || file_extention == "docx") {
            iconLinkType = "img/icon/20x20-.docx_icon.svg.png";
        } else if (file_extention == "ppt" || file_extention == "pptx") {
            iconLinkType = "img/icon/pptx-icon.png";
        } else if (
            file_extention == "xls" ||
            file_extention == "xlsx" ||
            file_extention == "csv" ||
            file_extention == "xlsm"
        ) {
            iconLinkType = "img/icon/Excel-icon.png";
        } else if (file_extention == "pdf") {
            iconLinkType = "img/icon/PDF-icon.png";
        } else if (
            file_extention == "zip" ||
            file_extention == "rar" ||
            file_extention == "7z"
        ) {
            iconLinkType = "img/icon/Folder-RAR-icon.png";
        } else if (file_extention == "txt") {
            iconLinkType = "img/icon/Document-txt-icon.png";
        } else {
            //default
            iconLinkType = "img/icon/file-icon.png";
        }
    }

    return iconLinkType;
}

$.fn.GF_focusEndDivEditable = function () {
    $(this).focus();
    var tmp = $('<span />').appendTo($(this)),
        node = tmp.get(0),
        range = null,
        sel = null;

    if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        range = document.createRange();
        range.selectNode(node);
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    tmp.remove();
    return this;
}


function GF_CheckAccGoogleAvaibleNow(accesstoken1) {

    var linkEx = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accesstoken1}`;
    var data1 = { 'id': '1' };
    axios
        .get(linkEx, {
            params: {
                data1,
            },
        })
        .then(function (response) {
            if (response.errno != undefined) {
                // ERR
                location.href = GV_Server_Address + GV_auth_google;
            } else {
                // SUCCESS
                if (response.data.expires_in <= 30) {
                    location.href = GV_Server_Address + GV_auth_google;
                } else {

                }
            } // }// end else SUCCESS
        })
        .catch(function (error) {
            location.href = GV_Server_Address + GV_auth_google;
        });
}





function GF_GetTextSizeFile_By_SizeFileByte(sizeByte) {

    var sizeText = parseFloat(sizeByte) / 1024 / 1024;
    if (sizeText < 1) {
        sizeText = sizeText * 1024;
        sizeText = (Math.round((sizeText + Number.EPSILON) * 100) / 100).toString() + "KB";
    } else {
        sizeText = (Math.round((sizeText + Number.EPSILON) * 100) / 100).toString() + "MB";
    }
    return sizeText;
}