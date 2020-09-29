var now = new Date();
now.setMonth(now.getMonth() - 1);
// cookievalue = "asdasdasd" + ";"

// document.cookie = "name11=" + cookievalue;
// document.cookie = "expires=" + now.toUTCString() + ";"

// $.removeCookie(GV_CK_SIGNIN_SUCCESS, {
//     path: '/'
// });

$(document).ready(function () {
    var curTaskID = "";
    var ArrSelectedListWhenClickOnCheckBox = [];
    var auto_SaveMenuTaskTree;

    let data_USER_AfterGet = [];
    let data_TASK_USER_AfterGet = [];

    var flgSignInSuccess = false;

    // commonFunction.js
    HandleSignInSuccessBackToSignInWhenLoginFail();

    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////    TASK TREE START
    ////////////////////////////////////////////////////////////////
    var array_key_store_node = [];

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

    function b2TaskTreeInit(taskTreeName) {
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
                        variant: "big", // show icon is big or small
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
                            create_file: {
                                label: "File",
                                action: function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    inst.create_node(
                                        obj, {
                                        type: "file",
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
                    "dnd",
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
            .on("delete_node.jstree", function (e, data) { })
            .on("create_node.jstree", function (e, data) {
                console.log("create_node");
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
                HandleClickTaskOnTree(selectedNode);
            });

        $("#" + taskTreeName)
            .jstree(true)
            .refresh();
        var to = false;
        $("#TaskInputSearch").keyup(function () {
            if (to) {
                clearTimeout(to);
            }
            to = setTimeout(function () {
                var v = $("#TaskInputSearch").val();
                $("#jstree_div").jstree(true).search(v);
            }, 250);
        });
    }

    // from HandleSaveMenuAfterAction
    function updateMENUtoDB() {
        var v = $("#jstree_div").jstree(true).get_json("#", {
            flat: true,
        });
        var taskTree = JSON.stringify(v).toString();

        var data = {
            id: GV_STORE_SIGN_IN_INFO.menu_id,
            tasktree: taskTree,
        };

        $.ajax({
            type: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: GV_Server_Address + "/updatemenuafteraction",
            success: function (data) {
                if (data.errno != undefined) { } else {
                    $("#jstree_div_status").html(`  
                    <button class="btn btn-primary" type="button">
                    <span class="" role="status" aria-hidden="true"></span>
                    SAVED
                  </button>
                  `);
                }
            },
            error: function (err) {
                $("#user_fname").prop("readonly", false);
                console.log(err);
            },
        });
    }

    function HandleSaveMenuAfterAction(text) {
        $("#jstree_div_status").html(
            `  
        <button class="btn btn-primary" type="button">
        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>` + text + `
         </button>
      `
        );

        auto_SaveMenuTaskTree = setInterval(function () {
            updateMENUtoDB();
            clearInterval(auto_SaveMenuTaskTree);
        }, 3000);
    }

    // when flgSignInSuccess
    function b2TaskTreeAssignData(taskTreeName, newData) {
        $("#" + taskTreeName).jstree(true).settings.core.data = newData;
        $("#" + taskTreeName)
            .jstree(true)
            .refresh();
    }

    // call from b2TaskTreeInit
    function HandleClickTaskOnTree(selectedNode) {
        if (selectedNode && selectedNode.selected && selectedNode.selected.length) { } else {
            // $('#data .content').hide();
            // $('#data .default').html('Select a file from the tree.').show();
        }

        $.get(
            "?operation=get_content&id=" + selectedNode.selected.join(":"),
            function (d) {
                if (selectedNode.node && selectedNode.node != undefined) {
                    curTaskID = "";

                    let typeName = "file";
                    if (
                        selectedNode.node.type
                            .toString()
                            .toLowerCase()
                            .includes("default") ||
                        selectedNode.node.type.toString().toLowerCase().includes("folder")
                    ) {
                        typeName = "folder";
                    }

                    // console.log("Click on " + typeName + " has ID : " + selectedNode.node.id);

                    var flg = false;
                    if (selectedNode.node.parents.length == 1) {
                        flg = true;
                        $("#txtShowSelectedNote").text(selectedNode.node.text);
                    }

                    if (flg == false && selectedNode.node.parents.length > 1) {
                        flg = true;
                        // .reverse();
                        var arrParents = selectedNode.node.parents;
                        arrParents = selectedNode.node.parents;
                        var textP = "";

                        // reset all parent to black text
                        if (array_key_store_node.length > 0) {
                            $.each(array_key_store_node, function (index, value) {
                                var node = $("#jstree_div").jstree(true).get_node(value);

                                $("#" + value + "_anchor").css({
                                    color: "black",
                                    "background-color": "",
                                });
                            });
                        }

                        // set color of all parents
                        $.each(arrParents, function (index, value) {
                            if (value == "#") {
                                return;
                            }

                            array_key_store_node.push(value);
                            var node = $("#jstree_div").jstree(true).get_node(value);
                            $("#" + value + "_anchor").css({
                                color: "yellow",
                                "background-color": "blue",
                            });

                            textP = textP + "/" + node.text;
                        });

                        array_key_store_node.push(selectedNode.node.id);
                        $("#" + selectedNode.node.id + "_anchor").css({
                            color: "yellow",
                            "background-color": "blue",
                        });

                        textP = textP + "/" + selectedNode.node.text;
                        $("#txtShowSelectedNote").text(textP);
                    }

                    // open form task detail
                    if (typeName == "file") {
                        OpenFormTaskDetail(typeName, selectedNode);
                    }
                }
            }
        );
    } // end HandleClickTaskOnTree

    // call from HandleClickTaskOnTree
    function OpenFormTaskDetail(typeName, selectedNode) {
        //console.log("Click on " + typeName + " has ID : " + selectedNode.node.id);
        curTaskID = selectedNode.node.id;
    } // end OpenFormTaskDetail

    // btn save tree
    $("#Save_jstree").click(function () {
        var v = $("#jstree_div").jstree(true).get_json("#", {
            flat: true,
        });
        var mytext = JSON.stringify(v).toString();
    });

    // btn open all task
    $("#Save_jstree_open_all").click(function () {
        var v = $("#jstree_div").jstree(true).open_all();
    });

    // btn close all task
    $("#Save_jstree_close_all").click(function () {
        var v = $("#jstree_div").jstree(true).close_all();
    });

    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////    TASK TREE END
    ////////////////////////////////////////////////////////////////

    // lanuch select option- mở chọn phân quyên khi đăng kí user
    $(".mdb-select").materialSelect();

    // init dataTable
    var tableListUserSelected = $("#task_dtl_table_user_list").DataTable({
        scrollX: true,
        scrollY: 200, // 40px = 1 row
    });
    $(".dataTables_length").addClass("bs-select");

    // init task tree
    b2TaskTreeInit("jstree_div");

    if (flgSignInSuccess) {
        if (
            $.jStorage.get(GV_CK_SIGNIN_STORE_INFO) != null &&
            $.jStorage.get(GV_CK_SIGNIN_STORE_INFO) != undefined
        ) {
            GV_STORE_SIGN_IN_INFO = $.jStorage.get(GV_CK_SIGNIN_STORE_INFO);

            $("#index_say_hello").html(
                "Xin chào " +
                GV_STORE_SIGN_IN_INFO.firstname +
                " " +
                GV_STORE_SIGN_IN_INFO.lastname +
                " (" +
                GV_STORE_SIGN_IN_INFO.phone1 +
                "-" +
                GV_STORE_SIGN_IN_INFO.phone2 +
                ")"
            );

            // build task tree when log in success S

            var data = {
                menuID: GV_STORE_SIGN_IN_INFO.userid,
            };

            $.ajax({
                type: "GET",
                data: data,
                contentType: "application/json",
                url: GV_Server_Address + "/getmenubyuserid",
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
                        b2TaskTreeAssignData("jstree_div", obj);
                    }
                },
                error: function (err) { },
            });

            // build task tree when log in success E
        }
    }

    $("#btn_sign_out").click(function (e) {
        HandleSignOut();
    });



    var listUserIDSelected = [];
    $("#task_dtl_btn_AddUser_from_Selected").click(function () {
        $("#task_dtl_btn_AddUser_from_Selected").prop("disabled", true);

        var storeUserIDSelected = [];
        $.each(ArrSelectedListWhenClickOnCheckBox, function (index, value) {
            storeUserIDSelected.push(value.value);
            var fullName = value.text;
            var phone1 = $(this).attr("phone_1");
            var phone2 = $(this).attr("phone_2");
            var email = $(this).attr("email");
            var address = $(this).attr("address");

            tableListUserSelected.row
                .add(["QUYỀN", fullName, email, phone1, phone2, address])
                .draw(false);
        });

        AddTask_UserToDB(curTaskID, storeUserIDSelected);
    });
    //

    $("#btn_test_id").click(function (e) {
        // tableListUserSelected.clear();
        ClearDataInDataTable(tableListUserSelected);
    });

    function ClearDataInDataTable(tableListUserSelected) {
        var rows = tableListUserSelected.rows().remove().draw();
    }

    $("#btn_opentask").click(function (e) {
        e.preventDefault();

        ClearDataInDataTable(tableListUserSelected);

        if (curTaskID == "") {
            GF_ShowToastrWarning("HÃY CHỌN TASK ĐỂ XEM CHI TIẾT");
            return;
        }

        $("#task_dtl_title").html("TASK : " + curTaskID);

        CreateSelectedListUserAndListUserInTaskDetail();

        // open modal task detail
        //  <a href="" id="btn_opentask" class="btn btn-default btn-rounded mb-4" data-toggle="modal" data-target="#modalDetailTaskForm">OPEN TASK</a>
        $("#btn_opentask").attr("data-toggle", "modal");
        $("#btn_opentask").attr("data-target", "#modalDetailTaskForm");
    });

    function CreateSelectedListUserAndListUserInTaskDetail() {
        var data = {
            id: curTaskID,
        };

        // getalluser
        axios
            .get(GV_Server_Address + "/getalluserbytaskid", {
                params: {
                    data,
                },
            })
            .then(function (response) {
                if (response.errno != undefined) { } else {
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
                    // create init text for selected user
                    var initSelectedListUser = `
                                <select id="task_dtl_SelectAddUser" class="mdb-select colorful-select dropdown-primary md-form" multiple searchable="tìm...">
                                    <option value="NONE" disabled selected>Chọn nhân viên</option>
                                </select>
                                <label class="mdb-main-label">THÊM NGƯỜI VÀO HỆ THỐNG</label>
                                <button class="btn-save btn btn-primary btn-sm">Close</button>
                                     `;

                    // assign to form
                    $("#task_dtl_div_selected_user").append(initSelectedListUser);

                    // Event when select 1 user
                    $("#task_dtl_SelectAddUser")
                        .change(function () {
                            ArrSelectedListWhenClickOnCheckBox = [];
                            var strIcon = "";
                            var varArrSelectedListOnForm = $(this).find(":selected");
                            if (varArrSelectedListOnForm.length > 1) {
                                $.each(varArrSelectedListOnForm, function (index, value) {
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

                    $.each(data_USER_AfterGet, function (indx, user) {
                        if (user.TYPE == 1) {
                            const opt = `<option value="${user.id}" email="${user.email}" phone_1="${user.phone1}" phone_2="${user.phone2}"address="${user.address}"">${user.firstname} ${user.lastname}</option>`;
                            $("#task_dtl_SelectAddUser").append(opt);
                        }
                    });
                    $(".mdb-select").materialSelect();

                    // create data for list user (dataTable) S

                    ClearDataInDataTable(tableListUserSelected);
                    $.each(data_USER_AfterGet, function (indx, user) {
                        if (user.TYPE == "2") {
                            var fullName = user.firstname + " " + user.lastname;
                            var phone1 = user.phone1;
                            var phone2 = user.phone2;
                            var email = user.email;
                            var address = user.address;

                            tableListUserSelected.row
                                .add(["QUYỀN", fullName, email, phone1, phone2, address])
                                .draw(false);
                        }
                    }); // each
                    // create data for list user (dataTable) E
                }
            }); // end then all
    }

    $("#btn_close_taskdtl").click(function (e) {
        $("#btn_opentask").attr("data-toggle", "");
        $("#btn_opentask").attr("data-target", "");
    });

    // call when press button task_dtl_btn_AddUser_from_Selected
    function AddTask_UserToDB(curTaskID, storeUserIDSelected) {
        var data = {
            curTaskID: curTaskID,
            creatorTask: GV_STORE_SIGN_IN_INFO.id,
            listUserIDSelected: storeUserIDSelected,
        };

        $.ajax({
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: GV_Server_Address + "/addtaskuser",
            success: function (data) {
                if (data.errno != undefined) {
                    GF_ShowToastrWarning(data.errno);
                    $("#task_dtl_btn_AddUser_from_Selected").prop("disabled", false);
                } else {
                    CreateSelectedListUserAndListUserInTaskDetail();

                    $("#task_dtl_btn_AddUser_from_Selected").prop("disabled", false);
                }
                ArrSelectedListWhenClickOnCheckBox = [];
            },
            error: function (err) {
                GF_ShowToastrWarning(data.errno);
                $("#task_dtl_btn_AddUser_from_Selected").prop("disabled", false);
            },
        });
    } // end  function AddTask_UserToDB()

    // call when press button task_dtl_btn_AddUser_from_Selected
    // call when press button btn_opentask
}); // end document

// $.removeCookie(GV_CK_SIGNIN_SUCCESS, {
//     path: '/'
// });