$(document).ready(function() {


    GV_STORE_TASK_GRP_TASK_DETAIL = $.jStorage.get(
        GV_KEY_STORE_TASK_GRP_TASK_DETAIL
    );



    // QML: Xin Chào <span class="badge badge-danger">ADMIN</span> Vinh Lam (lqvinh.hsu@gmail.com)

    $("#show_info_user").html(`QML: Xin Chào <span class="badge badge-danger">ADMIN</span> ${GV_STORE_TASK_GRP_TASK_DETAIL.full_name} (${GV_STORE_TASK_GRP_TASK_DETAIL.GG_email})`);

    var radio_text_admin = 'ADMIN';
    var radio_text_staff = 'STAFF';

    InitForm();

    function InitForm() {
        $('#tab_list_user').find("tbody tr").html('');
        var cntUser = 0;
        var data = {
            id: "",
        };
        // get data
        axios
            .get(GV_Server_Address + "/getalluserFullInfo", {
                params: {
                    data,
                },
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    array_ALL_user = [];
                } else {

                    if (response.data.length <= 0) {
                        array_ALL_user = [];

                    } else {
                        // SUCCESS
                        array_ALL_user = response.data;

                        $.each(array_ALL_user, function(index, user) {
                            cntUser++;
                            var userID = user.id;
                            var textButton = `   
                                        <button id='btn_show_modal_del_user_${userID}' val_xoa='1' displayName='${user.displayName}' userID="${userID}" data-toggle="" data-target="#modalDelUserYesNo" type="button" class="btn_Delete_user_out_system btn btn-danger btn-sm btn-rounded waves-effect waves-light">
                                            <i class="fas fa-plane pr-2 pt-1" aria-hidden="true"></i>XOÁ
                                         </button>`;


                            var text_status = `<a id='text_status_user_id_${userID}' href="javascript:;" class="badge badge-success">ĐANG HOẠT ĐỘNG</a>`;
                            if (user.delete_system == '1') {
                                text_status = `<a id='text_status_user_id_${userID}' href="javascript:;" class="badge badge-danger">BỊ XOÁ</a>`;
                                textButton = `   
                                        <button id='btn_show_modal_del_user_${userID}' val_xoa='0' displayName='${user.displayName}' userID="${userID}" data-toggle="" data-target="#modalDelUserYesNo" type="button" class="btn_Delete_user_out_system btn btn-success btn-sm btn-rounded waves-effect waves-light">
                                            <i class="fas fa-plane pr-2 pt-1" aria-hidden="true"></i>THÊM
                                         </button>`;
                            }

                            var disabled_radio_user_login = '';

                            var color_row = '';
                            if (GV_STORE_TASK_GRP_TASK_DETAIL.User_login_id == user.id) {

                                text_status = `<a id='text_status_user_id_${userID}' href="javascript:;" class="badge badge-secondary">BẠN-</a> ` + text_status;
                                textButton = '';
                                disabled_radio_user_login = 'disabled';
                                color_row = `style="background-color: #8e8e67;"`;
                            }

                            var checkAdmin = '';
                            var checkStaff = '';

                            if (user.authority_code == GV_AUT_CODE_MASTER) {
                                checkAdmin = 'checked';
                                checkStaff = '';
                            } else {
                                checkStaff = 'checked';
                                checkAdmin = '';
                            }

                            var template_row = `
                             <tr  ${color_row} >
                                    <th scope="row">${cntUser}</th>
                                    <td>${user.displayName} ${text_status}</td>
                                    <td>${user.email}</td>
                                    <td>
                                        <!-- Material inline 1 -->
                                        <div class="form-check form-check-inline">
                                            <input ${disabled_radio_user_login} id_btn_press_show_modal_yes_no='btn_show_modal_del_user_${userID}' radio_text='${radio_text_admin}' ${checkAdmin} userID='${userID}' type="radio" class="form-check-input" id="radio_userID_${userID}_1" name="grp_radio_userID_${userID}">
                                            <label class="form-check-label" for="radio_userID_${userID}_1">${radio_text_admin}</label>
                                        </div>
    
                                        <!-- Material inline 2 -->
                                        <div class="form-check form-check-inline">
                                            <input ${disabled_radio_user_login} id_btn_press_show_modal_yes_no='btn_show_modal_del_user_${userID}' radio_text='${radio_text_staff}' ${checkStaff} userID='${userID}' type="radio" class="form-check-input" id="radio_userID_${userID}_2" name="grp_radio_userID_${userID}">
                                            <label class="form-check-label" for="radio_userID_${userID}_2">${radio_text_staff}</label>
                                        </div>
    
                                        <div id="loader_userID_${userID}" class="spinner-border text-success" role="status"
                                            style=" height: 15px; width: 15px;display:none;">
                                            <span class="sr-only">Loading...</span>
                                        </div>
    
                                        <!-- Material inline 3 Button XOÁ -->
                                        ${textButton}
                                     
                                    </td>
                            </tr>
    `
                            $('#tab_list_user tbody').append(template_row);

                            $(`input[name='grp_radio_userID_${userID}']`).change(function() {
                                HandleUpdateAutrhorityUser($(this));
                            });

                        }); // end for each



                        $(".btn_Delete_user_out_system").click(function(e) {
                            e.preventDefault();
                            Handle_Show_Modal_Yes_No_Delete_Use($(this));
                        });


                    } //end ELSE
                } // }// end else SUCCESS
                $('#modalFullCoverLoader').hide();
            })
            .catch(function(error) {
                array_ALL_user = [];
                $('#modalFullCoverLoader').hide();
            });
    }

    function HandleUpdateAutrhorityUser(input_radio) {
        $('#modalFullCoverLoader').show();



        var userID = input_radio.attr('userID');
        var radio_text = input_radio.attr('radio_text');

        var btn_show_modal_del_yes_no = $(`#${input_radio.attr('id_btn_press_show_modal_yes_no')}`);

        $(`input[name='grp_radio_userID_${userID}']`).prop("disabled", true);

        var new_authority_value = '';
        if (radio_text == radio_text_admin) {
            new_authority_value = '1';
        } else if (radio_text == radio_text_staff) {
            new_authority_value = '0';
        }

        var d = GetSysDate();
        var t = GetSysTime();


        var data = {
            id: userID,
            authority_code: new_authority_value,
            updatedate: d,
            updatetime: t
        };
        axios
            .post(GV_Server_Address + "/updateAuthorityUser", {
                data: data,
            })
            .then(function(response) {
                if (response.errno != undefined) {
                    // ERR

                    ShowBtnErr(btn_show_modal_del_yes_no);
                } else {
                    // SUCCESS
                    ShowBtnSuccess(btn_show_modal_del_yes_no);

                } // }// end else SUCCESS
                $(`input[name='grp_radio_userID_${userID}']`).prop("disabled", false);
                $('#modalFullCoverLoader').hide();
            })
            .catch(function(error) {
                $(`input[name='grp_radio_userID_${userID}']`).prop("disabled", false);
                $('#modalFullCoverLoader').hide();
                ShowBtnErr(btn_show_modal_del_yes_no);
            });

    }

    function Handle_Show_Modal_Yes_No_Delete_Use(btnPressShowModalYesNo) {

        var userID = btnPressShowModalYesNo.attr("userID");
        var val_xoa = btnPressShowModalYesNo.attr("val_xoa");
        var displayName_deleted = btnPressShowModalYesNo.attr("displayName");

        $('#btn_modal_yes_del_user').attr('id_btn_press_show_modal_yes_no', btnPressShowModalYesNo.attr("id"));
        $("#btn_modal_yes_del_user").attr("userid", userID);
        $("#btn_modal_yes_del_user").attr("val_xoa", val_xoa);
        $("#btn_modal_yes_del_user").attr("displayName_deleted", displayName_deleted);

        SetUpModalYesNo(val_xoa, displayName_deleted);
        btnPressShowModalYesNo.attr("data-toggle", "modal");
    }

    function SetUpModalYesNo(val_xoa, displayName_deleted) {
        if (val_xoa == '1') {
            $('#modal_yes_no_icon').html(`<i class="fas fa-user-times fa-4x"></i>`);
            $('#modal_yes_no_Header').html('XOÁ NGƯỜI DÙNG');
            $('#modal_yes_no_type').attr('class', 'modal-dialog modal-notify modal-danger');

            $("#del_user_name").html(
                `Bạn có đồng ý xoá [<span class='text-danger'>${displayName_deleted}</span>] khỏi hệ thống ?`
            );

            $('#btn_modal_yes_del_user').attr('class', 'btn btn-danger');
            $('#btn_modal_no_del_user').attr('class', 'btn btn-outline-danger waves-effect');
        } else {
            $('#modal_yes_no_icon').html(`<i class="fas fa-american-sign-language-interpreting cc_pointer fa-4x"></i>`);
            $('#modal_yes_no_Header').html('THÊM NGƯỜI DÙNG');
            $('#modal_yes_no_type').attr('class', 'modal-dialog modal-notify modal-success');

            $("#del_user_name").html(
                `Bạn có đồng ý thêm [<span class='text-success'>${displayName_deleted}</span>] vào hệ thống ?`
            );

            $('#btn_modal_yes_del_user').attr('class', 'btn btn-success');
            $('#btn_modal_no_del_user').attr('class', 'btn btn-outline-success waves-effect');

        }
    }

    function ShowBtnErr(btn_show_modal_del_yes_no) {
        var current_html_btn = btn_show_modal_del_yes_no.html();
        var current_class_btn = btn_show_modal_del_yes_no.attr('class');
        btn_show_modal_del_yes_no.prop("disabled", true);
        btn_show_modal_del_yes_no.attr('class', 'animated headShake fast btn_Delete_user_out_system btn btn-danger btn-sm btn-rounded waves-effect waves-light');
        btn_show_modal_del_yes_no.html('<i class="fas fa-exclamation cc_pointer pr-2 pt-1" aria-hidden="true"></i>LỖI...');

        setTimeout(() => {
            btn_show_modal_del_yes_no.attr('class', current_class_btn);
            btn_show_modal_del_yes_no.html(current_html_btn);
            btn_show_modal_del_yes_no.prop("disabled", false);

        }, 2000);
    }


    function ShowBtnSuccess(btn_show_modal_del_yes_no) {
        var current_html_btn = btn_show_modal_del_yes_no.html();
        var current_class_btn = btn_show_modal_del_yes_no.attr('class');
        btn_show_modal_del_yes_no.prop("disabled", true);
        btn_show_modal_del_yes_no.attr('class', 'animated heartBeat infinite fast btn_Delete_user_out_system btn btn-success btn-sm btn-rounded waves-effect waves-light');
        btn_show_modal_del_yes_no.html('<i class="far fa-thumbs-up cc_pointer pr-2 pt-1" aria-hidden="true"></i>THÀNH CÔNG');

        setTimeout(() => {
            btn_show_modal_del_yes_no.attr('class', current_class_btn);
            btn_show_modal_del_yes_no.html(current_html_btn);
            btn_show_modal_del_yes_no.prop("disabled", false);

        }, 1500);
    }


    $("#btn_modal_yes_del_user").click(function(e) {

        $('#modalFullCoverLoader').show();

        var btn = $(this);
        var userID = btn.attr('userid');
        var id_btn_press_show_modal_yes_no = btn.attr('id_btn_press_show_modal_yes_no');
        var displayName_deleted = btn.attr('displayName_deleted');
        var val_xoa = btn.attr("val_xoa");
        var btn_show_modal_del_yes_no = $('#' + id_btn_press_show_modal_yes_no);

        var d = GetSysDate();
        var t = GetSysTime();
        var data = {
            id: userID,
            updatedate: d,
            updatetime: t,
            val_xoa: val_xoa
        };

        // post data
        // in SERVER get data USING :  req.body.data
        axios
            .post(GV_Server_Address + "/deleteUserOutSystem", {
                data: data,
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    ShowBtnErr(btn_show_modal_del_yes_no);
                } else {
                    SetUpModalYesNo(val_xoa, displayName_deleted);

                    if (val_xoa == '1') {

                        $(`#text_status_user_id_${userID}`).attr('class', 'badge badge-danger');
                        $(`#text_status_user_id_${userID}`).html('BỊ XOÁ');

                        btn_show_modal_del_yes_no.attr('class', 'btn_Delete_user_out_system btn btn-success btn-sm btn-rounded waves-effect waves-light');
                        btn_show_modal_del_yes_no.html('<i class="fas fa-plane pr-2 pt-1" aria-hidden="true"></i>THÊM');
                        btn_show_modal_del_yes_no.attr('val_xoa', '0');

                    } else {
                        $(`#text_status_user_id_${userID}`).attr('class', 'badge badge-success');
                        $(`#text_status_user_id_${userID}`).html('ĐANG HOẠT ĐỘNG');

                        btn_show_modal_del_yes_no.attr('class', 'btn_Delete_user_out_system btn btn-danger btn-sm btn-rounded waves-effect waves-light');
                        btn_show_modal_del_yes_no.html('<i class="fas fa-plane pr-2 pt-1" aria-hidden="true"></i>XOÁ');
                        btn_show_modal_del_yes_no.attr('val_xoa', '1');
                    }
                    ShowBtnSuccess(btn_show_modal_del_yes_no);

                } // }// end else SUCCESS
                $('#modalFullCoverLoader').hide();

            })
            .catch(function(error) {
                $('#modalFullCoverLoader').hide();
                ShowBtnErr(btn_show_modal_del_yes_no);
            });
    });


    $("#input_text_search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tab_list_user tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

});