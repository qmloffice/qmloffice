$(document).ready(function () {


    $("tab_showtask_staff").find("tr:gt(0)").remove();
    $("#btn_upload_file_test222").click(function (e) {
        var controlFile = $("#input_file_2");
        var cntFile = controlFile.prop("files").length;

        if (cntFile <= 0) {
            GF_ShowToastrWarning('KHONG CO FILE');
            return;
        }

        var formData = new FormData();
        if (cntFile == 1) {
            formData.append("flag_multiFlag", "false");
        } else if (cntFile > 1) {
            formData.append("flag_multiFlag", "true");
        }

        formData.append("accesstoken", accesstoken);
        for (let index = 0; index < cntFile; index++) {
            formData.append(
                "userfile",
                controlFile.prop("files")[index]
            );
        }

        axios
            .post(GV_Server_Address + '/uploadFile2', formData, {
                headers: {
                    'processData': false,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(function (response) {
                if (response.data.errno != undefined) {

                } else {
                    var list = 1;

                    var res = response.data;
                    // res.mes: mes,
                    // res.file_id: data.data.id,
                    // res.file_name: file_name,
                    // res.file_size_byte: file_size,


                }
            })


    });



    $("#input_file_2").on('change', function (event) {
        var controlFile = $("#input_file_2");
        var numberFile = controlFile.prop("files").length;
        var cnt = 0;
        if (numberFile <= 0) {
            GF_ShowToastrWarning('KHONG CO FILE');
            return;
        }

        $("#list_file_upp").html('');
        for (let index = 0; index < numberFile; index++) {
            cnt++;
            var file = controlFile.prop("files")[index];
            $("#list_file_upp").append(`<div class='' id='list_file_upp_${cnt}'>${cnt}. ${file.name} [${GF_GetTextSizeFile_By_SizeFileByte(file.size)}]</div>`);
        }
    });

    $("#btn_upload_file_test2").click(function (e) {

        GF_CheckAccGoogleAvaibleNow(accesstoken);
        var btn = $(this);
        TEST_CreateFolder(btn);

    });

    $("#btn_upload_file_test22").click(function (e) {

        HandleUploadFileAfterCheckExpiresAccesstoken(accesstoken);

    });


    function TEST_CreateFolder(btn) {

        btn.prop("disabled", true);

        var data = {
            accesstoken: accesstoken,
            fodlerName: $('#folder_name_input_test').val(),
            emailAddress: email
        };
        // post data
        // in SERVER get data USING :  req.body.data.accesstoken
        axios.post(GV_Server_Address + '/test_file_admin', {
            data: data,
        })
            .then(function (response) {
                if (response.data.errno != undefined) {
                    // ERR
                    GF_ShowToastrWarning('Mất kết nối Internet!!');
                } else {
                    // SUCCESS

                    // control.hide();
                } // }// end else SUCCESS
                btn.prop("disabled", false);
            })
            .catch(function (error) {
                console.log(error);
                btn.prop("disabled", false);
            });

    }

    function HandleUploadFileAfterCheckExpiresAccesstoken(accesstoken1) {
        var linkEx = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accesstoken1}`;
        var data = { 'id': '1' };
        axios
            .get(linkEx, {
                params: {
                    data,
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
                        var controlFile = $("#input_file_2");
                        var numberFile = controlFile.prop("files").length;
                        var index = 0;
                        if (numberFile <= 0) {
                            GF_ShowToastrWarning('KHONG CO FILE');
                            return;
                        }
                        uploadFile2(controlFile, index, numberFile);
                    }
                } // }// end else SUCCESS
            })
            .catch(function (error) {
                location.href = GV_Server_Address + GV_auth_google;
            });
    }



    function uploadFile2(controlFile, index, numberFile) {
        $(up_file2_Loader).show();
        if (index >= numberFile) {
            $(up_file2_Loader).hide();
            return;
        }
        var formData = new FormData();
        formData.append("cnt", (index + 1).toString());
        formData.append("flag_multiFlag", "false");
        formData.append("accesstoken", accesstoken);
        formData.append("userfile", controlFile.prop("files")[index]);

        axios
            .post(GV_Server_Address + '/uploadFile2', formData, {
                headers: {
                    'processData': false,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(function (response) {
                if (response.data.errno != undefined) {
                    index = numberFile;
                    uploadFile2(controlFile, index, numberFile);
                    location.href = GV_Server_Address + GV_auth_google;
                } else {
                    index = index + 1;
                    var res = response.data;
                    $(`#list_file_upp_${res.cnt}`).attr('class', 'green');
                    uploadFile2(controlFile, index, numberFile);
                }
            })
            .catch(function (error) {
                index = numberFile;
                uploadFile2(controlFile, index, numberFile);
                location.href = GV_Server_Address + GV_auth_google;
            });
    }





    // START PROJECT HERE
    // START PROJECT HERE
    // START PROJECT HERE


    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);


    const accesstoken_expires_in = '';


    // check accesstoken in this function
    let googleID = urlParams.get("googleID");
    let accesstoken = urlParams.get("accesstoken");
    let full_name = urlParams.get("name");
    let pic_url = urlParams.get("pic_url");
    let email = urlParams.get("email");
    let authority_code = urlParams.get("authority_code");
    let id = urlParams.get("id");
    let menu_id = urlParams.get("menu_id");


    if (accesstoken == '' || accesstoken == undefined || accesstoken == null) {
        if (
            $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) != null &&
            $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) != undefined
        ) {
            GV_STORE_TASK_GRP_TASK_DETAIL = $.jStorage.get(
                GV_KEY_STORE_TASK_GRP_TASK_DETAIL
            );

            accesstoken = GV_STORE_TASK_GRP_TASK_DETAIL.accesstoken;
            googleID = GV_STORE_TASK_GRP_TASK_DETAIL.googleID;
            full_name = GV_STORE_TASK_GRP_TASK_DETAIL.name;
            pic_url = GV_STORE_TASK_GRP_TASK_DETAIL.pic_url;
            email = GV_STORE_TASK_GRP_TASK_DETAIL.email;
            authority_code = GV_STORE_TASK_GRP_TASK_DETAIL.authority_code
            id = GV_STORE_TASK_GRP_TASK_DETAIL.id;
            menu_id = GV_STORE_TASK_GRP_TASK_DETAIL.menu_id;
        }
    }

    // Check again if not accestoken, need to login GG
    if (accesstoken == '' || accesstoken == undefined || accesstoken == null) {

        location.href = GV_Server_Address + GV_auth_google;
        return;
    }

    if (accesstoken != '' && accesstoken != undefined && accesstoken != null) {

        if (
            $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) != null &&
            $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) != undefined
        ) {
            GV_STORE_TASK_GRP_TASK_DETAIL = $.jStorage.get(
                GV_KEY_STORE_TASK_GRP_TASK_DETAIL
            );
        }

        GV_STORE_TASK_GRP_TASK_DETAIL.accesstoken = accesstoken;
        GV_STORE_TASK_GRP_TASK_DETAIL.googleID = googleID;
        GV_STORE_TASK_GRP_TASK_DETAIL.name = full_name;
        GV_STORE_TASK_GRP_TASK_DETAIL.pic_url = pic_url;
        GV_STORE_TASK_GRP_TASK_DETAIL.email = email;
        GV_STORE_TASK_GRP_TASK_DETAIL.authority_code = authority_code;
        GV_STORE_TASK_GRP_TASK_DETAIL.id = id;
        GV_STORE_TASK_GRP_TASK_DETAIL.menu_id = menu_id;

        GF_SetjStorage(
            GV_KEY_STORE_TASK_GRP_TASK_DETAIL,
            GV_STORE_TASK_GRP_TASK_DETAIL
        );

    }

    var label_user = '<span class="badge badge-danger">ADMIN</span>';

    if (authority_code != GV_AUT_CODE_MASTER) {
        label_user = '<span class="badge badge-success">STAFF</span>';
    }

    if (authority_code == GV_AUT_CODE_MASTER) {
        $('#btn_open_uermanager_page').show();
        $('#btn_ADMIN_want_to_see_jobs').show();
    }



    $("#show_info_user").html(`QML: Xin Chào ${label_user} ${full_name} (${email})`);
    $("#path_folder").html(`QML: Xin Chào ${full_name} (${email})`);


    GV_STORE_SIGN_IN_INFO.accesstoken = accesstoken;
    GV_STORE_SIGN_IN_INFO.googleID = googleID;
    GV_STORE_SIGN_IN_INFO.full_name = full_name;
    GV_STORE_SIGN_IN_INFO.pic_url = pic_url;
    GV_STORE_SIGN_IN_INFO.email = email;
    GV_STORE_SIGN_IN_INFO.authority_code = authority_code;
    GV_STORE_SIGN_IN_INFO.id = id;
    GV_STORE_SIGN_IN_INFO.menu_id = menu_id;


    //GetAllFileFromDB();
    var array_key_store_node = [];
    var array_ALL_user = [];
    var cur_folderID = "";
    var cur_folderName = "";
    var cur_pathFolder = "";
    var cur_titleID = "";

    if (
        $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) == null ||
        $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) == undefined
    ) {
        GV_STORE_TASK_GRP_TASK_DETAIL = {};
    } else {

        GV_STORE_TASK_GRP_TASK_DETAIL = $.jStorage.get(
            GV_KEY_STORE_TASK_GRP_TASK_DETAIL
        );

        // if (GV_STORE_TASK_GRP_TASK_DETAIL.GG_googleID != googleID) {
        //     $.jStorage.deleteKey(GV_KEY_STORE_TASK_GRP_TASK_DETAIL);
        //     GV_STORE_TASK_GRP_TASK_DETAIL = {};
        // }

        if (GV_STORE_TASK_GRP_TASK_DETAIL.verifyGoogleAcc == "true") {
            GV_STORE_TASK_GRP_TASK_DETAIL.verifyGoogleAcc = "false";
            GV_STORE_TASK_GRP_TASK_DETAIL.accesstoken = accesstoken;
            GV_STORE_TASK_GRP_TASK_DETAIL.GG_googleID = googleID;
            GV_STORE_TASK_GRP_TASK_DETAIL.GG_pic_url = pic_url;
            GV_STORE_TASK_GRP_TASK_DETAIL.GG_email = email;
            GF_SetjStorage(
                GV_KEY_STORE_TASK_GRP_TASK_DETAIL,
                GV_STORE_TASK_GRP_TASK_DETAIL
            );
            window.open(GV_link_detail, "_self");
        } else {

        }
    }

    $("#11111").hide();
    $("#tab_showtask").hide();

    // DELETE START
    // //GF_HandleSignInSuccessBackToSignInWhenLoginFail();

    // GV_STORE_SIGN_IN_INFO = $.jStorage.get(GV_CK_SIGNIN_STORE_INFO);

    // if (GV_STORE_SIGN_IN_INFO == undefined) {
    //     //GF_HandleSignOut();
    // }
    // DELETE END

    if (email == 'qml.babymommycare@ptd.edu.vn') {
        $('#div_assign_using_folder_google_drive').show();
    }

    GF_CheckAccGoogleAvaibleNow(accesstoken);


    // store to array_ALL_user 
    GetAllUserFromDB();

    CheckUserIsdeleted_And_Init_Control(id, email, 0);

    var b_show_main_form = false;

    var interValShowFormMain = setInterval(() => {
        if (b_show_main_form == true) {

            clearInterval(interValShowFormMain);
            $('#body').show();
        }
    }, 1000);


    ////////////////////////////////////////////////
    ////////////////////////////////////////////////  START LOCAL FUNCTION
    ////////////////////////////////////////////////

    function CheckUserIsdeleted_And_Init_Control(_idUser, _email, ADMIN_want_to_see_jobs) {

        var data = {
            id: _idUser,
        };
        // get data
        // SERVER USING : let dataXXX = JSON.parse(req.query.data);
        // SERVER USING : let id = dataXXX.id;
        axios
            .get(GV_Server_Address + '/get_1_user_info_by_email', {
                params: {
                    data,
                },
            })
            .then(function (response) {
                if (response.data.errno != undefined) {
                    // ERR
                    location.href = GV_Server_Address + GV_auth_google;
                } else {
                    // SUCCESS
                    if (response.data.length <= 0) {
                        location.href = GV_Server_Address + GV_auth_google;
                    } else if (response.data[0].delete_system == '1') {
                        $('#show_info_user').hide();
                        $("#path_folder").html(`QML: Xin Chào ${_email}, <span class="badge badge-pill pink"><i class="fas fa-wheelchair" aria-hidden="true"></i>   bạn không thể hoạt động được nữa.</span>`);
                    } else {

                        var showFinished = false;

                        if (response.data[0].authority_code == GV_AUT_CODE_MASTER) {

                            if (ADMIN_want_to_see_jobs == 1) {
                                InitControlForUserStaff();
                            } else {
                                $("#jstree_div_all").css("display", "");
                                InitControlForUserADMIN();
                                b2TaskTreeAssignDataAfterLogin(); // show form when login success here in this function
                            }
                        } else {
                            InitControlForUserStaff();
                        }
                    }
                } // }// end else SUCCESS
            })
            .catch(function (error) {
                location.href = GV_Server_Address + GV_auth_google;
            });
    }


    $('#btn_ADMIN_want_to_see_jobs').click(function (e) {

        var func = $(this).attr('function');
        if (func == 'show_jobs') {
            $(this).attr('function', 'manager');
        } else {
            $(this).attr('function', 'show_jobs');
        }

        $('#tab_showtask_staff').find("tbody tr").html('');

        CheckUserIsdeleted_And_Init_Control(id, email, 1)
    });

    var setsetIntervalCheckUserIsdeleted = setInterval(function () {
        CheckUserIsdeleted(id, email);
    }, 10000)


    function CheckUserIsdeleted(_idUser, _email) {
        var data = {
            id: _idUser,
        };
        // get data
        // SERVER USING : let dataXXX = JSON.parse(req.query.data);
        // SERVER USING : let id = dataXXX.id;
        axios
            .get(GV_Server_Address + '/get_1_user_info_by_email', {
                params: {
                    data,
                },
            })
            .then(function (response) {
                if (response.data.errno != undefined) {
                    // ERR
                    location.href = GV_Server_Address + GV_auth_google;
                } else {
                    // SUCCESS
                    if (response.data.length <= 0) {
                        location.href = GV_Server_Address + GV_auth_google;
                    } else if (response.data[0].delete_system == '1') {
                        clearInterval(setsetIntervalCheckUserIsdeleted);
                        $("#tab_showtask_staff").empty();

                        $("#tab_showtask").empty();
                        $("#jstree_div_all").empty();
                        //$("#cardHoldListTable").empty();
                        // jstree_div_all cardHoldListTable
                        $("#path_folder").html(`QML: Xin Chào ${_email}, <span class="badge badge-pill pink"><i class="fas fa-wheelchair" aria-hidden="true"></i>   bạn không thể hoạt động được nữa.</span>`);
                    }
                } // }// end else SUCCESS
            })
            .catch(function (error) {
                location.href = GV_Server_Address + GV_auth_google;
            });
    }

    function InitControlForUserStaff() {

        $('#modalFullCoverLoader').show();
        var data = {
            id: GV_STORE_SIGN_IN_INFO.id,
        };
        // get data
        // SERVER USING : let dataXXX = JSON.parse(req.query.data);
        // SERVER USING : let id = dataXXX.id;
        axios.get(GV_Server_Address + '/GetAllTaskOfOneUser', {
            params: {
                data,
            },
        })
            .then(function (response) {
                if (response.errno != undefined) {
                    // ERR
                    GF_ShowToastrWarning('MAT KET NOI INTERNET!!');
                    $('#modalFullCoverLoader').hide();
                } else {
                    // SUCCESS

                    var list_task_grp_dtl_id = '';
                    var list_data = response.data;


                    // Get list grp_detail_id Start
                    var cntGrpDtl = 0;
                    $.each(list_data, function (index, TASK_GROUP_DETAIL) {
                        cntGrpDtl++;
                        if (list_data.length == cntGrpDtl) {
                            list_task_grp_dtl_id = list_task_grp_dtl_id + `'${TASK_GROUP_DETAIL.task_grp_detail_id}'`;
                        } else {
                            list_task_grp_dtl_id = list_task_grp_dtl_id + `'${TASK_GROUP_DETAIL.task_grp_detail_id}', `;
                        }
                    });
                    // Get list grp_detail_id End


                    // Get Notify Start
                    var data = {
                        list_task_grp_dtl_id: list_task_grp_dtl_id,
                        user_login_id: GV_STORE_SIGN_IN_INFO.id,
                    };
                    axios
                        .get(GV_Server_Address + '/get_Notify_By_TaskDtlID_And_userLogin', {
                            params: {
                                data,
                            },
                        })
                        .then(function (response2) {
                            if (response2.errno != undefined) {
                                // ERR
                                GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin = [];
                                $('#modalFullCoverLoader').hide();
                            } else {
                                // SUCCESS
                                if (response2.data.length > 0) {
                                    GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin = response2.data;
                                } else {
                                    GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin = [];
                                }

                                // assign grp_task_detail to table list grp_task_detail START
                                var cnt = 0;
                                var cntNotify = 0;
                                $.each(list_data, function (index, data) {

                                    if (GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin != undefined &&
                                        GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin.length > 0) {

                                        var notify_in_each_detail = [];
                                        $.each(GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin, function (index, notify) {
                                            if (notify.task_grp_detail_id == data.task_grp_detail_id) {
                                                notify_in_each_detail.push(notify);
                                            }
                                        });
                                        cntNotify = notify_in_each_detail.length;
                                    }

                                    cnt++;
                                    var timee = GF_Ex_ParseTime(data.create_datetime, 'dd-MM-yyyy hh:mm:mili')
                                    var notifyText = '';
                                    if (cntNotify > 0) {
                                        notifyText = `<span class="badge badge-danger">Thông báo (${cntNotify})</span>`;
                                    }
                                    var template = `
                                      <tr>
                                          <td class="text-center" scope="row">
                                              <i class="fas fa-reply purple-text"></i>  ${cnt}
                                          </td>
                                          <td class="text-left text-wrap">

                                              <a href="${GV_link_detail}" group_id="${data.grp_id}" group_name="${data.group_name}" task_detail_name="${data.task_grp_dtl_name}" creator_name='${data.creator_name}' creator_time='${timee}' task_grp_detail = ${data.task_grp_detail_id} class="show_task_grp_detail font-weight-bold blue-text">${data.task_grp_dtl_name} ${notifyText}</a>
                                              <div>
                                                  <span class="badge purple ">Người tạo : ${data.creator_name}</span></br>
                                                  <span class="badge badge-info">Lúc : ${timee}</span>
                                              </div>
                                          </td>
                                      </tr>
                                      `;

                                    $("#tab_showtask_staff tbody").append(template);

                                });
                                $(".show_task_grp_detail").click(function (e) {
                                    var adddressInFo = $(this);
                                    HandleClickOnTaskDetail(adddressInFo);
                                });

                                if ($('#body').attr('show') == '0') {
                                    $('#body').attr('show', '1');
                                    $('#body').show();
                                }

                                // assign grp_task_detail to table list grp_task_detail END

                                $('#modalFullCoverLoader').hide();
                            } // }// end else SUCCESS
                        })
                        .catch(function (error) {
                            $('#modalFullCoverLoader').hide();
                        });

                    // Get Notify End

                } // }// end else SUCCESS
            })
            .catch(function (error) {
                $('#modalFullCoverLoader').hide();
            });




    }

    function InitControlForUserADMIN() {
        $("#title_sign_up_success").hide();
        $("#title_sign_up_fail").hide();
        $("#spinner_show_wait_signup_title").hide();

        // init select lanuch select option- mở chọn phân quyên khi đăng kí user
        $(".mdb-select").materialSelect();

        // init dataTable
        var tableListUserSelected = $("#task_dtl_table_user_list").DataTable({
            scrollX: true,
            scrollY: 200, // 40px = 1 row
        });
        $(".dataTables_length").addClass("bs-select");
        b2TaskTreeInit("jstree_div");
    }

    function b2TaskTreeInit(taskTreeName) {
        var dataNodeTaskRoot = [{
            id: "ajson2",
            text: "ALL",
            icon: "img/icon/folder_open.png",
            li_attr: {
                id: "ajson2",
            },
            a_attr: {
                href: "#",
                id: "ajson2_anchor",
            },
            state: {
                loaded: true,
                opened: true,
                selected: true,
                disabled: false,
            },
            data: {},
            parent: "#",
            type: "folder-open",
        },];

        // data format demo
        $("#" + taskTreeName)
            .jstree({
                core: {
                    // 'data' : {
                    //     'url' : '?operation=get_node',
                    //     'data' : function (node) {
                    //         return { 'id' : node.id };
                    //     }
                    // },
                    data: dataNodeTaskRoot,
                    check_callback: function (o, n, p, i, m) {
                        // function(operation, node, node_parent, node_position, more)
                        if (m && m.dnd && m.pos !== "i") {
                            return false;
                        }
                        // rename_node
                        // create_node
                        // o === "move_node" ||

                        if (o === "move_node") {
                            var des_node = this.get_node(p);
                            var from_node = this.get_node(n);
                            // console.log("FROM type : " + from_node.type + ", TO type:" + des_node.type);

                            if (from_node.type == "file" && des_node.type == "file") {
                                return false;
                            }
                            if (
                                (from_node.type == "default" ||
                                    from_node.type.includes("folder")) &&
                                des_node.type == "file"
                            ) {
                                return false;
                            }
                        }

                        if (o === "copy_node" || o === "move_node") {
                            //return false;
                            if (this.get_node(n).parent === this.get_node(p).id) {
                                return false;
                            }
                            if (n.parents.length == 1) {
                                return false;
                            }
                        } else if (o === "delete_node") {
                            // check before delete
                            // dont delete ROOT
                            if (n.parents.length == 1) {
                                return false;
                            }
                        }

                        // update menu in DB
                        if (
                            o === "delete_node" ||
                            o === "rename_node" ||
                            o === "create_node" ||
                            o === "move_node" ||
                            o === "copy_node" ||
                            o === "open_node" ||
                            o === "close_node"
                        ) {
                            HandleSaveMenuAfterAction("EDITING...");
                        }

                        return true;
                    },
                    themes: {
                        responsive: false,
                        variant: "small", // show icon is big or small
                        stripes: false,
                    },
                },

                contextmenu: {
                    items: function (node) {
                        var tmp = $.jstree.defaults.contextmenu.items();
                        delete tmp.create.action;
                        tmp.create.label = "New";
                        tmp.create.submenu = {
                            create_folder: {
                                separator_after: true,
                                label: "Folder",
                                action: function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    inst.create_node(
                                        obj, {
                                        type: "default",
                                    },
                                        "last",
                                        function (new_node) {
                                            setTimeout(function () {
                                                inst.edit(new_node);
                                            }, 0);
                                        }
                                    );
                                },
                            },
                            // create_file: {
                            //   label: "File",
                            //   action: function (data) {
                            //     var inst = $.jstree.reference(data.reference),
                            //       obj = inst.get_node(data.reference);
                            //     inst.create_node(
                            //       obj, {
                            //         type: "file",
                            //       },
                            //       "last",
                            //       function (new_node) {
                            //         setTimeout(function () {
                            //           inst.edit(new_node);
                            //         }, 0);
                            //       }
                            //     );
                            //   },
                            // },
                        };
                        if (this.get_type(node) === "file") {
                            delete tmp.create;
                        }
                        return tmp;
                    },
                },
                types: {
                    default: {
                        icon: "img/icon/folder_open.png",
                    },
                    file: {
                        icon: "img/icon/task_1.png",
                    },
                    "folder-open": {
                        icon: "img/icon/folder_open.png",
                    },
                    "folder-open-search": {
                        icon: "img/icon/folder_open.png",
                        a_attr: {
                            style: "color:red;background-color:blue",
                        },
                    },
                    "folder-close": {
                        icon: "img/icon/folder_close.png",
                    },
                },
                // 'unique' : {
                //     'duplicate' : function (name, counter) {
                //         return name + ' ' + counter;
                //     }
                // },
                // 'sort' : function(a, b) {
                //     return this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : (this.get_type(a) >= this.get_type(b) ? 1 : -1);
                // },
                plugins: [
                    "state",
                    //"dnd",
                    "types",
                    "contextmenu",
                    "search",
                    // ,'sort'
                    // ,'unique'
                ],
            })
            .on("open_node.jstree", function (event, data) {
                data.instance.set_type(data.node, "folder-open");
                HandleSaveMenuAfterAction("EDITING...");
            })
            .on("close_node.jstree", function (event, data) {
                data.instance.set_type(data.node, "folder-close");
                HandleSaveMenuAfterAction("EDITING...");
            })
            .on("delete_node.jstree", function (e, data) {
                console.log(`delete_node`);
            })
            .on("create_node.jstree", function (e, data) {
                console.log(data.node.id);
                $(this)
                    .jstree(true)
                    .set_id(
                        data.node,
                        GV_STORE_SIGN_IN_INFO.menu_id +
                        "_" +
                        GenUserID() +
                        "___" +
                        data.node.id
                    );
            })
            .on("rename_node.jstree", function (e, data) {
                console.log("rename_node");
            })
            .on("move_node.jstree", function (e, data) {
                console.log("move_node");
            })
            .on("copy_node.jstree", function (e, data) {
                console.log("copy_node");
            })
            .on("changed.jstree", function (e, selectedNode) {
                HandleClickFolderOnTree(selectedNode);
            });

        $("#" + taskTreeName)
            .jstree(true)
            .refresh();

        var to = false;

        const txtSearchTree = $("#TaskInputSearch");
        txtSearchTree.keyup(function () {
            if (to) {
                clearTimeout(to);
            }
            to = setTimeout(function () {
                var v = txtSearchTree.val();
                $("#jstree_div").jstree(true).search(v);
            }, 250);

        });
    }

    var set_Interval_TreeComplete = undefined;
    var setInterval_show_form_main = undefined;

    // back up in NOTE_2.cs
    function b2TaskTreeAssignDataAfterLogin() {
        var data = {
            creator_id: GV_STORE_SIGN_IN_INFO.id,
        };

        $.ajax({
            type: "GET",
            data: data,
            contentType: "application/json",
            url: GV_Server_Address + "/getMenuByCreatorID",
            success: function (data) {
                if (data.errno != undefined) {
                    auto_SaveMenuTaskTree = setInterval(function () {
                        clearInterval(auto_SaveMenuTaskTree);
                        GF_ShowToastrWarning("KHÔNG THỂ TẢI FOLDER TREE TASK");
                        setTimeout(() => {
                            window.open("signIn.html", "_self");
                        }, 1000);
                    }, 2000);
                } else {
                    var obj = JSON.parse(data[0].tasktree);
                    // b2TaskTreeAssignData("jstree_div", obj);
                    $("#jstree_div").jstree(true).settings.core.data = undefined;
                    $("#jstree_div").jstree(true).settings.core.data = obj;
                    $("#jstree_div").jstree(true).refresh();

                    if (
                        $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) != null &&
                        $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) != undefined
                    ) {
                        set_Interval_TreeComplete = setInterval(function () {
                            if ($("#jstree_div").jstree(true).settings.core.data == undefined) {

                            } else {
                                clearInterval(set_Interval_TreeComplete);
                                var arr_ID_Parents =
                                    GV_STORE_TASK_GRP_TASK_DETAIL.arr_ID_Parents_Folder;
                                var textP = "";
                                array_key_store_node = [];

                                if (arr_ID_Parents != undefined && arr_ID_Parents.length > 0) {
                                    // set color of all parents when back from detail Start
                                    $.each(arr_ID_Parents, function (index, valueID) {
                                        if (valueID == "#") {
                                            return;
                                        }
                                        var node = $("#jstree_div").jstree(true).get_node(valueID);
                                        $("#" + valueID).css({
                                            color: "yellow",
                                            "background-color": "blue",
                                        });
                                        array_key_store_node.push(valueID);

                                        textP = textP + "/" + node.text;
                                        cur_pathFolder =
                                            cur_pathFolder +
                                            (cur_pathFolder === "" ? "" : " > ") +
                                            node.text;
                                    });
                                }


                                $("#path_folder").html(cur_pathFolder);
                                // set color of all parents when back from detail END

                                cur_folderID = GV_STORE_TASK_GRP_TASK_DETAIL.cur_folderID;
                                cur_titleID = GV_STORE_TASK_GRP_TASK_DETAIL.cur_titleID;
                                if (cur_folderID == undefined) {
                                    ShowFormMain();
                                } else {
                                    ShowListTitleWhenClickOnFolder(cur_folderID);
                                    ShowGrpTaskAndTaskDetail();

                                    setInterval_show_form_main = setInterval(function () {
                                        if ($('#list_title_in_one_folder li').length <= 0) {
                                            // DO NOT CODE HERE
                                        } else {
                                            clearInterval(setInterval_show_form_main);
                                            // code when you need
                                            var li_item = undefined;
                                            var cntthh = 1;
                                            $('#list_title_in_one_folder li').each(function () {
                                                var li_Tag = $(this);
                                                if (li_Tag.attr('id') == cur_titleID && cntthh == 1) {
                                                    li_item = $(this);
                                                    cntthh++;
                                                }
                                            });
                                            if (li_item != undefined) {
                                                HandleClickOn_Each_Title(li_item);
                                            }

                                            ShowFormMain();

                                        }
                                    }, 600)
                                }

                            }
                        }, 600);
                    }

                    if (
                        $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) == null ||
                        $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) == undefined
                    ) {
                        ShowFormMain();
                    }

                }
            },
            error: function (err) { },
        });
    }

    function ShowFormMain() {
        // show form main
        if ($('#body').attr('show') == '0') {
            $('#body').attr('show', '1');
            $('#body').show();
        }
    }

    // call in b2TaskTreeInit()
    function HandleSaveMenuAfterAction(text) {
        $("#btn_show_tree_status").html(`<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> ${text}`);

        auto_SaveMenuTaskTree = setInterval(function () {
            updateMENUtoDB();
            clearInterval(auto_SaveMenuTaskTree);
        }, 3000);
    }

    // call in HandleSaveMenuAfterAction
    function updateMENUtoDB() {
        var v = $("#jstree_div").jstree(true).get_json("#", {
            flat: true,
        });
        var taskTree = JSON.stringify(v).toString();

        var d = GetSysDate();
        var t = GetSysTime();
        var id = GenUserID();

        var data = {
            id: GV_STORE_SIGN_IN_INFO.menu_id,
            tasktree: taskTree,
            updatedate: d,
            updatetime: t,
        };

        $.ajax({
            type: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: GV_Server_Address + "/updatemenuafteraction",
            success: function (data) {
                if (data.errno != undefined) { } else {
                    $('#btn_show_tree_status').html(` <span class="" role="status" aria-hidden="true"></span>Saved`)
                }
            },
            error: function (err) {
                $("#user_fname").prop("readonly", false);
                console.log(err);
            },
        });
    }

    function GetAllUserFromDB() {
        var data = {
            id: "",
        };
        // get data
        axios
            .get(GV_Server_Address + "/getalluser", {
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

                        // delete START
                        // var array_ALL_userNeedoToUpdate = [];

                        // var d = GetSysDate();
                        // var t = GetSysTime();

                        // $.each(array_ALL_user, function (index, user) {
                        //     if (user.create_datetime == '' || user.create_datetime == undefined || user.create_datetime == null) {
                        //         user.updatedate = d;
                        //         user.updatetime = t;
                        //         user.create_datetime = GenUserID();
                        //         array_ALL_userNeedoToUpdate.push(user);
                        //     }
                        // });

                        // if (array_ALL_userNeedoToUpdate.length > 0) {
                        //     var data = {
                        //         data: array_ALL_userNeedoToUpdate
                        //     };
                        //     // post data
                        //     // in SERVER get data USING :  req.body.data
                        //     axios.post(GV_Server_Address + '/updateListUserJoinDate', {
                        //         data: data,
                        //     })
                        //         .then(function (response) {
                        //             if (response.data.errno != undefined) {

                        //                 // ERR
                        //                 array_ALL_user = [];
                        //             } else {
                        //                 // SUCCESS

                        //                 var data = {
                        //                     id: 1,
                        //                 };
                        //                 // get data
                        //                 // SERVER USING : let dataXXX = JSON.parse(req.query.data);
                        //                 // SERVER USING : let id = dataXXX.id;
                        //                 axios
                        //                     .get(GV_Server_Address + '/getalluser', {
                        //                         params: {
                        //                             data,
                        //                         },
                        //                     })
                        //                     .then(function (response) {
                        //                         if (response.errno != undefined || response.data.errno != undefined) {
                        //                             array_ALL_user = [];
                        //                             // ERR
                        //                         } else {
                        //                             // SUCCESS
                        //                             array_ALL_user = response.data;
                        //                         } // }// end else SUCCESS
                        //                     })
                        //                     .catch(function (error) {
                        //                         array_ALL_user = [];
                        //                     });

                        //             } // }// end else SUCCESS
                        //         })
                        //         .catch(function (error) {
                        //             array_ALL_user = [];
                        //         });
                        // }
                        // delete END

                    } //end ELSE

                } // }// end else SUCCESS
            })
            .catch(function (error) {
                array_ALL_user = [];
            });
    }

    // call in b2TaskTreeInit -> .on("changed.jstree", function(e, selectedNode)
    function HandleClickFolderOnTree(selectedNode) {
        var bF = false;
        if (
            selectedNode &&
            selectedNode.selected &&
            selectedNode.selected.length > 0
        ) {
            bF = true;
        } else {
            return;
        }

        if (selectedNode.node && selectedNode.node != undefined) {
            curTaskID = "";

            let typeName = "file";
            if (
                selectedNode.node.type.toString().toLowerCase().includes("default") ||
                selectedNode.node.type.toString().toLowerCase().includes("folder")
            ) {
                typeName = "folder";
            }

            // console.log("Click on " + typeName + " has ID : " + selectedNode.node.id);

            var flg = false;

            //if (flg == false && selectedNode.node.parents.length > 1) {
            // arr_ID_Parents = selectedNode.node.parents;

            flg = true;
            // selectedNode.node.parents.reverse();
            var textP = "";
            var arr_ID_Parents = [];
            var arr_ID_Parents_Tamp = [];
            var arrNode = $("#jstree_div").jstree(true).get_json("#", {
                flat: true,
            });

            if (arrNode == undefined) {
                if (arrNode.length <= 0) {
                    return;
                }
            }

            // Get order parent Start
            var idParent = selectedNode.node.parent;
            arr_ID_Parents.push(idParent);
            // arr_ID_Parents.push(selectedNode.node.id);
            var cnt = 0;
            while (true) {
                cnt++;
                if (cnt == 1000) {
                    break;
                }
                var node = $("#jstree_div").jstree(true).get_node(idParent);
                idParent = node.parent;
                node = $("#jstree_div").jstree(true).get_node(idParent);

                if (idParent == "#") {
                    break;
                } else {
                    if (idParent != null && idParent != undefined) {
                        arr_ID_Parents.push(idParent);
                    }
                }

                if (selectedNode.node.parent == "#") {
                    break;
                }
            }
            arr_ID_Parents = arr_ID_Parents.reverse();
            // Get order parent End

            // reset all nodes to black text Start
            if (array_key_store_node.length > 0) {
                $.each(array_key_store_node, function (index, value) {
                    $("#" + value).css({
                        color: "black",
                        "background-color": "",
                    });
                });
            }
            array_key_store_node = [];
            // reset all nodes to black text End

            // set color of all parents Start
            cur_pathFolder = "";

            $.each(arr_ID_Parents, function (index, valueID) {
                if (valueID == "#") {
                    return;
                }

                var nodeF1 = $("#jstree_div").jstree(true).get_node(valueID);
                var cntt = 1;
                $("#" + valueID)
                    .find("a")
                    .each(function () {
                        if (cntt == 1) {
                            cntt++;
                            var aTag = $(this);
                            array_key_store_node.push(aTag.attr("id"));
                            aTag.css({
                                color: "yellow",
                                "background-color": "blue",
                            });
                        }
                    });

                textP = textP + "/" + nodeF1.text;
                cur_pathFolder =
                    cur_pathFolder + (cur_pathFolder === "" ? "" : " > ") + nodeF1.text;
            });

            var cntt = 1;
            $("#" + selectedNode.node.id)
                .find("a")
                .each(function () {
                    if (cntt == 1) {
                        cntt++;
                        var aTag = $(this);
                        array_key_store_node.push(aTag.attr("id"));
                        aTag.css({
                            color: "yellow",
                            "background-color": "blue",
                        });
                    }
                });
            // set color of all parents End

            cur_pathFolder = cur_pathFolder + " > " + selectedNode.node.text;
            cur_folderID = selectedNode.node.id;
            cur_folderName = selectedNode.node.text;
            $("#path_folder").html(cur_pathFolder);

            textP = textP + "/" + selectedNode.node.text;
            $("#txtShowSelectedNote").text(textP);

            // open form task detail
            if (typeName == "folder") {
                GV_STORE_TASK_GRP_TASK_DETAIL.arr_ID_Parents_Folder = array_key_store_node;
                GV_STORE_TASK_GRP_TASK_DETAIL.cur_pathFolder = cur_pathFolder;
                GV_STORE_TASK_GRP_TASK_DETAIL.cur_folderID = cur_folderID;
                GV_STORE_TASK_GRP_TASK_DETAIL.cur_folderName = cur_folderName;
                $("#11111").hide();
                $("#tab_showtask").hide();
                ShowListTitleWhenClickOnFolder(cur_folderID);
            }
        }
    } // end function HandleClickFolderOnTree

    // call in HandleClickFolderOnTree()
    function ShowListTitleWhenClickOnFolder(__cur_folderID) {
        var data = {
            folder_id: __cur_folderID,
        };
        $("#spinner_show_wait_signup_title").show();
        // get data
        // SERVER USING : let dataXXX = JSON.parse(req.query.data);
        // SERVER USING : let id = dataXXX.id;
        axios
            .get(GV_Server_Address + "/GetTitleByFolderID", {
                params: {
                    data,
                },
            })
            .then(function (response) {
                if (response.errno != undefined) {
                    // ERR
                    $("#spinner_show_wait_signup_title").delay(1000).hide(0);
                } else {
                    // SUCCESS

                    var listData = response.data;
                    $("#list_title_in_one_folder").empty();
                    $.each(listData, function (index, data) {
                        var id = data.id;

                        var template = `
                                <li id='${data.id}' class="SignUp list-group-item list-group-item-action" data-toggle="list">
                                    <a class="text-white btn-floating btn-slack btn-sm"><i class="fas fa-bicycle"></i></a>${data.title_text}
                                </li>
                        `;
                        $("#list_title_in_one_folder").append(template);
                    });

                    // Set event after create ITEM Active for LI item - Title
                    $(".list-group-item-action").click(function (e) {
                        HandleClickOn_Each_Title($(this));
                    });
                    $("#spinner_show_wait_signup_title").delay(1000).hide(0);
                } // }// end else SUCCESS
            })
            .catch(function (error) {
                $("#spinner_show_wait_signup_title").delay(1000).hide(0);
            });
    }
    // end function ShowListTitleWhenClickOnFolder

    // call in $(".list-group-item-action").click(function(e)
    function HandleClickOn_Each_Title(li_item) {

        $('#modalFullCoverLoader').show();
        $("#div_list_title_in_one_folder")
            .find("ul li")
            .each(function () {
                var LI_item = $(this);
                LI_item.removeClass("active");
            });

        li_item.addClass("active");
        cur_titleID = li_item.attr("id");

        $("#tab_showtask").fadeIn(200);
        $("#11111").fadeIn(500);

        ShowGrpTaskAndTaskDetail();
    }

    // call in main() document
    // call in $('#create_task_group_btn_create').click(function(e)
    // call in $('#create_task_group_detail_btn_create').click(function(e)
    function ShowGrpTaskAndTaskDetail() {
        var data = {
            folder_id: cur_folderID,
            title_id: cur_titleID,
        };
        // get data
        // SERVER USING : let dataXXX = JSON.parse(req.query.data);
        // SERVER USING : let id = dataXXX.id;
        axios
            .get(GV_Server_Address + "/getTaskGrpAndTaskDetailWhenClickOnTitle", {
                params: {
                    data,
                },
            })
            .then(function (response) {
                if (response.data.errno != undefined) {
                    // ERR
                    $('#modalFullCoverLoader').hide();
                } else {

                    var data_TASK_GROUP_DETAIL = response.data[1];
                    var list_task_grp_dtl_id = '';
                    var cntGrpDtl = 0;

                    $.each(data_TASK_GROUP_DETAIL, function (index, TASK_GROUP_DETAIL) {
                        cntGrpDtl++;
                        if (data_TASK_GROUP_DETAIL.length == cntGrpDtl) {
                            list_task_grp_dtl_id = list_task_grp_dtl_id + `'${TASK_GROUP_DETAIL.TASK_GROUP_DETAIL_ID}'`;
                        } else {
                            list_task_grp_dtl_id = list_task_grp_dtl_id + `'${TASK_GROUP_DETAIL.TASK_GROUP_DETAIL_ID}', `;
                        }
                    });

                    // Get notify by task_grp_detail_id and user_login_id START

                    var data = {
                        list_task_grp_dtl_id: list_task_grp_dtl_id,
                        user_login_id: GV_STORE_SIGN_IN_INFO.id,
                    };
                    // get data
                    // SERVER USING : let dataXXX = JSON.parse(req.query.data);
                    // SERVER USING : let id = dataXXX.id;
                    axios
                        .get(GV_Server_Address + '/get_Notify_By_TaskDtlID_And_userLogin', {
                            params: {
                                data,
                            },
                        })
                        .then(function (response2) {
                            if (response2.errno != undefined) {
                                // ERR
                            } else {
                                // SUCCESS
                                //GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin = response2.data;
                                response.list_notify = response2.data;
                                HandleAfterGetDataForTaskGrpAndTaskDetailWhenClickOnTitle(response);
                            } // }// end else SUCCESS
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    // Get notify by task_grp_detail_id and user_login_id END



                } // end else SUCCESS


            })
            .catch(function (error) {
                $('#modalFullCoverLoader').hide();
            });

        // tab_showtask
    }

    function HandleAfterGetDataForTaskGrpAndTaskDetailWhenClickOnTitle(response) {
        // SUCCESS
        var data_TASK_GROUP = response.data[0];
        var data_TASK_GROUP_DETAIL = response.data[1];
        var data_TASK_GROUP_DETAIL_USER = response.data[2];
        var data_NOTIFY_IN_CMT = response.list_notify;

        $("#tab_showtask tr").remove();
        $(".btn_create_task_group").remove();
        var idTaskHdr = 0;

        // add group when click on folder START
        if (data_TASK_GROUP.length > 0) {
            $.each(data_TASK_GROUP, function (index, TASK_GROUP) {
                idTaskHdr++;
                var textTime = GF_Ex_ParseTime(
                    TASK_GROUP.create_datetime,
                    "dd-MM-yyyy hh:mm:mili"
                );
                var template = `
              <tr style="background-color:rgb(21, 151, 75); color: white;">

                  <td colspan="1" style="font-size: larger;">1</td>
                  <td colspan="4" style="font-size: larger;" class="text-left">${TASK_GROUP.group_name}, tạo lúc : ${textTime}</td>
                  <td colspan="1" style="padding: 0px !important; margin: 0px !important;"><button type="button" id="${TASK_GROUP.id}" class="btn_create_task_group btn btn-success px-3 waves-effect waves-light" data-toggle="" data-target="#modalRegisterTaskGroup"><i class="far fa-user pr-2"></i>THÊM NHÓM</button></td>
              </tr>

              <tr id="row_header_${TASK_GROUP.id}"  group_id="" class="row_task_header" style="background-color: deepskyblue;">
                  <th style="width:50px;">Status</th>
                  <th style="width:300px;" class="text-left"><i class="fas fa-comment-dollar black-text"></i> Topic</th>
                  <th style="width:200px;"><i class="fas fa-users black-text"></i> Người tham gia </th>
                  <th style="width:20px;"><i class="fas fa-chalkboard-teacher black-text"></i> </th>
                  <th style="width:20px;"><i class="fas fa-chalkboard-teacher black-text"></i></th>
                  <th><button type="button" group_id="${TASK_GROUP.id}" group_name="${TASK_GROUP.group_name}" folder_id="${TASK_GROUP.folder_id}" id_row_task_header = "task_header_${idTaskHdr}" class="btn_add_on_task_header btn btn-primary px-3 waves-effect waves-light" data-toggle="" data-target="#modalRegisterTaskGroupDetail"><i class="far fa-user pr-2 "></i>THÊM CV</button></th>
              </tr>`;

                $("#tab_showtask tbody").append(template);
            });
        } else {
            $(`<button type="button" id="11111" class="btn_create_task_group btn btn-success px-3 waves-effect waves-light" data-toggle=""
                data-target="#modalRegisterTaskGroup"><i class="far fa-user pr-2"></i>THÊM NHÓM</button>`).insertAfter(
                "#path_folder"
            );
        }
        // add group when click on folder END

        // add task detail to group when click on folder START
        idTaskHdr = 0;
        if (data_TASK_GROUP_DETAIL.length > 0) {
            $.each(data_TASK_GROUP_DETAIL, function (index, TASK_GROUP_DETAIL) {
                idTaskHdr++;
                var textTime = GF_Ex_ParseTime(
                    TASK_GROUP_DETAIL.TASK_GRP_DTL_CREATE_TIME,
                    "dd-MM-yyyy hh:mm:mili"
                );
                var grp_id = TASK_GROUP_DETAIL.group_id;
                var task_grp_dtl_name = TASK_GROUP_DETAIL.task_grp_dtl_name;

                var creator = $.grep(array_ALL_user, function (n, i) {
                    return n.id == TASK_GROUP_DETAIL.creator_id;
                })[0];

                var create_time = textTime;

                // find list user in task group
                var listUserInTaskGrpDetail = $.grep(
                    data_TASK_GROUP_DETAIL_USER,
                    function (n, i) {
                        return (
                            n.TASK_GROUP_DETAIL_ID ==
                            TASK_GROUP_DETAIL.TASK_GROUP_DETAIL_ID
                        );
                    }
                );

                // Set list name in html START
                var index = 0;
                var templateName = "";
                $.each(listUserInTaskGrpDetail, function (indexUser, user) {
                    index++;
                    var backgroundColor =
                        index == 1 ?
                            "badge blue" :
                            index == 2 ?
                                "badge red" :
                                index == 3 ?
                                    "badge badge-secondary" :
                                    index == 4 ?
                                        "badge green" :
                                        "";

                    index = index == 4 ? 0 : index;

                    var name = user.displayName;
                    if (name == "" || name == null || name == undefined) {
                        name = user.lastname + " " + user.firstname;
                    }

                    templateName =
                        templateName +
                        `<a href="#" class="${backgroundColor} text-left text-wrap font-weight-bold blue-text">${name}</a>\n`;
                });
                // Set list name in html END

                // Get text nofity START
                var notifyText = '';
                var list_task_grp_dtl_id = '';
                var cntNotifyInDetail = 0;
                var listNotifyInDetail = $.grep(
                    data_NOTIFY_IN_CMT,
                    function (notify, i) {
                        return (
                            notify.task_grp_detail_id ==
                            TASK_GROUP_DETAIL.TASK_GROUP_DETAIL_ID
                        );
                    }
                );

                if (listNotifyInDetail != undefined && listNotifyInDetail.length > 0) {
                    cntNotifyInDetail = listNotifyInDetail.length;
                }

                if (cntNotifyInDetail > 0) {
                    notifyText = `<span class="badge badge-danger">Thông báo (${cntNotifyInDetail})</span>`;
                }

                // Get text nofity END

                var template = `
                                    <tr>
                                        <td class="text-center" scope="row">
                                            <i class="fas fa-reply purple-text"></i>
                                        </td>
                                        <td class="text-left text-wrap">

                                            <a href="${GV_link_detail}" group_id="${TASK_GROUP_DETAIL.group_id}" group_name="${TASK_GROUP_DETAIL.group_name}" task_detail_name="${TASK_GROUP_DETAIL.task_grp_dtl_name}" creator_name='${creator.displayName}' creator_time='${create_time}' task_grp_detail = ${TASK_GROUP_DETAIL.TASK_GROUP_DETAIL_ID} class="show_task_grp_detail font-weight-bold blue-text">${task_grp_dtl_name}  ${notifyText}</a>
                                            <div>
                                                <span class="badge purple ">Người tạo : ${creator.displayName}</span></br>
                                                <span class="badge badge-info">Lúc : ${create_time}</span>
                                            </div>
                                        </td>

                                        <td class="text-left text-wrap">
                                                ${templateName}
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td style="padding: 0px !important; margin: 0px !important; "></td>
                                    </tr>
                     `;
                var idRowHdr = "#row_header_" + grp_id;
                $(template).insertAfter(idRowHdr);
            });
        }
        // add task detail to group when click on folder END

        $(".btn_create_task_group").click(
            (store_func_btn_create_task_group = function (e) {
                var btn = $(this);
                HandleClickOnBtnShowModalCreate_task_group(btn);
            })
        );

        $(".btn_add_on_task_header").click(
            (store_func_btn_add_on_task_header = function (e) {
                var btn = $(this);
                HandleClickOnBtnShowModalCreate_task_group_detail(btn);
            })
        );

        $(".show_task_grp_detail").click(function (e) {
            var adddressInFo = $(this);
            HandleClickOnTaskDetail(adddressInFo);
        });

        $('#modalFullCoverLoader').hide();
    }

    // call in ShowGrpTaskAndTaskDetail
    //  $('.btn_create_task_group').click(store_func_btn_create_task_group = function(e)
    function HandleClickOnBtnShowModalCreate_task_group(btn) {
        if (cur_pathFolder == "") {
            GF_ShowToastrWarning("CHỌN 1 FOLDER ĐỂ TẠO NHÓM");
            return;
        }

        // show modal register task group
        btn.attr("data-toggle", "modal");
        $("#create_task_group_path_folder").html(cur_pathFolder);
        $("#create_task_group_creator").html(
            "*Người tạo : " + GV_STORE_SIGN_IN_INFO.full_name
        );
        $("#create_task_group_timeCreate").html(
            "*Thời gian tạo : " + GF_GetDateFrom_SysDate(2)
        );

        $("#create_task_group_txt_grp_name").val("");
        $("#create_task_group_txt_grp_name").focus();
    }

    // call in ShowGrpTaskAndTaskDetail
    // $('.btn_add_on_task_header').click(store_func_btn_add_on_task_header = function(e)
    function HandleClickOnBtnShowModalCreate_task_group_detail(btn) {
        var folder_id = cur_folderID;
        var folder_name = cur_folderName;
        var group_id = btn.attr("group_id");
        var group_name = btn.attr("group_name");
        var creator_id = GV_STORE_SIGN_IN_INFO.id;
        var idRowHdr = "#" + btn.attr("id_row_task_header");

        $("#create_task_group_detail_btn_create").attr("group_id", group_id);

        $("#create_task_group_detail_path_folder").html(cur_pathFolder);
        $("#create_task_group_detail_grp_name").html("NHÓM : " + group_name);
        $("#create_task_group_detail_creator").html(
            "*Người tạo : " + GV_STORE_SIGN_IN_INFO.full_name
        );
        $("#create_task_group_detail_timeCreate").html(
            "*Thời gian tạo : " + GF_GetDateFrom_SysDate(2)
        );

        // Clear all USER before
        // $("#modal_task_grp_detail_show_list_check_user").find('input[type="checkbox"]').each(function() {
        //     $(this).remove();

        // });
        $("#modal_task_grp_detail_show_list_check_user")
            .find(".modal_sign_up_task_grp_detail_checkbox_selected_user")
            .each(function () {
                $(this).remove();
            });

        // user add checkbox list START
        $.each(array_ALL_user, function (index, user) {
            var fullname = user.displayName;
            if (fullname == "" || fullname == undefined) {
                fullname = user.lastname + " " + user.firstname;
            }

            var template = `
                    <div class="form-check modal_sign_up_task_grp_detail_checkbox_selected_user">
                            <input type="checkbox" class="form-check-input" id="${user.id}">
                            <label class="form-check-label" for="${user.id}"> <i class="fas fa-user prefix grey-text"></i> ${fullname}</label>
                    </div>`;

            if (user.id == GV_STORE_SIGN_IN_INFO.id) {
                template = `
                <div class="form-check modal_sign_up_task_grp_detail_checkbox_selected_user disabled">
                <span class="badge badge-info">BẠN</span>
                        <input type="checkbox" class="form-check-input" id="${user.id}" checked>
                        <label class="form-check-label" for="${user.id}"> <i class="fas fa-user prefix grey-text"></i> ${fullname}</label>
                </div>`;
            }

            $(template).insertAfter("#modal_task_grp_detail_show_list_check_user h5");
        });
        // user add checkbox list END

        // // Checked box for Creator as default when open modal START
        // // in modal find : [modal]-> [class in div] -> [input]
        // $("#modal_task_grp_detail_show_list_check_user")
        //     .find(".modal_sign_up_task_grp_detail_checkbox_selected_user")
        //     .each(function() {
        //         $(this)
        //             .find("input")
        //             .each(function() {
        //                 var idCheckBox_UserID = $(this).attr("id");

        //                 if (GV_STORE_SIGN_IN_INFO.id == idCheckBox_UserID) {
        //                     $(this).prop("checked", true);
        //                     return;
        //                 }
        //             });
        //     });
        // // Checked box for Creator as default when open modal END

        btn.attr("data-toggle", "modal");
    }

    function HandleClickOnTaskDetail(adddressInFo) {
        var task_grp_detail = adddressInFo.attr("task_grp_detail");
        var creator_name = adddressInFo.attr("creator_name");
        var creator_time = adddressInFo.attr("creator_time");

        var group_id = adddressInFo.attr("group_id");
        var group_name = adddressInFo.attr("group_name");
        var task_detail_name = adddressInFo.attr("task_detail_name");

        GV_STORE_TASK_GRP_TASK_DETAIL.cur_titleID = cur_titleID;
        GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail = task_grp_detail;
        GV_STORE_TASK_GRP_TASK_DETAIL.creator_name = creator_name;
        GV_STORE_TASK_GRP_TASK_DETAIL.creator_time = creator_time;

        GV_STORE_TASK_GRP_TASK_DETAIL.group_id = group_id;
        GV_STORE_TASK_GRP_TASK_DETAIL.group_name = group_name;
        GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id = task_grp_detail;
        GV_STORE_TASK_GRP_TASK_DETAIL.task_detail_name = task_detail_name;
        GV_STORE_TASK_GRP_TASK_DETAIL.User_login_id = GV_STORE_SIGN_IN_INFO.id;
        GV_STORE_TASK_GRP_TASK_DETAIL.creator_id = GV_STORE_SIGN_IN_INFO.id;
        GV_STORE_TASK_GRP_TASK_DETAIL.accesstoken = accesstoken;
        GV_STORE_TASK_GRP_TASK_DETAIL.verifyGoogleAcc = "false";
        GV_STORE_TASK_GRP_TASK_DETAIL.GG_googleID = googleID;
        GV_STORE_TASK_GRP_TASK_DETAIL.GG_pic_url = pic_url;
        GV_STORE_TASK_GRP_TASK_DETAIL.GG_email = email;
        GV_STORE_TASK_GRP_TASK_DETAIL.authority_code = GV_STORE_SIGN_IN_INFO.authority_code;

        GV_STORE_TASK_GRP_TASK_DETAIL.full_name = GV_STORE_SIGN_IN_INFO.full_name; // login_name
        GV_STORE_TASK_GRP_TASK_DETAIL.CmtDetailTextID = '';
        GV_STORE_TASK_GRP_TASK_DETAIL.CmtDetailText = '';
        GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHeader = '';
        GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHtml = '';

        GF_SetjStorage(GV_KEY_STORE_TASK_GRP_TASK_DETAIL, GV_STORE_TASK_GRP_TASK_DETAIL);

        // $.jStorage.deleteKey(GV_KEY_STORE_TASK_GRP_TASK_DETAIL);
    }
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////  END LOCAL FUNCTION
    ////////////////////////////////////////////////

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////  START EVENT
    ////////////////////////////////////////////////

    $("#btn_signOut").click(function (e) {
        GF_HandleSignOut();
    });

    $("#btn_add_title").click(function (e) {
        var btn_add_title = $("#btn_add_title");
        var txtTitleText = $("#txt_add_title");
        var d = GetSysDate();
        var t = GetSysTime();
        btn_add_title.hide();

        if (cur_folderID == "") {
            $("#title_sign_up_fail").show();
            $("#title_sign_up_fail").html("Chưa chọn Folder !");
            $("#title_sign_up_fail").fadeOut(1000);
            btn_add_title.delay(1000).show(0);
            return;
        }
        if (txtTitleText.val() == "") {
            $("#title_sign_up_fail").show();
            $("#title_sign_up_fail").html("Chủ đề trống !");
            $("#title_sign_up_fail").fadeOut(1000);
            btn_add_title.delay(1000).show(0);
            txtTitleText.focus();
            return;
        }
        var id_Title = GenUserID();

        var data = {
            id: id_Title,
            folder_id: cur_folderID,
            creator_id: GV_STORE_SIGN_IN_INFO.id,
            title_text: txtTitleText.val(),
            updatedate: d,
            updatetime: t,
            create_datetime: d + t,
        };
        // creator_id: GV_STORE_SIGN_IN_INFO.user_id,
        // post data
        // in SERVER get data USING :  req.body.data
        axios
            .post(GV_Server_Address + "/insertTitle", {
                data: data,
            })
            .then(function (response) {
                if (response.errno != undefined) {
                    // ERR

                    $("#title_sign_up_fail").show();
                    $("#title_sign_up_fail").fadeOut(1000);
                    btn_add_title.fadeIn(2000);
                } else {
                    // SUCCESS
                    var dd = "123";
                    $("#title_sign_up_success").show();
                    $("#title_sign_up_success").fadeOut(1000);
                    btn_add_title.fadeIn(2000);

                    var template = `
                    <li id=${id_Title} class="SignUp list-group-item list-group-item-action" data-toggle="list">
                         <a class="text-white btn-floating btn-slack btn-sm"><i class="fas fa-bicycle"></i></a>${txtTitleText.val()}
                    </li>
                    `;

                    txtTitleText.val("");
                    $("#list_title_in_one_folder").append(template);
                    txtTitleText.focus();

                    // Set event after create ITEM Active for LI item - Title
                    $(".list-group-item-action").click(function (e) {
                        HandleClickOn_Each_Title($(this));
                    });
                } // }// end else SUCCESS
            })
            .catch(function (error) {
                $("#title_sign_up_fail").show();
                $("#title_sign_up_fail").fadeOut(1000);
                btn_add_title.fadeIn(2000);
            });
    });

    $(".table-add").on("click", "i", () => {
        var txtAddFile = $("#txtAddFile");
        if (txtAddFile.val().length <= 3) {
            var checkInputAddFile = $("#checkInputAddFile");
            checkInputAddFile.html(
                `<strong style="color:red;">ten file lon hon 3</strong>`
            );
            return;
        }

        const $tableID = $("#tbListFile");
        const $clone = $tableID
            .find("tbody tr")
            .last()
            .clone(true)
            .removeClass("hide table-line");
        var rowCountNotHeader = $("#tbListFile tr").length - 1;

        var newTr = ` <tr>
                    <th scope="row">

                        <span class="badge blue mx-1">${rowCountNotHeader + 1
            }</span>
                    </th>
                    <td class="text-left">
                    <i class="fas fa-reply purple-text"></i>
                        <a href="https://mdbootstrap.com/support/react/react-router-v6/"
                            class="font-weight-bold blue-text">${txtAddFile.val()}</a>
                    </td>
                   </tr>`;

        $("tbody").append(newTr);
        txtAddFile.val("");
    });

    $("#txtAddFile").on("change keydown paste input", function () {
        var checkInputAddFile = $("#checkInputAddFile");
        var txtAddFile = $("#txtAddFile");
        if (txtAddFile.val().length <= 3) {
            checkInputAddFile.html(
                `<strong style="color:red;">ten file lon hon 3</strong> `
            );
        } else {
            checkInputAddFile.html(`<strong style="color:red;"></strong> `);
        }
    });

    //alert($(window).width());

    var card = $("#cardHoldListTable");

    var winW = $(window).width();
    $("#texttexttex1").val("AA " + winW);

    // var MaxMediumWidth = 768;
    // if (winW < MaxMediumWidth) {
    //     card.animate({ 'zoom': 0.4 }, 400);
    //     alert("1 " + winW);
    // } else {
    //     card.animate({ 'zoom': 1 }, 400);
    //     alert("2 " + winW);
    // }

    // for button create ttask group in modal create task group
    $("#create_task_group_btn_create").click(function (e) {
        if ($("#create_task_group_txt_grp_name").val().trim() == "") {
            GF_ShowToastrWarning("TÊN NHÓM KHÔNG ĐƯỢC ĐỂ TRỐNG");
            $("#create_task_group_txt_grp_name").val("");
            $("#create_task_group_txt_grp_name").focus();
            return;
        }

        var d = GetSysDate();
        var t = GetSysTime();
        var id = GenUserID();

        var data = {
            id: id,
            creator_id: GV_STORE_SIGN_IN_INFO.id,
            folder_id: cur_folderID,
            title_id: cur_titleID,
            group_name: $("#create_task_group_txt_grp_name").val(),
            updatedate: d,
            updatetime: t,
            create_datetime: d + t,
        };
        // post data
        // in SERVER get data USING :  req.body.data
        axios
            .post(GV_Server_Address + "/addtaskgroup", {
                data: data,
            })
            .then(function (response) {
                if (response.errno != undefined) {
                    // ERR
                } else {
                    // SUCCESS

                    GF_ShowToastrSuccess("ĐĂNG KÍ THÀNH CÔNG");
                    var date = new Date();

                    $("#create_task_group_path_folder").html(cur_pathFolder);
                    $("#create_task_group_creator").html(
                        "*Người tạo : " + GV_STORE_SIGN_IN_INFO.full_name
                    );
                    $("#create_task_group_timeCreate").html(
                        "*Thời gian tạo : " +
                        date.getDate() +
                        "-" +
                        (date.getMonth() + 1) +
                        "-" +
                        date.getFullYear() +
                        " " +
                        date.getHours() +
                        ":" +
                        date.getMinutes()
                    );

                    ShowGrpTaskAndTaskDetail();
                    $("#create_task_group_txt_grp_name").val("");
                    $("#create_task_group_txt_grp_name").focus();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    $("#create_task_group_detail_btn_create").click(function (e) {
        if ($("#create_task_group_detail_txt_grp_name").val().trim() == "") {
            GF_ShowToastrWarning("TÊN CÔNG VIỆC KHÔNG ĐƯỢC ĐỂ TRỐNG !!");
            $("#create_task_group_detail_txt_grp_name").val("");
            $("#create_task_group_detail_txt_grp_name").focus();
            return;
        }

        var btn = $(this);
        var folder_id = cur_folderID;
        var folder_name = cur_folderName;
        var group_id = btn.attr("group_id");
        var creator_id = GV_STORE_SIGN_IN_INFO.id;
        var listUserID_Checked = [];

        var d = GetSysDate();
        var t = GetSysTime();
        var id = GenUserID();

        $("#modal_task_grp_detail_show_list_check_user")
            .find(".modal_sign_up_task_grp_detail_checkbox_selected_user")
            .each(function () {
                $(this)
                    .find("input")
                    .each(function () {
                        var idCheckBox_UserID = $(this).attr("id");
                        if ($(this).prop("checked") == true) {
                            var id11 = GenUserID();
                            idCheckBox_UserID = idCheckBox_UserID + "__" + id11.toString();
                            listUserID_Checked.push(idCheckBox_UserID);
                        }
                    });
            });

        if (listUserID_Checked.length <= 1) {
            GF_ShowToastrWarning("CHỌN NGƯỜI THAM GIA");
            return;
        }

        var data = {
            id: id,
            creator_id: creator_id,
            folder_id: folder_id,
            title_id: cur_titleID,
            group_id: group_id,
            task_grp_name: $("#create_task_group_detail_txt_grp_name").val(),
            listUser: listUserID_Checked,
            updatedate: d,
            updatetime: t,
            create_datetime: d + t,
        };

        // post data
        // in SERVER get data USING :  req.body.data
        axios
            .post(GV_Server_Address + "/addtaskgroupDetail", {
                data: data,
            })
            .then(function (response) {
                if (response.errno != undefined) {
                    // ERR
                    GF_ShowToastrWarning("THÊM THẤT BẠI !!");
                } else {
                    // SUCCESS

                    // set UNCHECK for all check box Start
                    $("#modal_task_grp_detail_show_list_check_user")
                        .find(".modal_sign_up_task_grp_detail_checkbox_selected_user")
                        .each(function () {
                            $(this)
                                .find("input")
                                .each(function () {
                                    var idCheckBox_UserID = $(this).attr("id");

                                    if (idCheckBox_UserID == GV_STORE_SIGN_IN_INFO.id) {
                                        $(this).prop("checked", true);
                                    } else {
                                        $(this).prop("checked", false);
                                    }
                                });
                        });
                    // set UNCHECK for all check box End

                    GF_ShowToastrSuccess("ĐĂNG KÍ THÀNH CÔNG");
                    var date = new Date();

                    $("#create_task_group_detail_path_folder").html(cur_pathFolder);
                    $("#create_task_group_detail_grp_name").html("NHÓM : " + folder_name);
                    $("#create_task_group_detail_creator").html(
                        "*Người tạo : " +
                        GV_STORE_SIGN_IN_INFO.full_name
                    );
                    $("#create_task_group_detail_timeCreate").html(
                        "*Thời gian tạo : " + GF_GetDateFrom_SysDate(2)
                    );

                    ShowGrpTaskAndTaskDetail();
                    $("#create_task_group_detail_txt_grp_name").val("");
                    $("#create_task_group_detail_txt_grp_name").focus();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    });


    $("#btn_open_uermanager_page").click(function (e) {

        if (
            $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) == null ||
            $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) == undefined
        ) {
            GV_STORE_TASK_GRP_TASK_DETAIL = {};
            GV_STORE_TASK_GRP_TASK_DETAIL.GG_email = email;
            GV_STORE_TASK_GRP_TASK_DETAIL.full_name = full_name;
            GV_STORE_TASK_GRP_TASK_DETAIL.User_login_id = id;
            GF_SetjStorage(GV_KEY_STORE_TASK_GRP_TASK_DETAIL, GV_STORE_TASK_GRP_TASK_DETAIL);
        }

        location.href = GV_link_userManager;

    });


    ////////////////////////////////////////////////
    ////////////////////////////////////////////////  END EVENT
    ////////////////////////////////////////////////
});