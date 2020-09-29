$(document).ready(function () {


    GV_STORE_TASK_GRP_TASK_DETAIL = $.jStorage.get(
        GV_KEY_STORE_TASK_GRP_TASK_DETAIL
    );

    // QML: Xin Chào <span class="badge badge-danger">ADMIN</span> Vinh Lam (lqvinh.hsu@gmail.com)

    $("#show_info_user").html(`QML: Xin Chào <span class="badge badge-danger">ADMIN11</span> ${GV_STORE_TASK_GRP_TASK_DETAIL.full_name} (${GV_STORE_TASK_GRP_TASK_DETAIL.GG_email})`);

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
            .then(function (response) {
                if (response.data.errno != undefined) {
                    // ERR
                    array_ALL_user = [];
                } else {

                    if (response.data.length <= 0) {
                        array_ALL_user = [];

                    } else {
                        // SUCCESS
                        array_ALL_user = response.data;

                        $.each(array_ALL_user, function (index, user) {
                            cntUser++;
                            var userID = user.id;
                            var textButton = `   
                                        <button val_xoa='1' displayName='${user.displayName}' userID="${userID}" data-toggle="" data-target="#modalDelUserYesNo" type="button" class="btn_Delete_user_out_system btn btn-danger btn-sm btn-rounded waves-effect waves-light">
                                            <iclass="fas fa-plane pr-2 pt-1" aria-hidden="true"></i>XOÁ
                                         </button>`;


                            var text_status = `<a href="#" class="badge badge-success">ĐANG HOẠT ĐỘNG</a>`;
                            if (user.delete_system == '1') {
                                text_status = `<a href="#" class="badge badge-danger">BỊ XOÁ</a>`;
                                textButton = `   
                                        <button val_xoa='0' displayName='${user.displayName}' userID="${userID}" data-toggle="" data-target="#modalDelUserYesNo" type="button" class="btn_Delete_user_out_system btn btn-success btn-sm btn-rounded waves-effect waves-light">
                                            <iclass="fas fa-plane pr-2 pt-1" aria-hidden="true"></i>THÊM
                                         </button>`;
                            }

                            var checkAdmin = '';
                            var checkStaff = '';

                            if (user.authority_code == GV_AUT_CODE_MASTER) {
                                checkAdmin = 'checked';
                                checkStaff = '';
                            }
                            else {
                                checkStaff = 'checked';
                                checkAdmin = '';
                            }

                            var template_row = `
                            <tr>
                                    <th scope="row">${cntUser}</th>
                                    <td>${user.displayName} ${text_status}</td>
                                    <td>${user.email}</td>
                                    <td>
                                        <!-- Material inline 1 -->
                                        <div class="form-check form-check-inline">
                                            <input radio_text='${radio_text_admin}' ${checkAdmin} userID='${userID}' type="radio" class="form-check-input" id="radio_userID_${userID}_1" name="grp_radio_userID_${userID}">
                                            <label class="form-check-label" for="radio_userID_${userID}_1">${radio_text_admin}</label>
                                        </div>
    
                                        <!-- Material inline 2 -->
                                        <div class="form-check form-check-inline">
                                            <input radio_text='${radio_text_staff}' ${checkStaff} userID='${userID}' type="radio" class="form-check-input" id="radio_userID_${userID}_2" name="grp_radio_userID_${userID}">
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

                            $(`input[name='grp_radio_userID_${userID}']`).change(function () {
                                HandleUpdateAutrhorityUser($(this));
                            });

                            $(".btn_Delete_user_out_system").click(function (e) {
                                e.preventDefault();
                                Handle_Show_Modal_Yes_No_Delete_Use($(this));
                            });
                        });// end for each

                    } //end ELSE
                } // }// end else SUCCESS
                $('#modalFullCoverLoader').hide();
            })
            .catch(function (error) {
                array_ALL_user = [];
                $('#modalFullCoverLoader').hide();
            });
    }

    function HandleUpdateAutrhorityUser(input_radio) {
        $('#modalFullCoverLoader').show();
        var userID = input_radio.attr('userID');
        var radio_text = input_radio.attr('radio_text');
        var new_authority_value = '';
        if (radio_text == radio_text_admin) {
            new_authority_value = '1';
        }
        else if (radio_text == radio_text_staff) {
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
            .then(function (response) {
                if (response.errno != undefined) {
                    // ERR
                    $('#modalFullCoverLoader').hide();
                } else {
                    // SUCCESS
                    InitForm();

                } // }// end else SUCCESS
            })
            .catch(function (error) {
                $('#modalFullCoverLoader').hide();
            });

    }

    function Handle_Show_Modal_Yes_No_Delete_Use(btn) {

        var userID = btn.attr("userID");
        var val_xoa = btn.attr("val_xoa");
        var displayName = btn.attr("displayName");

        if (val_xoa == '1') {
            $('#modal_yes_no_icon').html(`<i class="fas fa-user-times fa-4x"></i>`);
            $('#modal_yes_no_Header').html('XOÁ NGƯỜI DÙNG');
            $('#modal_yes_no_type').attr('class', 'modal-dialog modal-notify modal-danger');

            $("#del_user_name").html(
                `Bạn có đồng ý xoá [<span class='text-danger'>${displayName}</span>] khỏi hệ thống ?`
            );

            $('#btn_modal_yes_del_user').attr('class', 'btn btn-danger');
            $('#btn_modal_no_del_user').attr('class', 'btn btn-outline-danger waves-effect');
        }
        else {
            $('#modal_yes_no_icon').html(`<i class="fas fa-american-sign-language-interpreting cc_pointer fa-4x"></i>`);
            $('#modal_yes_no_Header').html('THÊM NGƯỜI DÙNG');
            $('#modal_yes_no_type').attr('class', 'modal-dialog modal-notify modal-success');

            $("#del_user_name").html(
                `Bạn có đồng ý thêm [<span class='text-success'>${displayName}</span>] vào hệ thống ?`
            );

            $('#btn_modal_yes_del_user').attr('class', 'btn btn-success');
            $('#btn_modal_no_del_user').attr('class', 'btn btn-outline-success waves-effect');

        }




        $("#btn_modal_yes_del_user").attr("userid", userID);
        $("#btn_modal_yes_del_user").attr("val_xoa", val_xoa);

        btn.attr("data-toggle", "modal");

    }

    $("#btn_modal_yes_del_user").click(function (e) {

        $('#modalFullCoverLoader').show();

        var btn = $(this);
        var d = GetSysDate();
        var t = GetSysTime();

        var val_xoa = btn.attr("val_xoa");

        var data = {
            id: btn.attr('userid'),
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
            .then(function (response) {
                if (response.data.errno != undefined) {
                    // ERR
                    $('#modalFullCoverLoader').hide();
                } else {
                    InitForm();
                } // }// end else SUCCESS

            })
            .catch(function (error) {
                $('#modalFullCoverLoader').hide();
            });
    });


});