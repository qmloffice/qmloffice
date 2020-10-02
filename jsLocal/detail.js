$(document).ready(function() {

    //$('#modalFullCoverLoader').show();

    if (
        $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) == null ||
        $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) == undefined
    ) {
        location.href = GV_Server_Address + GV_auth_google;
    }

    var templateTableListuser = `
            <h4>Người Tham Gia</h4>
            <div style="display: block">
                <table id="table_show_list_user_in_task_detail" class="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ Tên</th>
                            <th>Phone 1</th>
                            <th>Phone 2</th>
                            <th>Email</th>
                            <th>Địa Chỉ</th>
                            <th>Ngày Tham gia</th>
                            <th>THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>STT</td>
                            <td>Họ Tên</td>
                            <td>Phone 1</td>
                            <td>Phone 2</td>
                            <td>Email</td>
                            <td>Địa Chỉ</td>
                            <td>Ngày Tham gia</td>
                            <th>THAO TÁC</th>
                        </tr>
                    </tbody>
                </table>
            </div>
    `;

    var list_user_in_detail = [];
    var cur_task_grp_detail_object = undefined;
    let data_USER_AfterGet = [];

    $("#textarea_add_cmt").richText();



    GV_STORE_TASK_GRP_TASK_DETAIL = $.jStorage.get(
        GV_KEY_STORE_TASK_GRP_TASK_DETAIL
    );



    // GV_STORE_TASK_GRP_TASK_DETAIL= {} below
    // CmtDetailText: ""
    // CmtDetailTextID: ""
    // EmailContainHeader: ""
    // EmailContainHtml: ""
    // GG_email: "lqvinh.hsu@gmail.com"
    // GG_googleID: "113486759599812914431"
    // GG_pic_url: "https://lh5.googleusercontent.com/-nTxSsnx2qqs/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclQYhNHIYWpskXpA_ajPTOEatYLWA/photo.jpg"
    // User_login_id: "113486759599812914431"
    // accesstoken: "ya29.a0AfH6SMCxuSgSv9hdW32usVLnmlT0UeNCdEiaSjw3Y_OGMtn6q9YY9lIMdMq9K7XfEjCEFU2iVAmDVtmyGfu-65InY_BtaO3tD3jFggxAeVcFrxrSoXSDaaBDLuMItCI_RYmTT3LGZS4TjOZhU-ll3isKcivliZwPHKU"
    // arr_ID_Parents_Folder: (7) ["ajson2_anchor", "j1_4_anchor", "202008162222330796_202009170012430051___j1_5_anchor", "202008162222330796_202009170012500371___j1_6_anchor", "j1_8_anchor", "202008162222330796_202009170013100867___j1_11_anchor", "202008162222330796_202009170013130243___j1_12_anchor"]
    // authority_code: "1"
    // creator_id: "113486759599812914431"
    // creator_name: "Vinh Lam"
    // creator_time: "17-09-2020 09:48:20"
    // cur_folderID: "202008162222330796_202009170013130243___j1_12"
    // cur_folderName: "10"
    // cur_pathFolder: "ALL > 2 > 3 > 4 > 6 > 9 > 10"
    // cur_titleID: "202009170946500975"
    // full_name: "Vinh Lam"
    // group_id: "202009170948100983"
    // group_name: "890890890"
    // task_detail_name: "89090"
    // task_grp_detail: "202009170948200822"
    // task_grp_detail_id: "202009170948200822"
    // verifyGoogleAcc: "false"

    $('#info_source_img').attr('src', GV_STORE_TASK_GRP_TASK_DETAIL.GG_pic_url);
    // 

    var label_user = '<span class="badge badge-danger">ADMIN</span>';
    if (GV_STORE_TASK_GRP_TASK_DETAIL.authority_code != GV_AUT_CODE_MASTER) {

        label_user = '<span class="badge badge-success">STAFF</span>';
    }

    $('#info_email_name').html(`${label_user} ${GV_STORE_TASK_GRP_TASK_DETAIL.full_name} (${GV_STORE_TASK_GRP_TASK_DETAIL.GG_email})`);
    CheckUserIsdeleted_And_Init_Control(GV_STORE_TASK_GRP_TASK_DETAIL.User_login_id, GV_STORE_TASK_GRP_TASK_DETAIL.GG_email);


    var setsetIntervalCheckUserIsdeleted = setInterval(function() {
        CheckUserIsdeleted(GV_STORE_TASK_GRP_TASK_DETAIL.User_login_id, GV_STORE_TASK_GRP_TASK_DETAIL.GG_email);
    }, 10000)


    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////         function START
    ////////////////////////////////////////////////////

    var tableUserInTaskDetail;
    var list_user_need_update = [];

    function CheckUserIsdeleted_And_Init_Control(_idUser, _email) {

        if (GV_STORE_TASK_GRP_TASK_DETAIL.authority_code != GV_AUT_CODE_MASTER) {

            $('#task_dtl_btn_AddUser_from_Selected').hide();
            $('#task_dtl_div_selected_user').hide();
            // 
        }



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
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    $('#holder_info_1').html(``);

                } else {
                    // SUCCESS
                    if (response.data.length <= 0) {
                        $('#holder_info_1').html(``);
                        location.href = GV_Server_Address + GV_auth_google;
                    } else if (response.data[0].delete_system == '1') {
                        $('#holder_info_1').html(``);
                    } else {

                        InitControl();
                    }
                } // }// end else SUCCESS
            })
            .catch(function(error) {
                $('#holder_info_1').html(``);
            });
    }

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
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    location.href = GV_Server_Address + GV_auth_google;
                } else {
                    // SUCCESS
                    if (response.data.length <= 0) {
                        location.href = GV_Server_Address + GV_auth_google;
                    } else if (response.data[0].delete_system == '1') {
                        clearInterval(setsetIntervalCheckUserIsdeleted);
                        $('#holder_info_1').html(``);
                        $("#info_email_name").html(`QML: Xin Chào ${_email}, <span class="badge badge-pill pink"><i class="fas fa-wheelchair" aria-hidden="true"></i> bạn không thể hoạt động được nữa.</span>`);
                    }
                } // }// end else SUCCESS
            })
            .catch(function(error) {
                location.href = GV_Server_Address + GV_auth_google;
            });
    }



    function InitControl() {
        GF_CheckAccGoogleAvaibleNow(GV_STORE_TASK_GRP_TASK_DETAIL.accesstoken);


        $("#path_folder").html(GV_STORE_TASK_GRP_TASK_DETAIL.cur_pathFolder);
        $("#group_name").html("NHÓM : " + GV_STORE_TASK_GRP_TASK_DETAIL.group_name);
        $("#task_detail_name").html(
            "CÔNG VIỆC : " + GV_STORE_TASK_GRP_TASK_DETAIL.task_detail_name
        );

        $("#creator_create_time").html(
            "Được tạo bởi :" +
            GV_STORE_TASK_GRP_TASK_DETAIL.creator_name +
            ", Lúc : " +
            GV_STORE_TASK_GRP_TASK_DETAIL.creator_time
        );
        $("#MoTaChung").val("MoTaChung");

        Get_description_general_Intask_grp_detail(
            GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id
        );

        CreateSelectedListUserAndTableListUserInTaskDetail(
            GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id
        );



        Load_All_Email_Comment_File();

    }

    function Get_description_general_Intask_grp_detail(task_grp_detail_id) {
        var data = {
            id: task_grp_detail_id,
        };
        // get data
        // SERVER USING : let dataXXX = JSON.parse(req.query.data);
        // SERVER USING : let id = dataXXX.id;
        axios
            .get(GV_Server_Address + "/Get_description_general_Intask_grp_detail", {
                params: {
                    data,
                },
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                } else {
                    // SUCCESS
                    if (response.data.length > 0) {
                        $("#MoTaChung").val(``);
                        cur_task_grp_detail_object = response.data[0];
                        $("#MoTaChung").val(
                            cur_task_grp_detail_object.description_general.toString()
                        );
                    }

                    if (cur_task_grp_detail_object == undefined) {
                        GF_ShowToastrWarning("LỖI MẤT KẾT NỐI !!");
                    }
                } // }// end else SUCCESS
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    function CreateSelectedListUserAndTableListUserInTaskDetail(
        task_grp_detail_id
    ) {
        var data = {
            id: task_grp_detail_id,
        };

        // getalluserbytaskid
        axios
            .get(GV_Server_Address + "/get_all_user_by_task_Grp_Detail_ID", {
                params: {
                    data,
                },
            })
            .then(function(response) {
                if (response.data.errno != undefined) {} else {
                    data_USER_AfterGet = response.data;

                    if (
                        data_USER_AfterGet.includes("ERR") ||
                        data_USER_AfterGet.length <= 0
                    ) {
                        data_USER_AfterGet = [];
                    }

                    // init control select list user and function trigger S
                    // delete selected
                    if ($("#task_dtl_SelectAddUser").length > 0) {
                        $("#task_dtl_div_selected_user").html("");
                    }

                    $("#div_table_show_list_user_in_task_detail").html("");
                    $("#div_table_show_list_user_in_task_detail").html(
                        templateTableListuser
                    );
                    // init table
                    InitControlTableUserList();

                    // create init text for selected user
                    var initSelectedListUser = `
                                    <select id="task_dtl_SelectAddUser" class="mdb-select colorful-select dropdown-primary md-form" multiple searchable="tìm...">
                                        <option value="NONE" disabled selected>Chọn nhân viên</option>
                                    </select>
                                    <label class="mdb-main-label"></label>
                                    <button class="btn-save btn btn-primary btn-sm">Đóng</button>
                                         `;

                    // assign to form
                    $("#task_dtl_div_selected_user").append(initSelectedListUser);

                    // Event when select 1 user
                    $("#task_dtl_SelectAddUser")
                        .change(function() {
                            ArrSelectedListWhenClickOnCheckBox = [];
                            var strIcon = "";
                            var varArrSelectedListOnForm = $(this).find(":selected");
                            if (varArrSelectedListOnForm.length > 1) {
                                $.each(varArrSelectedListOnForm, function(index, value) {
                                    if (index == 0) {
                                        return;
                                    }
                                    ArrSelectedListWhenClickOnCheckBox.push(value);
                                });
                            }
                        })
                        .trigger("change");
                    // init control select list user and function trigger E

                    // create data for select list User

                    var cnt = 0;
                    $.each(data_USER_AfterGet, function(indx, user) {
                        if (user.TYPE == "OUT_DETAIL") {
                            // user.TYPE == OUT_DETAIL những người ngoai` detail nên có thể được chọn để thêm vào
                            cnt++;
                            var fullName = user.displayName;
                            if (fullName == "" || fullName == undefined || fullName == null) {
                                fullName = user.lastname + user.firstname;
                            }
                            const opt = `<option value="${user.id}" email="${user.email}" phone_1="${user.phone1}" phone_2="${user.phone2}"address="${user.address}"">${cnt}. ${fullName} - ${user.email}</option>`;
                            $("#task_dtl_SelectAddUser").append(opt);
                        }
                    });
                    $(".mdb-select").materialSelect();

                    // create data for list user (dataTable) S

                    // ClearDataInDataTable(tableListUserSelected);

                    var cntUserInTaskDetail = 0;

                    // Create data for table in task detail START

                    list_user_in_detail = [];
                    $.each(data_USER_AfterGet, function(indx, user) {
                        if (user.TYPE == "IN_DETAIL") {
                            // user.TYPE == IN_DETAIL show thông tin những người trong task_detail 

                            list_user_in_detail.push(user);
                            cntUserInTaskDetail++;

                            var userID = user.id;
                            // task_grp_detail_id
                            var STT = cntUserInTaskDetail;
                            var fullName = user.displayName;
                            if (fullName == "" || fullName == null || fullName == undefined) {
                                fullName = user.lastname + " " + user.firstname;
                            }

                            var phone1 = user.phone1;
                            var phone2 = user.phone2;
                            var email = user.email;
                            var address = user.address;
                            var joinDay = "";

                            var d = GetSysDate();
                            var t = GetSysTime();
                            var idCmtDtl = GenUserID();

                            if (
                                user.create_datetime == null ||
                                user.create_datetime == undefined ||
                                user.create_datetime == ""
                            ) {
                                joinDay = GF_Ex_ParseTime(d + t, "yyyy-MM-dd hh:mm:mili");
                                joinDay = joinDay + "__";
                            } else {
                                joinDay = GF_Ex_ParseTime(
                                    user.create_datetime,
                                    "yyyy-MM-dd hh:mm:mili"
                                );
                            }
                            var templateDel = "";
                            if (GV_STORE_TASK_GRP_TASK_DETAIL.authority_code == 1) {
                                templateDel = `
                                        <a userID='${userID}' task_grp_detail_id='${task_grp_detail_id}' fullName='${fullName}' href="#"  data-toggle="" data-target="#modalDelUserYesNo" class="task_grp_detail_user_delete"><span class="badge badge-pill badge-danger">DEL</span></a>
                                        <a index_Row_Table=${cntUserInTaskDetail - 1
                                    } userID='${userID}' joinDay='${joinDay}' task_grp_detail_id='${task_grp_detail_id}' fullName='${fullName}' href="#"  data-toggle="" data-target="#" class="task_grp_detail_user_update"><span class="badge badge-pill badge-success">UPD</span></a>
                                `;
                            }

                            if (user.id == GV_STORE_TASK_GRP_TASK_DETAIL.User_login_id) {
                                STT = `<span class="badge badge-info">BẠN</span> ` + STT;
                                templateDel = `<a index_Row_Table=${cntUserInTaskDetail - 1
                                    } userID='${userID}' joinDay='${joinDay}' task_grp_detail_id='${task_grp_detail_id}' fullName='${fullName}' href="#"  data-toggle="" data-target="#" class="task_grp_detail_user_update"><span class="badge badge-pill badge-success">UPD</span></a>`;
                            }
                            tableUserInTaskDetail.row
                                .add([
                                    STT,
                                    fullName,
                                    phone1,
                                    phone2,
                                    email,
                                    address,
                                    joinDay,
                                    templateDel,
                                ])
                                .draw(false);
                        }
                    }); // each

                    $(".task_grp_detail_user_delete").click(function(e) {
                        e.preventDefault();

                        HandleShowModalYesNo_Delete_UserInTaskGrpDetail(
                            $(this),
                            task_grp_detail_id
                        );
                    });

                    $(".task_grp_detail_user_update").click(function(e) {
                        e.preventDefault();
                        var index_Row_Table = $(this).attr("index_Row_Table");
                        var userID = $(this).attr("userID");
                        var joinDay = $(this).attr("joinDay");
                        var dataRow = tableUserInTaskDetail.row(index_Row_Table).data();

                        var fullName = dataRow[1];
                        var phone1 = dataRow[2];
                        var phone2 = dataRow[3];
                        var email = dataRow[4];
                        var address = dataRow[5];

                        if (phone1.includes("<input")) {
                            $(`.input_tableUserInTaskDetail_${userID}`).each(function() {
                                $(this).focus();
                                // $(this).selectionStart();
                            });

                            return;
                        }

                        list_user_need_update.push(userID);

                        tableUserInTaskDetail
                            .cell(index_Row_Table, 1)
                            .data(
                                `<input class="input_tableUserInTaskDetail_${userID}" userID=${userID} joinDay='${joinDay}' type="text"  name="fullName" value="${fullName}">`
                            )
                            .draw();

                        tableUserInTaskDetail
                            .cell(index_Row_Table, 2)
                            .data(
                                `<input class="input_tableUserInTaskDetail_${userID}" userID=${userID} type="text" name="phone1" value="${phone1}">`
                            )
                            .draw();

                        tableUserInTaskDetail
                            .cell(index_Row_Table, 3)
                            .data(
                                `<input class="input_tableUserInTaskDetail_${userID}" userID=${userID} type="text" name="phone2" value="${phone2}">`
                            )
                            .draw();

                        // tableUserInTaskDetail
                        //     .cell(index_Row_Table, 4)
                        //     .data(`<input class="input_tableUserInTaskDetail_${userID}" userID=${userID} type="text" name="email" value="${email}">`)
                        //     .draw();

                        tableUserInTaskDetail
                            .cell(index_Row_Table, 5)
                            .data(
                                `<input class="input_tableUserInTaskDetail_${userID}" userID=${userID} type="text" name="address" value="${address}">`
                            )
                            .draw();

                        $(`.input_tableUserInTaskDetail_${userID}`).each(function() {
                            $(this).focus();
                            // $(this).selectionStart();
                        });
                    });

                    // Create data for table in task detail END

                    // click row set color START
                    $("#table_show_list_user_in_task_detail > tbody > tr").click(
                        function() {
                            $("#table_show_list_user_in_task_detail > tbody")
                                .find("tr")
                                .each(function() {
                                    $(this).css("background-color", "white");
                                });

                            $(this).css("background-color", "yellow");
                        }
                    );
                    // click row set color END
                    // create data for list user (dataTable) E

                    $("#task_dtl_btn_UpdateUser_from_Selected")
                        .html("LUU")
                        .removeClass("disabled");
                } // END ELSE SCC

            }); // end then all
    }

    function InitControlTableUserList() {
        tableUserInTaskDetail = $("#table_show_list_user_in_task_detail").DataTable({
            scrollX: true,
            scrollY: 200,
            paging: false,
            searching: false,
            destroy: true,
            order: [], // nếu ko có dòng này thì column đầu tiên sẽ tự động  sort
        });
        var selected_leng = $("[name=table_show_list_user_in_task_detail_length]");
        selected_leng.val("100").change();

        $("#table_show_list_user_in_task_detail_info").remove();

        $("#table_show_list_user_in_task_detail_wrapper")
            .find(".row")
            .each(function() {
                $(this).remove();
                return false;
            });

        tableUserInTaskDetail.clear().draw();
    }

    function HandleShowModalYesNo_Delete_UserInTaskGrpDetail(
        control,
        task_grp_detail_id
    ) {
        var userID = control.attr("userID");
        var task_grp_detail_id11 = control.attr("task_grp_detail_id");
        var fullName = control.attr("fullName");
        $("#del_user_name").html(
            `Bạn có đồng ý xoá [${fullName}] khỏi công việc này ?`
        );
        $("#btn_modal_yes_del_user").attr(
            "task_grp_detail_id",
            task_grp_detail_id11
        );
        $("#btn_modal_yes_del_user").attr("userID", userID);

        control.attr("data-toggle", "modal");
    }

    function HandleAssignEmailToFormDetail(
        CntMst,
        hdr,
        htmlEmail,
        idCmt,
        ArrayFile,
        create_datetime,
        list_notify_in_mst
    ) {
        var listFileInfo = "";
        if (ArrayFile != undefined && ArrayFile.length > 0) {
            $.each(ArrayFile, function(index, file) {
                iconLinkType = GF_GetLinkImgForIconFile(file.file_name);
                listFileInfo =
                    listFileInfo +
                    `<a id="save_file" href="https://drive.google.com/uc?id=${file.id}&export=download" download=""><i class=""><img src="${iconLinkType}" alt="thumbnail" class="img-thumbnail"
                           style="width:30px;height:30;"> </i>${file.file_name} (${GF_GetTextSizeFile_By_SizeFileByte(file.file_size_byte)})</a>&nbsp;`;
            });
        }

        var notifyText = '';
        if (list_notify_in_mst.length > 0) {
            notifyText = `<span class="badge badge-danger">Thông báo (${list_notify_in_mst.length})</span>`;
        }

        var template = `
        <!-- Card comment email master START-->
        <div>
            <button show_collpase='false' id="${idCmt}" type="button" class="btn btn-danger btn-sm btn-rounded btn_collapse_class" data-toggle="collapse" data-target="#123">
            ${CntMst}.<i class="fas fa-th-list pr-2" aria-hidden="true"></i><strong>${hdr}</strong> ${notifyText}
            </button>
            <div id="div_${idCmt}" class="card card-cascade collapse">
                <div class="view view-cascade gradient-card-header blue-gradient text-left" style=" padding-bottom: 0px;padding-top: 0px;">
                    <h3>${hdr}</h3>
                    <p class="mb-0">
                        <i class="fas fa-calendar mr-2"></i>${create_datetime}
                    </p>
                </div>

                <!-- Card content -->
                <div style="font-size: 11px" class="card-body card-body-cascade text-left">
                        ${htmlEmail}
                        <hr />
                 
                     ${listFileInfo}
                     </div>
                
                  <strong class="green" style="color: white"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BINH
                    LUAN</strong
                  >

                  <div class="container-fluid">
                    <!--  ROW START -->

                    <div class="row">
                      <div
                        class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 border border-primary"
                      ></div>

                      <div id='div_hold_cmt_detail_with_cmt_mst_has_id_${idCmt}'
                        class="col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11 border border-primary text-left"
                      >
                        <div style="background-color: wheat">
                          <strong style="font-size: 10px"
                            >Vinh (20/08/2020 10:20:10) :
                          </strong>
                          <br />
                          đã đến chỗ lấy hàng đã đến chỗ lấy hàng đã đến chỗ lấy
                          hàng đã đến chỗ lấy hàng đã đến chỗ lấy hàng đã đến
                          chỗ lấy hàng đã đến chỗ lấy hàng
                        </div>
                        <br />
                        <div style="background-color: wheat">
                          <strong style="font-size: 10px"
                            >Vinh (20/08/2020 10:20:10) :
                          </strong>
                          <br />
                          đã đến chỗ lấy hàng
                        </div>
                        <br />
                        <div style="background-color: wheat">
                          <strong style="font-size: 10px"
                            >Vinh (20/08/2020 10:20:10) :
                          </strong>
                          <br />
                          đã đến chỗ lấy hàng
                        </div>
                        <br />
                      </div>
                    </div>
                    <!--  ROW END -->

                    <!--  ROW START -->
                    <br />
                    <div class="row">
                      <div
                        class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                        style="display: flex"
                      >
                        <span
                          class="badge badge-pill green"
                          style="margin-right: 8px"
                        >
                          <i class="fas fa-comments fa-2x"></i>
                        </span>
                        <input
                          type="text"
                          id="cmt_detail_text_${idCmt}"
                          class="form-control"
                          placeholder=".............."
                        />

                        <button
                          
                          type="button"
                          class="SignUp btn btn-warning btn_add_cmt_detail_class"
                          style="left: 8px"
                          cmt_mst='${idCmt}'
                        >
                          ĐĂNG
                        </button>

                      </div>

                    </div>
                    
                    <!--  ROW END -->
                    <!--  ROW FILE START -->
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <form class="md-form" action="#" style="margin-top: 0px;margin-bottom: 0px;">
                                    <div class="file-field">
                                        <div class="btn btn-unique btn-sm float-left">
                                        <span>Choose files</span>
                                        <input id='file_cmt_detail_with_cmt_mst_has_id_${idCmt}' type="file" multiple>
                                        </div>
                                        <div class="file-path-wrapper">
                                        <input id='fileName_cmt_detail_with_cmt_mst_has_id_${idCmt}' class="file-path validate" type="text" placeholder="Upload one or more files">
                                        </div>
                                    </div>
                            </form>
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" id='list_files_for_cmtDtl_has_mst_id_${idCmt}'>
                        </div>

                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div id='spinner_add_cmt_dlt_for_cmt_mst_has_id_${idCmt}' class="spinner-border text-success" role="status" style="display: none;">
                            </div>
                            <div id='show_text_err_add_cmt_dlt_for_cmt_mst_has_id_${idCmt}' class="red" style="display: none;">
                                <strong>&nbsp;&nbsp;&nbsp;Lỗi!!</strong>
                            </div>
                        </div>
                    </div>

                    <!--  ROW FILE END -->


                  </div>
                   </div>
        </div>
        <!-- Card comment email master END-->
        `;
        $("#car_holder_ALL_object_email_comment").prepend(template);
        $(".collapse").collapse("hide");

        $(`#file_cmt_detail_with_cmt_mst_has_id_${idCmt}`).on('change', function(event) {

            var controlFile = $(this);
            var numberFile = controlFile.prop("files").length;
            var cnt = 0;
            if (numberFile <= 0) {
                return;
            }

            var div_list = $(`#list_files_for_cmtDtl_has_mst_id_${idCmt}`);
            div_list.html('');

            for (let index = 0; index < numberFile; index++) {
                cnt++;
                var file = controlFile.prop("files")[index];
                div_list.append(`<div class='' id='mst_${idCmt}_has_file_dtl_upload_${cnt}'><strong> ${cnt}.</strong>${file.name} [${GF_GetTextSizeFile_By_SizeFileByte(file.size)}]</div>`);
            }
        });

    }

    function HandleAssignCmtDetailAndFileToEmail(
        cmt_mst_id,
        ArrayCmtDtlForEmail,
        arr_file
    ) {
        $("#div_hold_cmt_detail_with_cmt_mst_has_id_" + cmt_mst_id).html("");
        if (ArrayCmtDtlForEmail.length <= 0) {
            return;
        }

        var arrFile = [];
        var listFile = "";

        $.each(ArrayCmtDtlForEmail, function(indexCmt, cmt_dtl) {
            if (arr_file.length > 0) {
                arrFile = [];
                listFile = "";

                $.each(arr_file, function(indexFile, file) {
                    if (cmt_dtl.cmt_id == file.cmt_id) {
                        arrFile.push(file);
                    }
                });

                if (arrFile.length > 0) {
                    $.each(arrFile, function(indexFile, file) {

                        // var linkDown = file.file_link_download.replace('uc1id', 'uc?id');
                        var linkDown = `https://drive.google.com/uc?id=${file.id}&export=download`;
                        var templateFile = `
                        <br/>
                        <a style="font-size: 12px;color: blue;" id="save_file" href="${linkDown}" download="">
                                      <i class=""><img src="${GF_GetLinkImgForIconFile(file.file_name)}" alt="thumbnail" class="img-thumbnail" style="width: 30px;height: 30px;"> </i>
                            ${file.file_name} (${GF_GetTextSizeFile_By_SizeFileByte(file.file_size_byte)})
                        </a>
                        `;
                        listFile = listFile + templateFile;
                    });
                }
            }

            var color_backGround = "wheat";
            // GV_STORE_TASK_GRP_TASK_DETAIL.creator_id ===> loginID la` nguoi tao cmt nay`
            if (GV_STORE_TASK_GRP_TASK_DETAIL.creator_id == cmt_dtl.creator_id) {
                color_backGround = "#c2b1dfd4";
            }

            var notifyText = ''
            var cntCheck = 1;
            $.each(GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin, function(indexFile, Notify_By) {
                if (cntCheck == 1 && Notify_By.cmt_id == cmt_dtl.cmt_id) {
                    cntCheck++;
                    notifyText = `</strong><a notify_id='${Notify_By.notify_id}' seen_flag='1' class="class_a_unRead_badge" href="javascript:;"><span class="badge badge-secondary">Chưa xem</span></a>`;
                }
            });



            var template_cmt_detail = `
                    <!-- 1 comment detail START -->
                    <div id='cmt_dtl_id_${cmt_dtl.cmt_id
                }'style="background-color: ${color_backGround}">
                      <strong style="font-size: 10px">${cmt_dtl.creator_name} (${GF_Ex_ParseTime(
                    cmt_dtl.create_datetime,
                    "dd-MM-yyyy hh:mm:mili"
                )}) : ${notifyText}
                       
                        <br /> 
                        ${cmt_dtl.cmt_contain}
                        ${listFile}
                    </div>
                    <br />
                    <!-- 1 comment detail END -->
                `;

            $("#div_hold_cmt_detail_with_cmt_mst_has_id_" + cmt_mst_id).prepend(
                template_cmt_detail
            );

            if (ArrayCmtDtlForEmail.length > 4) {
                $("#div_hold_cmt_detail_with_cmt_mst_has_id_" + cmt_mst_id).css({ 'height': '400px', 'overflow-y': 'auto' });
            }
        });
    }

    function Load_All_Email_Comment_File() {

        $('#modalFullCoverLoader').show();
        $("#car_holder_ALL_object_email_comment").html("");
        var data = {
            task_grp_detail_id: GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id,
            user_login_id: GV_STORE_TASK_GRP_TASK_DETAIL.User_login_id
        };
        // get data
        // SERVER USING : let dataXXX = JSON.parse(req.query.data);
        // SERVER USING : let id = dataXXX.id;
        axios
            .get(GV_Server_Address + "/GetAllEmailAndFileAndCommentByTaskID", {
                params: {
                    data,
                },
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                } else {
                    // SUCCESS
                    var arr_email_cmt_mst = response.data[0];
                    var arr_file = response.data[1];
                    var arr_cmt_dtl = response.data[2];
                    GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin = response.data[3];

                    $('#btn_open_modal_create_email').html(`THÊM CÔNG VIỆC (hiện tại : ${arr_email_cmt_mst.length})`);

                    var ArrayFileInCmt = [];
                    var ArrayCmtDtlForEmail = [];
                    var CntMst = 0;
                    $.each(arr_email_cmt_mst, function(index, cmtEmailMst) {
                        ArrayFileInCmt = [];
                        ArrayCmtDtlForEmail = [];
                        var list_notify_in_mst = [];
                        var list_notify_in_each_cmt_dtl = [];

                        $.each(arr_file, function(index, file) {
                            if (file.cmt_id == cmtEmailMst.cmt_id) {
                                ArrayFileInCmt.push(file);
                            }
                        });

                        $.each(arr_cmt_dtl, function(index, cmt_dtl) {
                            if (cmt_dtl.cmt_mst_id == cmtEmailMst.cmt_id) {
                                ArrayCmtDtlForEmail.push(cmt_dtl);
                            }
                        });

                        $.each(GV_STORE_TASK_GRP_TASK_DETAIL.Notify_By_TaskDtlID_And_userLogin, function(index, notify) {
                            if (notify.cmt_mst_id == cmtEmailMst.cmt_id) {
                                list_notify_in_mst.push(notify);
                            }
                        });

                        // comment master : type = MST_EMAIL
                        CntMst++;
                        HandleAssignEmailToFormDetail(
                            CntMst,
                            cmtEmailMst.cmt_mst_header,
                            cmtEmailMst.cmt_contain,
                            cmtEmailMst.cmt_id,
                            ArrayFileInCmt,
                            GF_Ex_ParseTime(cmtEmailMst.create_datetime, "dd-MM-yyyy hh:mm:mili"),
                            list_notify_in_mst
                        );

                        HandleAssignCmtDetailAndFileToEmail(
                            cmtEmailMst.cmt_id,
                            ArrayCmtDtlForEmail,
                            arr_file
                        );
                    });

                    if (GV_STORE_TASK_GRP_TASK_DETAIL.CmtDetailText != undefined && GV_STORE_TASK_GRP_TASK_DETAIL.CmtDetailText != '') {
                        $(GV_STORE_TASK_GRP_TASK_DETAIL.CmtDetailTextID).val(GV_STORE_TASK_GRP_TASK_DETAIL.CmtDetailText);
                    }
                    if (GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHeader != undefined && GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHeader != '') {
                        $("#email_contain_header").val(GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHeader);
                    }

                    if (GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHtml != undefined && GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHtml != '') {

                        $("#div_textarea_email_container").find(".richText-editor").each(function() {
                            //var id_richText = $(this).attr('id');
                            control_richText = $(this);
                            control_richText[0].outerHTML = GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHtml;
                        });
                    }


                    $('.class_a_unRead_badge').click(function(e) {
                        e.preventDefault();
                        var control = $(this);
                        var seen_flag = control.attr('seen_flag');
                        if (seen_flag == '0') {
                            return;
                        }
                        var notify_id = control.attr('notify_id');
                        var data = {
                            id: notify_id,
                        };
                        // post data
                        // in SERVER get data USING :  req.body.data
                        axios.post(GV_Server_Address + '/DeleteNotifyByID', {
                                data: data,
                            })
                            .then(function(response) {
                                if (response.errno != undefined) {
                                    // ERR
                                    GF_ShowToastrWarning('Mất kết nối Internet!!');
                                } else {
                                    // SUCCESS
                                    control.children('span').html('Đã xem');
                                    control.attr('seen_flag', '0');
                                    // control.hide();
                                } // }// end else SUCCESS
                            })
                            .catch(function(error) {
                                console.log(error);
                            });
                    });

                    $(".btn_collapse_class").click(function(e) {
                        var btn = $(this);
                        if (btn.attr("show_collpase") === "false") {
                            btn.attr("show_collpase", "true");
                            $("#div_" + btn.attr("id")).collapse("show");
                        } else if (btn.attr("show_collpase") === "true") {
                            btn.attr("show_collpase", "false");
                            $("#div_" + btn.attr("id")).collapse("hide");
                        }
                    });

                    $(".btn_add_cmt_detail_class").click(function(e) {
                        Handle_btn_add_cmt_detail_class($(this));
                    });
                } // }// end else SUCCESS
                $('#modalFullCoverLoader').hide();
            })
            .catch(function(error) {
                $('#modalFullCoverLoader').hide();
                console.log(error);
            });
    }

    function HandleLoadPage404(errObj, errText) {

        var GV_KEY_STORE_PARAM_PAGE_404 = "996asdsfad6asdasd67sss676adsas";
        var GV_PARAM_PAGE_404_INFO = {};

        $.jStorage.deleteKey(GV_KEY_STORE_PARAM_PAGE_404);

        var data = {
            id: errObj,
        };

        // get data
        // SERVER USING : let dataXXX = JSON.parse(req.query.data);
        // SERVER USING : let id = dataXXX.id;
        axios
            .get(GV_Server_Address + "/errweb/" + errText, {
                params: {
                    data,
                },
            })
            .then(function(response) {
                if (response.errno != undefined) {
                    // ERR
                } else {
                    // SUCCESS
                    GV_PARAM_PAGE_404_INFO.errCode = response.data;
                    GF_SetjStorage(GV_KEY_STORE_PARAM_PAGE_404, GV_PARAM_PAGE_404_INFO);
                    location.href = GV_link_page404;
                    return;
                } // }// end else SUCCESS
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    function Handle_btn_add_cmt_detail_class(btn) {

        $('#modalFullCoverLoader').show();
        var cmt_mst_id = btn.attr("cmt_mst");
        $("#cmt_detail_text_" + cmt_mst_id).focus();
        var cmt_dtl_text = $("#cmt_detail_text_" + cmt_mst_id).val();
        if (cmt_dtl_text == "") {
            $("#cmt_detail_text_" + cmt_mst_id).focus();
            $('#modalFullCoverLoader').hide();
            return;
        }

        $("#spinner_add_cmt_dlt_for_cmt_mst_has_id_" + cmt_mst_id).show();
        var idCmtDtl = GenUserID();
        var controlFile = $("#file_cmt_detail_with_cmt_mst_has_id_" + cmt_mst_id);
        var numberFile = controlFile.prop("files").length;
        var listDataFileAfterUpGG = [];

        if (numberFile > 0) {

            var index = -1;
            // in this function will call [Handle_InsertCmtDetailForEmailMaster_InsertNotifytoCmtDtl()] after upload file finished
            Handle_UploadFile_For_CmtDtl(controlFile, GV_STORE_TASK_GRP_TASK_DETAIL.accesstoken, cmt_mst_id, idCmtDtl, cmt_dtl_text, index, numberFile, listDataFileAfterUpGG);
        } else {
            Handle_InsertCmtDetailForEmailMaster_InsertNotifytoCmtDtl(cmt_mst_id, idCmtDtl, cmt_dtl_text, listDataFileAfterUpGG);
        }
    }

    function Handle_UploadFile_For_CmtDtl(controlFile, accesstoken1, cmt_mst_id, idCmtDtl, cmt_dtl_text, index, numberFile, listDataFileAfterUpGG) {
        index++;

        if (index == numberFile) {

            var ERR = `ERR`;
            var data = {
                data: listDataFileAfterUpGG
            };
            // post data
            // in SERVER get data USING :  req.body.dataFile
            axios.post(GV_Server_Address + '/insertFileToDB', {
                    dataFile: data,
                })
                .then(function(response) {
                    if (response.data.errno != undefined) {
                        // ERR
                        ERR = `ERR`;
                        Handle_ClearAfterInsertCmtDtl_And_Notify(cmt_mst_id, idCmtDtl, '', '', listDataFileAfterUpGG, `ERR`);

                    } else {
                        // SUCCESS
                        Handle_InsertCmtDetailForEmailMaster_InsertNotifytoCmtDtl(cmt_mst_id, idCmtDtl, cmt_dtl_text, listDataFileAfterUpGG);
                    } // }// end else SUCCESS
                })
                .catch(function(error) {
                    ERR = `ERR`;
                    Handle_ClearAfterInsertCmtDtl_And_Notify(cmt_mst_id, idCmtDtl, '', '', listDataFileAfterUpGG, `ERR`);
                });
            return;
        }

        var formData = new FormData();
        formData.append("cnt", (index + 1).toString());
        formData.append("flag_multiFlag", "false");
        formData.append("accesstoken", accesstoken1);
        formData.append("userfile", controlFile.prop("files")[index]);

        axios
            .post(GV_Server_Address + '/uploadFile2', formData, {
                headers: {
                    'processData': false,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(function(response) {
                if (response.data.errno != undefined) {

                } else {
                    var ctrl = $(`#mst_${cmt_mst_id}_has_file_dtl_upload_${(index + 1)}`);
                    ctrl.html(`${ctrl.html()}<span class="badge badge-pill light-blue"><i class="far fa-heart" aria-hidden="true"></i></span>`);

                    var res = response.data;
                    var d = GetSysDate();
                    var t = GetSysTime();
                    const linkDown = 'https://drive.google.com/uc?id=' + res.file_id + '&export=download';
                    let dataFile = {
                        id: res.file_id,
                        store_id: "GOOGLE_DRIVE",
                        creator_id: GV_STORE_TASK_GRP_TASK_DETAIL.creator_id,
                        task_grp_detail_id: GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id,
                        cmt_id: idCmtDtl,
                        file_name: res.file_name,
                        file_encoding: res.file_encoding,
                        file_md5: res.file_md5,
                        file_mimetype: res.file_mimetype,
                        file_size_byte: res.file_size_byte,
                        file_link_download: linkDown,
                        updatedate: d,
                        updatetime: t,
                        create_datetime: d + t,
                    };
                    listDataFileAfterUpGG.push(dataFile);
                    Handle_UploadFile_For_CmtDtl(controlFile, accesstoken1, cmt_mst_id, idCmtDtl, cmt_dtl_text, index, numberFile, listDataFileAfterUpGG);
                }
            })
            .catch(function(error) {

            });

    }

    function Handle_InsertCmtDetailForEmailMaster_InsertNotifytoCmtDtl(cmt_mst_id, idCmtDtl, cmt_dtl_text, listDataFileAfterUpGG) {
        var d = GetSysDate();
        var t = GetSysTime();

        var dataCmtDetail = {
            id: idCmtDtl,
            creator_id: GV_STORE_TASK_GRP_TASK_DETAIL.creator_id,
            task_grp_detail_id: GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id,
            cmt_contain: cmt_dtl_text,
            cmt_type: "DTL_EMAIL",
            cmt_mst_id: cmt_mst_id,
            cmt_mst_header: "",
            updatedate: d,
            updatetime: t,
            create_datetime: d + t,
        };
        var list_user_in_detailTamp = [];
        var cntNotify = 0;
        $.each(list_user_in_detail, function(index, userDtl) {
            cntNotify++;
            list_user_in_detailTamp.push({
                'id': `CMT_DTL_${idCmtDtl}_NOTF_ID_${cntNotify.toString()}`,
                'creator_id': GV_STORE_TASK_GRP_TASK_DETAIL.creator_id,
                'notify_to_user_id': userDtl.id,
                'cmt_id': idCmtDtl,
                'create_datetime': d + t
            });
        });

        // post data
        // in SERVER get data USING :  req.body.data
        var ERR = `ERR`;
        axios
            .post(GV_Server_Address + "/InsertCmtDetailForEmailMaster_InsertNotifytoCmtDtl", {
                data: dataCmtDetail,
                listUserIDNotifyTo: list_user_in_detailTamp
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    ERR = `ERR`;

                } else {
                    ERR = 'OK';
                }
                Handle_ClearAfterInsertCmtDtl_And_Notify(cmt_mst_id, idCmtDtl, cmt_dtl_text, dataCmtDetail.create_datetime, listDataFileAfterUpGG, ERR);
            })
            .catch(function(err) {

                ERR = `ERR`;
                Handle_ClearAfterInsertCmtDtl_And_Notify(cmt_mst_id, idCmtDtl, '', '', listDataFileAfterUpGG, ERR);
            })
    }

    function Handle_ClearAfterInsertCmtDtl_And_Notify(cmt_mst_id, idCmtDtl, cmt_dtl_text, create_datetime_cmtDtl, listDataFileAfterUpGG, err) {

        if (err != 'ERR') {

            var listFile = "";
            if (listDataFileAfterUpGG.length > 0) {
                $.each(listDataFileAfterUpGG, function(index, file) {

                    // cmt_id: "202009281134120342"
                    // create_datetime: "20200928113414"
                    // creator_id: "113486759599812914431"
                    // file_encoding: "7bit"
                    // file_link_download: "https://drive.google.com/uc?id=1N95B_16Z5Bwrys9tuHHrDUcb9J_5afML&export=download"
                    // file_md5: "54d0014bb4272755de6d46942e65c420"
                    // file_mimetype: "application/x-zip-compressed"
                    // file_name: "[lehait.net]KMSpico.v10.2.0.Portable.zip"
                    // file_size_byte: 1284061
                    // id: "1N95B_16Z5Bwrys9tuHHrDUcb9J_5afML"
                    // store_id: "GOOGLE_DRIVE"
                    // task_grp_detail_id: "202009171629560747"
                    // updatedate: "20200928"
                    // updatetime: "113414"

                    var templateFile = `
                        <br/>
                        <a style="font-size: 12px;color: blue;" id="save_file" href="https://drive.google.com/uc?id=${file.id}&export=download" download="">
                             <i class=""><img src="${GF_GetLinkImgForIconFile(file.file_name)}" alt="thumbnail" class="img-thumbnail" style="width: 30px;height: 30px;"> </i>
                                    ${file.file_name} (${GF_GetTextSizeFile_By_SizeFileByte(file.file_size_byte)})
                        </a>
                    `;
                    listFile = listFile + templateFile;
                });
            }

            var template_cmt_detail =
                `
                    <!-- 1 comment detail START -->
                    <div class="scrollbar scrollbar-primary" id=cmt_dtl_id_${idCmtDtl} style="background-color: #c2b1dfd4">
                        <strong style="font-size: 10px">${GV_STORE_TASK_GRP_TASK_DETAIL.full_name} (${GF_Ex_ParseTime(create_datetime_cmtDtl, "dd-MM-yyyy hh:mm:mili")}) :</strong>
                        <br /> 
                        ${cmt_dtl_text}
                        ${listFile}
                    </div>
                    <br />
                    <!-- 1 comment detail END -->
            `;

            $("#div_hold_cmt_detail_with_cmt_mst_has_id_" + cmt_mst_id).prepend(
                template_cmt_detail
            );
        } else {
            GF_ShowToastrWarning('LỖI');
        }

        $(`#list_files_for_cmtDtl_has_mst_id_${cmt_mst_id}`).html('');
        $("#fileName_cmt_detail_with_cmt_mst_has_id_" + cmt_mst_id).val("");
        $("#file_cmt_detail_with_cmt_mst_has_id_" + cmt_mst_id).val("");
        $("#cmt_detail_text_" + cmt_mst_id).val("");
        $("#spinner_add_cmt_dlt_for_cmt_mst_has_id_" + cmt_mst_id).hide();
        $("#show_text_err_add_cmt_dlt_for_cmt_mst_has_id_" + cmt_mst_id).hide();
        GV_STORE_TASK_GRP_TASK_DETAIL.CmtDetailTextID = '';
        GV_STORE_TASK_GRP_TASK_DETAIL.CmtDetailText = '';
        GF_SetjStorage(GV_KEY_STORE_TASK_GRP_TASK_DETAIL, GV_STORE_TASK_GRP_TASK_DETAIL);
        $('#modalFullCoverLoader').hide();
        $("#cmt_detail_text_" + cmt_mst_id).focus();
    }

    var NEW_idCmtEmailMst = '';
    var NEW_List_file_email_contain = [];

    function HandleInsertDBCmtEmailMst() {

        var control_file_email = $("#fileinput2");
        var control_file_name_email = $("#fileinput3");
        var control_richText = undefined;
        $("#div_textarea_email_container").find(".richText-editor").each(function() {
            control_richText = $(this);
        });
        var hdr = $("#email_contain_header").val();
        var htmlContainEmail = control_richText[0].outerHTML;

        var d = GetSysDate();
        var t = GetSysTime();

        var data = {
            id: NEW_idCmtEmailMst,
            creator_id: GV_STORE_TASK_GRP_TASK_DETAIL.creator_id,
            task_grp_detail_id: GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id,
            cmt_contain: htmlContainEmail,
            cmt_type: "MST_EMAIL",
            cmt_mst_id: "",
            cmt_mst_header: hdr,
            updatedate: d,
            updatetime: t,
            create_datetime: d + t,
        };

        var data = {
            data: data,
        };
        // post data
        // in SERVER get data USING :  req.body.data
        axios.post(GV_Server_Address + '/InsertCmtMst', {
                data: data,
            })
            .then(function(response) {
                $('#insertEmailMst_Loader').hide();
                if (response.data.errno != undefined) {
                    // ERR

                } else {
                    // SUCCESS

                    control_file_email.val('');
                    control_file_name_email.val('');
                    $("#email_contain_header").val('');
                    $("#list_file_email_upload").html('');
                    $("#div_textarea_email_container").find(".richText-editor").each(function() {
                        $(this).html('');
                    });
                    alert('THÀNH CÔNG');
                    Load_All_Email_Comment_File();
                    $("#email_contain_header").focus();

                } // }// end else SUCCESS
                $('#modalFullCoverLoader').hide();
            })
            .catch(function(error) {
                $('#insertEmailMst_Loader').hide();
                $('#modalFullCoverLoader').hide();
            });
    }

    function HandleInsertDBListFile() {
        var xx = 1;
        var data = {
            data: NEW_List_file_email_contain
        };
        // post data
        // in SERVER get data USING :  req.body.dataFile
        axios.post(GV_Server_Address + '/insertFileToDB', {
                dataFile: data,
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    $('#insertEmailMst_Loader').hide();
                    $('#modalFullCoverLoader').hide();
                } else {
                    // SUCCESS

                    HandleInsertDBCmtEmailMst();
                } // }// end else SUCCESS
            })
            .catch(function(error) {
                $('#modalFullCoverLoader').hide();
                $('#insertEmailMst_Loader').hide();
            });

    }

    function HandleUploadFileEmailMstAfterCheckExpiresAccesstoken(accesstoken1) {
        var linkEx = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accesstoken1}`;
        var data = { 'id': '1' };
        axios
            .get(linkEx, {
                params: {
                    data,
                },
            })
            .then(function(response) {
                if (response.errno != undefined) {
                    // ERR

                    VerifyGoogleAcc();
                } else {
                    // SUCCESS
                    if (response.data.expires_in <= 30) {

                        VerifyGoogleAcc();

                    } else {
                        var controlFile = $("#fileinput2");
                        var numberFile = controlFile.prop("files").length;
                        var index = 0;
                        if (numberFile <= 0) {
                            return;
                        }
                        uploadFile2_EmailContain(controlFile, index, numberFile, accesstoken1);
                    }
                } // }// end else SUCCESS
            })
            .catch(function(error) {
                VerifyGoogleAcc();
            });
    }

    function VerifyGoogleAcc() {
        GV_STORE_TASK_GRP_TASK_DETAIL.verifyGoogleAcc = "true";
        GF_SetjStorage(
            GV_KEY_STORE_TASK_GRP_TASK_DETAIL,
            GV_STORE_TASK_GRP_TASK_DETAIL
        );
        location.href = GV_Server_Address + GV_auth_google;
    }

    function uploadFile2_EmailContain(controlFile, index, numberFile, accesstoken2) {
        $('#list_file_email_upload_loader').show();

        // stop upload
        if (index >= numberFile) {
            $('#list_file_email_upload_loader').hide();
            HandleInsertDBListFile();
            return;
        }

        var formData = new FormData();
        formData.append("cnt", (index + 1).toString());
        formData.append("flag_multiFlag", "false");
        formData.append("accesstoken", accesstoken2);
        formData.append("userfile", controlFile.prop("files")[index]);

        axios
            .post(GV_Server_Address + '/uploadFile2', formData, {
                headers: {
                    'processData': false,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    $('#insertEmailMst_Loader').hide();
                    index = numberFile;
                    $('#list_file_email_upload_loader').hide();
                    uploadFile2_EmailContain(controlFile, index, numberFile, accesstoken2);
                    location.href = GV_Server_Address + GV_auth_google;
                } else {
                    index = index + 1;
                    var res = response.data;
                    var d = GetSysDate();
                    var t = GetSysTime();
                    const linkDown = 'https://drive.google.com/uc?id=' + res.file_id + '&export=download';
                    let dataFile = {
                        id: res.file_id,
                        store_id: "GOOGLE_DRIVE",
                        creator_id: GV_STORE_TASK_GRP_TASK_DETAIL.creator_id,
                        task_grp_detail_id: GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id,
                        cmt_id: NEW_idCmtEmailMst,
                        //file_buffer: ,
                        file_name: res.file_name,
                        file_encoding: res.file_encoding,
                        file_md5: res.file_md5,
                        file_mimetype: res.file_mimetype,
                        file_size_byte: res.file_size_byte,
                        file_link_download: linkDown,
                        updatedate: d,
                        updatetime: t,
                        create_datetime: d + t,
                    };

                    NEW_List_file_email_contain.push(dataFile);

                    var htmldiv = $(`#list_file_email_upload_${res.cnt}`).html();
                    $(`#list_file_email_upload_${res.cnt}`).html(htmldiv + `<span class="badge badge-pill orange"><i class="fas fa-coffee" aria-hidden="true"></i></span>`);

                    uploadFile2_EmailContain(controlFile, index, numberFile, accesstoken2);
                }
            })
            .catch(function(error) {
                $('#insertEmailMst_Loader').hide();
                $('#list_file_email_upload_loader').hide();
                index = numberFile;
                uploadFile2_EmailContain(controlFile, index, numberFile, accesstoken2);
                location.href = GV_Server_Address + GV_auth_google;
            });
    }


    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////         function END
    ////////////////////////////////////////////////////

    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////         EVENT START
    ////////////////////////////////////////////////////

    $("#btn_modal_yes_del_user").click(function(e) {

        $("#task_dtl_btn_AddUser_from_Selected")
            .html(
                '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Đang xoá...'
            )
            .addClass("disabled");
        var btn = $(this);
        var task_grp_detail_id = btn.attr("task_grp_detail_id");
        var userID = btn.attr("userID");

        var data = {
            userID: userID,
            task_grp_detail_id: task_grp_detail_id,
        };

        // post data
        // in SERVER get data USING :  req.body.data
        axios
            .post(GV_Server_Address + "/DeleteUserInGrpTaskDetail", {
                data: data,
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    GF_ShowToastrWarning("XOÁ THẤT BẠI !!");
                } else {
                    // SUCCESS
                } // }// end else SUCCESS

                $("#task_dtl_btn_AddUser_from_Selected").html("THÊM").removeClass("disabled");
                CreateSelectedListUserAndTableListUserInTaskDetail(task_grp_detail_id);

            })
            .catch(function(error) {
                GF_ShowToastrWarning("XOÁ THẤT BẠI !!");
                $("#task_dtl_btn_AddUser_from_Selected")
                    .html("THÊM")
                    .removeClass("disabled");
                CreateSelectedListUserAndTableListUserInTaskDetail(task_grp_detail_id);
            });
    });

    $("#float_show_modal_add_cmt").click(function(e) {
        var div = $(this);
        div.attr("data-toggle", "modal");
        $("#show_spinner_upload_file").hide();
        $("#show_msg_err_upload_file").hide();
    });

    $("#btn_open_modal_create_email").click(function(e) {
        var btn = $(this);

        btn.attr("data-target", "#modalAddComment");
        btn.attr("data-toggle", "modal");
        $("#show_spinner_upload_file").hide();
        $("#show_msg_err_upload_file").hide();
    });

    $("#task_dtl_btn_SaveMoTaChung").click(function(e) {
        var btn = $("#task_dtl_btn_SaveMoTaChung");
        var d = GetSysDate();
        var t = GetSysTime();
        btn
            .html(
                '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Đang save...'
            )
            .addClass("disabled");
        var data = {
            id: GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id,
            description_general: $("#MoTaChung").val(),
            updatedate: d,
            updatetime: t,
        };
        // post data
        // in SERVER get data USING :  req.body.data
        axios
            .post(GV_Server_Address + "/UpdateDescriptionGeneralForTaskGrpDetail", {
                data: data,
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    btn.html("SAVE").removeClass("disabled");
                } else {
                    // SUCCESS
                } // }// end else SUCCESS

                btn.html("SAVE").removeClass("disabled");
            })
            .catch(function(error) {
                console.log(error);
                btn.html("SAVE").removeClass("disabled");
            });
    });

    $("#task_dtl_btn_AddUser_from_Selected").click(function(e) {
        var btn = $(this);
        btn
            .html(
                '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Đang thêm...'
            )
            .addClass("disabled");

        var ArrSelectedListWhenClickOnCheckBox = [];
        var varArrSelectedListOnForm = $("#task_dtl_SelectAddUser").find(
            ":selected"
        );
        if (varArrSelectedListOnForm.length > 1) {
            $.each(varArrSelectedListOnForm, function(index, value) {
                if (index == 0) {
                    return;
                }
                var user_id = value.value;

                var d = GetSysDate();
                var t = GetSysTime();
                var id = GenUserID();

                var data = {
                    id: id,
                    task_grp_detail_id: GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail,
                    user_id: user_id,
                    creator_id: GV_STORE_TASK_GRP_TASK_DETAIL.creator_id,
                    updatedate: d,
                    updatetime: t,
                    create_datetime: d + t,
                };
                ArrSelectedListWhenClickOnCheckBox.push(data);
            });
        } else {
            btn.html("THÊM").removeClass("disabled");
            GF_ShowToastrWarning("Hãy chọn thành viên");
            return;
        }

        varArrSelectedListOnForm = [];

        var data = {
            listUserInfo: ArrSelectedListWhenClickOnCheckBox,
        };

        // post data
        // in SERVER get data USING :  req.body.data
        axios
            .post(GV_Server_Address + "/InsertUserWhenClickBtnAddUserToTaskDetail", {
                data: data,
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    GF_ShowToastrWarning("THÊM THẤT BẠI !!");
                    btn.html("THÊM").removeClass("disabled");
                } else {
                    // SUCCESS
                    btn.html("THÊM").removeClass("disabled");
                    CreateSelectedListUserAndTableListUserInTaskDetail(
                        GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail
                    );
                } // }// end else SUCCESS
            })
            .catch(function(error) {
                GF_ShowToastrWarning("THÊM THẤT BẠI !!");
                btn.html("THÊM").removeClass("disabled");
            });
    });

    $("#fileinput2").on('change', function(event) {

        $('#list_file_email_upload_loader').hide();
        var controlFile = $("#fileinput2");
        var numberFile = controlFile.prop("files").length;
        var cnt = 0;
        if (numberFile <= 0) {
            GF_ShowToastrWarning('KHONG CO FILE');
            return;
        }

        $("#list_file_email_upload").html('');
        for (let index = 0; index < numberFile; index++) {
            cnt++;
            var file = controlFile.prop("files")[index];
            $("#list_file_email_upload").append(`<div class='' id='list_file_email_upload_${cnt}'>${cnt}. ${file.name} [${GF_GetTextSizeFile_By_SizeFileByte(file.size)}]</div>`);
        }
    });

    $("#create_task_group_btn_create_email_contain").click(function(e) {

        $('#modalFullCoverLoader').show();

        var hdr = $("#email_contain_header").val();

        if (hdr.trim() === "" || hdr.trim().length < 3) {
            $('#modalFullCoverLoader').hide();
            $("#email_contain_header").focus();
            return;
        }

        $('#insertEmailMst_Loader').show();
        NEW_idCmtEmailMst = GenUserID();
        var controlFile = $("#fileinput2");
        var numberFile = controlFile.prop("files").length;
        if (numberFile > 0) {
            // in this function will call HandleInsertDBCmtEmailMst() after upload file finished
            NEW_List_file_email_contain = [];
            HandleUploadFileEmailMstAfterCheckExpiresAccesstoken(GV_STORE_TASK_GRP_TASK_DETAIL.accesstoken);
        } else {

            HandleInsertDBCmtEmailMst();
        }
    });

    $("#task_dtl_btn_UpdateUser_from_Selected").click(function(e) {
        if (list_user_need_update.length <= 0) {
            return;
        }

        $("#task_dtl_btn_UpdateUser_from_Selected")
            .html(
                '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Đang save...'
            )
            .addClass("disabled");
        var gg = 1;
        var list_objUpdate = [];
        var d = GetSysDate();
        var t = GetSysTime();
        var newID = GenUserID();

        $.each(list_user_need_update, function(index, id_user) {
            var objUser = {};
            $(".input_tableUserInTaskDetail_" + id_user).each(function() {
                var name_control = $(this).attr("name");
                var userID = $(this).attr("userID");
                objUser.userID = userID;
                objUser.updatedate = d;
                objUser.updatetime = t;

                if (name_control == "fullName") {
                    objUser.fullName = $(this).val();

                    if ($(this).attr("joinDay").includes("__")) {
                        objUser.create_datetime = d + t;
                    }
                } else if (name_control == "phone1") {
                    objUser.phone1 = $(this).val();
                } else if (name_control == "phone2") {
                    objUser.phone2 = $(this).val();
                } else if (name_control == "email") {
                    objUser.email = $(this).val();
                } else if (name_control == "address") {
                    objUser.address = $(this).val();
                }
            });
            list_objUpdate.push(objUser);
        });

        var data = {
            data: list_objUpdate,
        };
        // post data
        // in SERVER get data USING :  req.body.data
        axios
            .post(GV_Server_Address + "/updateListUserInDetail", {
                data: data,
            })
            .then(function(response) {
                if (response.data.errno != undefined) {
                    // ERR
                    $("#task_dtl_btn_AddUser_from_Selected")
                        .html("LUU")
                        .removeClass("disabled");
                } else {
                    // SUCCESS
                    CreateSelectedListUserAndTableListUserInTaskDetail(
                        GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id
                    );
                } // }// end else SUCCESS
            })
            .catch(function(error) {
                $("#task_dtl_btn_AddUser_from_Selected")
                    .html("LUU")
                    .removeClass("disabled");
            });

        list_user_need_update = [];
    });

    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////         EVENT END
    ////////////////////////////////////////////////////
});