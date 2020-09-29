$(document).ready(function () {



    ////////////////////////////////////////


    $("#btnSignIn").click(function (e) {


        var user_id_user = $('#SignIn_txt_userid').val().trim();
        var user_password = $('#SignIn_txt_password').val().trim();
        $('#btnSignIn').prop('disabled', true);


        if (user_id_user.length < 6 || user_password.length < 6) {
            showToastrWrongPass();
            $('#SignIn_txt_userid').focus();
            return;
        }

        var dataUser = {
            userid: user_id_user,
            password: user_password
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(dataUser),
            contentType: 'application/json',
            url: GV_Server_Address + "/signin",
            success: function (data) {
                if (data.errno != undefined) {
                    GF_ShowToastrWrongPass();
                    $('#btnSignIn').prop('disabled', false);
                } else {
                    if (data.data.userid != "") {

                        if ($('#SignIn_txt_RememberMe').is(":checked")) {
                            // $.cookie(GV_CK_SIGNIN_SUCCESS, data.data.id, {
                            //     expires: 15,
                            //     path: '/'
                            // });

                            var timeDate = 1000 * 60 * 60 * 24 * 15; // 15 date
                            $.jStorage.set(GV_CK_SIGNIN_SUCCESS, data.data.id);
                            $.jStorage.setTTL(GV_CK_SIGNIN_SUCCESS, timeDate);

                        } else {

                            // var now = new Date();
                            // var time = now.getTime();
                            // time += 3600 * 1000; // 1 hour from time it is created
                            // $.cookie(GV_CK_SIGNIN_SUCCESS, GV_SIGN_IN_1_TIME, {
                            //     expires: time,
                            //     path: '/'
                            // });

                            var timeDate = 1000 * 60 * 60; // 1h
                            $.jStorage.set(GV_CK_SIGNIN_SUCCESS, GV_SIGN_IN_1_TIME);
                            $.jStorage.setTTL(GV_CK_SIGNIN_SUCCESS, timeDate);

                        }
                        data.data.password = "";
                        GV_STORE_SIGN_IN_INFO = data.data;

                        // $.cookie(GV_CK_SIGNIN_STORE_INFO, GV_STORE_SIGN_IN_INFO, {
                        //     expires: 15,
                        //     path: '/'
                        // });

                        var timeDate = 1000 * 60 * 60 * 24 * 15; // 15 date
                        $.jStorage.set(GV_CK_SIGNIN_STORE_INFO, GV_STORE_SIGN_IN_INFO);
                        $.jStorage.setTTL(GV_CK_SIGNIN_STORE_INFO, timeDate);

                        GF_ShowToastrSignInSuccess();
                        $('#btnSignIn').prop('disabled', false);
                        // $("body").load("index.html");

                        $.jStorage.deleteKey(GV_KEY_STORE_TASK_GRP_TASK_DETAIL);
                        window.open('index.html', '_self');
                    }
                }
            },
            error: function (err) {
                GF_ShowToastrWrongPass();
                $('#btnSignIn').prop('disabled', false);
            }
        });
    });


    $("#btn_register_user").click(function (e) {

        e.preventDefault();

        var flag = true;
        var focusControl;

        var user_id_user = $('#user_id_user').val().trim();
        var user_fname = $('#user_fname').val().trim();
        var user_lname = $('#user_lname').val().trim();
        var user_address = $('#user_address').val().trim();
        var user_phone1 = $('#user_phone1').val().trim();
        var user_phone2 = $('#user_phone2').val().trim();
        var user_email = $('#user_email').val().trim();

        // var user_select_author_name = $('#user_select_author').find(":selected").text();
        // var user_select_author_value = $('#user_select_author').find(":selected").attr('value');
        var user_select_author_value = "";

        var user_password = $('#user_password').val();
        var user_passwordconfirm = $('#user_passwordconfirm').val();

        if (user_id_user.length < 4 || user_id_user == '' || user_id_user == undefined) {
            focusControl = $('#user_id_user');
            flag = false;
        }

        if (flag && (user_fname.length < 4 || user_fname == '' || user_fname == undefined)) {
            focusControl = $('#user_fname');
            flag = false;
        }

        if (flag && (user_address.length < 4 || user_address == '' || user_address == undefined)) {
            focusControl = $('#user_address');
            flag = false;
        }

        if (flag && (user_phone1.length < 4 || user_phone1 == '' || user_phone1 == undefined)) {
            focusControl = $('#user_phone1');
            flag = false;
        }

        if (flag && ($('#user_email').attr('class') == 'validate invalid')) {
            flag = false;
            focusControl = $('#user_email');
        }

        if (flag && (user_password.length == '' || user_password.length < 6)) {
            flag = false;
            focusControl = $('#user_password');
        }

        if (flag && (user_password != user_passwordconfirm || user_passwordconfirm.length == '' || user_passwordconfirm.length < 6)) {
            flag = false;
            focusControl = $('#user_passwordconfirm');
        }


        if (flag == false) {
            focusControl.focus();
        } else {

            $('#user_fname').focus();
            $("#user_fname").prop("readonly", true);

            var dataNodeTaskRoot = `[{
                "id": "ajson2",
                "text": "ALL",
                "icon": "img/icon/folder_open.png",
                "li_attr": {
                    "id": "ajson2"
                },
                "a_attr": {
                    "href": "#",
                    "id": "ajson2_anchor"
                },
                "state": {
                    "loaded": true,
                    "opened": true,
                    "selected": true,
                    "disabled": false
                },
                "data": {},
                "parent": "#",
                "type": "folder-open"
            }]`;

            var d = GetSysDate();
            var t = GetSysTime();
            var id = GenUserID();
            var dataUser = {
                id: id,
                id_user: user_id_user,
                au_id: user_select_author_value,
                firstname: user_fname,
                lastname: user_lname,
                address: user_address,
                phone1: user_phone1,
                phone2: user_phone2,
                email: user_email,
                password: user_password,
                dataNodeTaskRoot: dataNodeTaskRoot.toString(),
                updatedate: d,
                updatetime: t,
                create_datetime: d + t,
            };

            $.ajax({
                type: 'POST',
                data: JSON.stringify(dataUser),
                contentType: 'application/json',
                url: GV_Server_Address + "/insertuser",
                success: function (data) {

                    if (data.errno != undefined) {
                        console.log('dang ki that bai');

                        $("#user_fname").prop("readonly", false);

                        // focus to input error
                        if (data.errno.includes('USER NAME')) {
                            GF_ShowToastrWarning('USER NAME đã được đăng kí !!');
                            $('#user_id_user').focus();
                        } else if (data.errno.includes('PHONE')) {
                            GF_ShowToastrWarning('PHONE đã được đăng kí !!');
                            $('#user_phone1').focus();
                        } else if (data.errno.includes('EMAIL')) {
                            GF_ShowToastrWarning('EMAIL đã được đăng kí !!');
                            $('#user_email').focus();
                        }

                    } else {
                        GF_ShowToastrSuccess('Đăng Kí Thành Công !!');
                        $("#user_fname").prop("readonly", false);
                    }
                },
                error: function (err) {

                    $("#user_fname").prop("readonly", false);
                    console.log(err);
                }
            });
        }


    });



    $('#btnSignInByGoogle').click(function (e) {
        e.preventDefault();
        location.href = GV_Server_Address + GV_auth_google;
    });


});