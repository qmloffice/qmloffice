=====================================================S
Cách thức: vào link: https://id.matbao.net/users/login/

User: MB1544879
Chọn mục “Tìm lại” tại dòng – Quên mật khẩu   

Sau đó, nhập lại MB1544879 và nhấp “GỬI”

Hệ thông sẽ gửi mail reset mật khẩu về mail: quanmanlinh@gmail.com

kiểm tra mail và tạo lại mật khẩu:

Đăng nhập lại vào trang id.matbao.net bằng user và mật khẩu vừa tạo

User: MB1544879(tên miền) - MB1615154 (Cpanel- email : qml.babymommycare@gmail.com 0315767761- DB)
Pass: BabyCare123$$

Cpanel : 
User : bab11636_QMLadmi 
pass : -peLj^cR#J~E -peLj^cR#J~E   -peLj^cR#J~E  {ym(d)bXpRM[  {ym(d)bXpRM[


================================================================ 1
http://babymommycare.com/admin
User: sysadmin
Pass: &7Jy2Tavdb3u7lO%XZ
================================================================ 2
file zilla : 
host : babymommycare.com  
User : test@babymommycare.com 
pass : test@babymommycare.com
================================================================ 3
https://manage.matbao.net/dashboard/
1. Cpanel
user : MB1615154
pass : BabyCare123$$
2. tên miền
user : MB1544879
pass : BabyCare123$$
3. DB mysql
================================================================ 4
GIT hub code trang web : 
       qmloffice.site
       qmloffice.babymommycare@gmail.com  0932900606Baby@

heroku : qmloffice.babymommycare@gmail.com
        0932900606Baby@
================================================================ END



// https://github.com/lqvinh2/QMLAdmin.git

// https://github.com/carhartl/jquery-cookie
// https://github.com/andris9/jStorage


$.cookie(GV_CK_SIGNIN_SUCCESS, 'valueeee', {
                                expires: 1,
                                path: '/'
                            });
 



$.cookie(GV_CK_SIGNIN_SUCCESS);


$.removeCookie(GV_CK_SIGNIN_SUCCESS, { path: '/' }); // => true



https://github.com/axios/axios


       axios.get(GV_Server_Address + "/gettaskbyid", {
                params: {
                    data
                }
            }).then(function(response) {
                // handle success
                let dataAfterGet = response.data;
                if (response.errno != undefined) {

                } else {
                    $("#btn_opentask").attr('data-toggle', 'modal');
                    $("#btn_opentask").attr('data-target', '#modalDetailTaskForm');
                }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            



    //         ==========================================

    //           if ($.cookie(GV_CK_SIGNIN_SUCCESS) == GV_SIGN_IN_1_TIME) {
    //     flgSignInSuccess = true;
    // } else {
    //     if (
    //         $.cookie(GV_CK_SIGNIN_SUCCESS) == "" ||
    //         $.cookie(GV_CK_SIGNIN_SUCCESS) == undefined
    //     ) {
    //         //$("body").load("signIn.html");

    //         window.open("signIn.html", "_self");
    //         // window.load("signIn.html");
    //     } else {
    //         flgSignInSuccess = true;
    //     }
    // }

    // if (flgSignInSuccess == false) {
    //     window.open("signIn.html", "_self");
    // }
    // if (
    //     $.cookie(GV_CK_SIGNIN_STORE_INFO) != "" ||
    //     $.cookie(GV_CK_SIGNIN_STORE_INFO) != undefined
    // ) {
    //     // window.open("signIn.html", "_self");

    // }



























// index đầy đủ item

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1,
            shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>MMMMMMMMMMMMMMMM</title>
    <!-- MDB icon -->
    <link rel="icon" href="img/mdb-favicon.ico" type="image/x-icon">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <!-- Material Design Bootstrap -->
    <link rel="stylesheet" href="css/mdb.min.css">
    <!-- Your custom styles (optional) -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="js/jsTree/themes/default/style.min.css">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
</head>

<body>



    <!-- START your project here-->
    <!-- START your project here-->
    <!-- START your project here-->

    <main class="pt-4" style="padding-left: 0px;">
        <div class="container-fluid">

            <!-- row jsTree S-->
            <div class="row" style="padding: 0.5%;">
                <div id="jstree_div" class="border border-danger col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9"></div>
            </div>

            <!-- row jsTree E-->

            <!--Grid row-->
            <div class="row">
                <!--Grid column S-1-->
                <div class="col-md-9 mb-4">

                    <!--Section: Action elements-->
                    <section>
                        <!--Grid row-->
                        <div class="row">
                            <!--Grid column-->
                            <div class="col-md-9 mb-4">
                                <!--Card-->
                                <div class="card">
                                    <!--Card content-->
                                    <div class="card-body">
                                        <form id="filter-questions-form" class="d-flex justify-content-center" action="/support">
                                            <!-- Default input -->
                                            <input type="search" name="qs" placeholder="Type your query" aria-label="Search" id="search-input" class="form-control" value="">
                                            <button class="btn btn-unique btn-rounded btn-sm my-0 p waves-effect waves-light" type="submit">
                                                <i class="fas fa-search"></i>
                                            </button>
                                            <input type="hidden" name="filter" id="status-input" value="">
                                            <input type="hidden" name="author" id="author-input" value="">
                                            <input type="hidden" name="sort" id="sort-input" value="">
                                            <input type="hidden" name="user" id="user-input" value="">
                                        </form>
                                    </div>
                                </div>
                                <!--/.Card-->
                            </div>
                            <!--Grid column-->
                            <!--Grid column-->
                            <div class="col-md-3 mb-4">
                                <a href="/support-ask-question/" class="btn btn-info btn-rounded btn-block mt-3 waves-effect waves-light">Ask
                                    question</a>
                            </div>
                            <!--Grid column-->
                        </div>
                        <!--Grid row-->
                    </section>
                    <!--Section: Action elements-->


                    <!--Section: Topics-->
                    <section>
                        <!--Top Table UI-->
                        <div class="card p-2 mb-4">
                            <!--Grid row-->
                            <div class="row">
                                <!--Grid column-->
                                <div class="col-md-4">
                                    <!--Blue select-->
                                    <div class="select-wrapper mdb-select md-form colorful-select dropdown-info mx-2 my-0">
                                        <span class="caret">▼</span><input type="text" class="select-dropdown form-control" readonly="true" required="false" data-activates="select-options-status-filter" value="" role="listbox" aria-multiselectable="false"
                                            aria-disabled="false" aria-required="false" aria-haspopup="true" aria-expanded="false">
                                        <ul id="select-options-status-filter" class="dropdown-content select-dropdown w-100" style="display: none; width: 186px; position: absolute; top: 0px; left: 0px; opacity: 1;">
                                            <li class="disabled  " role="option" aria-selected="false" aria-disabled="true"><span class="filtrable "> Filter </span></li>
                                            <li class=" active " role="option" aria-selected="true" aria-disabled="false"><span class="filtrable "> Show all topics </span>
                                            </li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Opened </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Answered </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Resolved </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Closed </span></li>
                                        </ul><select id="status-filter" class="mdb-select md-form colorful-select dropdown-info mx-2 my-0 initialized">
                                            <option value="" disabled="">Filter</option>
                                            <option value="all" selected="">Show all topics</option>
                                            <option value="open">Opened</option>
                                            <option value="answered">Answered</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    <!--/Blue select-->
                                </div>
                                <!--Grid column-->
                                <!--Grid column-->
                                <div class="col-md-4">
                                    <!--Blue select-->
                                    <div class="select-wrapper mdb-select md-form colorful-select dropdown-info mx-2 my-0">
                                        <span class="caret">▼</span><input type="text" class="select-dropdown form-control" readonly="true" required="false" data-activates="select-options-category-filter" value="" role="listbox" aria-multiselectable="false"
                                            aria-disabled="false" aria-required="false" aria-haspopup="true" aria-expanded="false">
                                        <ul id="select-options-category-filter" class="dropdown-content select-dropdown w-100 " style="display: none; max-height: 180px;">
                                            <li class="disabled  " role="option" aria-selected="false" aria-disabled="true"><span class="filtrable "> Choose Category </span>
                                            </li>
                                            <li class=" active " role="option" aria-selected="true" aria-disabled="false"><span class="filtrable "> Show all categories
                                                </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> General Bootstrap questions </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Angular </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> jQuery </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> React </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Vue </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Other </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> MDB Academy </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> MDB 5 </span></li>
                                        </ul><select id="category-filter" class="mdb-select md-form colorful-select dropdown-info mx-2 my-0 initialized">
                                            <option value="" disabled="">Choose Category</option>
                                            <option value="all" data-url="/support" selected="">Show all categories
                                            </option>
                                            <option value="1001" data-url="/support/cat/general">General Bootstrap
                                                questions</option>
                                            <option value="1002" data-url="/support/cat/angular">Angular</option>
                                            <option value="1003" data-url="/support/cat/jquery">jQuery</option>
                                            <option value="1004" data-url="/support/cat/react">React</option>
                                            <option value="1005" data-url="/support/cat/vue">Vue</option>
                                            <option value="1006" data-url="/support/cat/other">Other</option>
                                            <option value="1031" data-url="/support/cat/academy">MDB Academy</option>
                                            <option value="1033" data-url="/support/cat/standard">MDB 5</option>
                                        </select>
                                    </div>
                                    <!--/Blue select-->
                                </div>
                                <!--Grid column-->
                                <!--Grid column-->
                                <div class="col-md-4">
                                    <!--Blue select-->
                                    <div class="select-wrapper mdb-select md-form colorful-select dropdown-info mx-2 my-0">
                                        <span class="caret">▼</span><input type="text" class="select-dropdown form-control" readonly="true" required="false" data-activates="select-options-sort-filter" value="" role="listbox" aria-multiselectable="false"
                                            aria-disabled="false" aria-required="false" aria-haspopup="true" aria-expanded="false">
                                        <ul id="select-options-sort-filter" class="dropdown-content select-dropdown w-100 " style="display: none;">
                                            <li class="disabled active " role="option" aria-selected="true" aria-disabled="true"><span class="filtrable "> Sort by </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Views </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Answers </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Votes </span></li>
                                            <li class="  " role="option" aria-selected="false" aria-disabled="false">
                                                <span class="filtrable "> Date </span></li>
                                        </ul><select id="sort-filter" class="mdb-select md-form colorful-select dropdown-info mx-2 my-0 initialized">
                                            <option value="" disabled="" selected="">Sort by</option>
                                            <option value="views">Views</option>
                                            <option value="answers">Answers</option>
                                            <option value="votes">Votes</option>
                                            <option value="date">Date</option>
                                        </select>
                                    </div>
                                    <!--/Blue select-->
                                </div>
                                <!--Grid column-->
                            </div>
                            <!--Grid row-->
                        </div>
                        <!--Top Table UI-->
                        <!--Card-->
                        <div class="card mb-4">
                            <!--Card content-->
                            <div class="card-body">
                                <!--Table-->
                                <div class="table-responsive">
                                    <table class="table table-hover table-forum text-center">
                                        <!--Table head-->
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th class="text-left">Topic</th>
                                                <th>Category</th>
                                                <th>Views</th>
                                                <th>Answers</th>
                                                <th>Votes</th>
                                            </tr>
                                        </thead>
                                        <!--Table head-->
                                        <!--Table body-->
                                        <tbody>
                                            <tr style="background-color:aquamarine;">
                                                <th scope="row">
                                                    <i class="fas fa-reply purple-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Answered"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/react/attributes-in-mdbdatatable-not-working/" class="font-weight-bold blue-text">Attributes in MDBDataTable not working?</a>
                                                    <div>
                                                        <strong>Piotr Glejzer</strong>
                                                        <span class="badge purple mx-1">staff</span> <span>commented 55
                                                            minutes ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/react" class="font-weight-bold blue-text">React</a>
                                                </td>
                                                <td>400</td>
                                                <td>1</td>
                                                <td>1</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-reply purple-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Answered"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/react/react-router-v6/" class="font-weight-bold blue-text">React Router v6</a>
                                                    <div>
                                                        <strong>Piotr Glejzer</strong>
                                                        <span class="badge purple mx-1">staff</span> <span>commented 56
                                                            minutes ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/react" class="font-weight-bold blue-text">React</a>
                                                </td>
                                                <td>62</td>
                                                <td>1</td>
                                                <td>0</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-question indigo-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Open"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/react/mdbmodal-not-working/" class="font-weight-bold blue-text">MDBModal Not Working</a>
                                                    <div>
                                                        <strong>Piotr Glejzer</strong>
                                                        <span class="badge purple mx-1">staff</span> <span>commented 57
                                                            minutes ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/react" class="font-weight-bold blue-text">React</a>
                                                </td>
                                                <td>47</td>
                                                <td>0</td>
                                                <td>0</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-reply purple-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Answered"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/angular/dropdown-goes-to-left/" class="font-weight-bold blue-text">Dropdown goes to left</a>
                                                    <div>
                                                        <strong>patricio.ortiz@daltum.mx</strong>
                                                        <span class="badge blue mx-1">pro</span> <span class="badge amber mx-1">premium</span> <span>commented an
                                                            hour ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/angular" class="font-weight-bold blue-text">Angular</a>
                                                </td>
                                                <td>72</td>
                                                <td>0</td>
                                                <td>0</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-question indigo-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Open"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/angular/preloading-fonts/" class="font-weight-bold blue-text">Preloading Fonts</a>
                                                    <div>
                                                        <strong>myictsolutions</strong>
                                                        <span class="badge blue mx-1">pro</span> <span class="badge amber mx-1">premium</span> <span>published an
                                                            hour ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/angular" class="font-weight-bold blue-text">Angular</a>
                                                </td>
                                                <td>2</td>
                                                <td>0</td>
                                                <td>0</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-reply purple-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Answered"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/jquery/btn-outline-secondary/" class="font-weight-bold blue-text">btn-outline-secondary</a>
                                                    <div>
                                                        <strong>AlessioB</strong>
                                                        <span class="badge blue mx-1">pro</span> <span>answered 2 hours
                                                            ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/jquery" class="font-weight-bold blue-text">jQuery</a>
                                                </td>
                                                <td>11</td>
                                                <td>1</td>
                                                <td>0</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-question indigo-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Open"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/other/will-mbd-components-work-in-the-foundation-framework/" class="font-weight-bold blue-text">Will MBD components work in
                                                        the Foundation Framework?</a>
                                                    <div>
                                                        <strong>Grzegorz Bujański</strong>
                                                        <span class="badge purple mx-1">staff</span> <span>commented 2
                                                            hours ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/other" class="font-weight-bold blue-text">Other</a>
                                                </td>
                                                <td>6</td>
                                                <td>0</td>
                                                <td>0</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-question indigo-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Open"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/angular/tabsetcomponent-object-is-undefined-in-ngafterviewinit/" class="font-weight-bold blue-text">TabsetComponent object is
                                                        undefined in ngAfterViewInit()</a>
                                                    <div>
                                                        <strong>natenoctel</strong>
                                                        <span>commented 2 hours ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/angular" class="font-weight-bold blue-text">Angular</a>
                                                </td>
                                                <td>11</td>
                                                <td>0</td>
                                                <td>0</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-question indigo-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Open"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/jquery/sidenav-requires-two-taps-on-iphone-and-ipad/" class="font-weight-bold blue-text">SideNav Requires Two Taps on
                                                        iPhone and iPad</a>
                                                    <div>
                                                        <strong>Grzegorz Bujański</strong>
                                                        <span class="badge purple mx-1">staff</span> <span>commented 2
                                                            hours ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/jquery" class="font-weight-bold blue-text">jQuery</a>
                                                </td>
                                                <td>12</td>
                                                <td>0</td>
                                                <td>0</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <i class="fas fa-question indigo-text" data-toggle="tooltip" data-placement="top" title="" data-original-title="Open"></i>
                                                </th>
                                                <td class="text-left">
                                                    <a href="https://mdbootstrap.com/support/angular/need-help-with-mdb-progress-ariavalue-now-property/" class="font-weight-bold blue-text">Need help with mdb-progress
                                                        ariavalue-now property</a>
                                                    <div>
                                                        <strong>mnikam</strong>
                                                        <span class="badge blue mx-1">pro</span> <span class="badge amber mx-1">premium</span> <span>commented 3
                                                            hours ago</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="https://mdbootstrap.com/support/cat/angular" class="font-weight-bold blue-text">Angular</a>
                                                </td>
                                                <td>14</td>
                                                <td>0</td>
                                                <td>0</td>
                                            </tr>
                                        </tbody>
                                        <!--Table body-->
                                    </table>
                                </div>
                                <!--Table-->
                                <hr>
                                <!--Bottom Table UI-->
                                <div class="d-flex justify-content-center">
                                    <!--Pagination -->
                                    <nav class="my-2 pt-2">
                                        <ul class="pagination pagination-circle pg-info mb-0">
                                            <!--First-->
                                            <li class="page-item disabled clearfix d-none d-md-block">
                                                <a class="page-link waves-effect">First</a>
                                            </li>
                                            <!--Arrow left-->
                                            <li class="page-item disabled">
                                                <a class="page-link waves-effect" aria-label="Previous">
                                                    <span aria-hidden="true">«</span>
                                                    <span class="sr-only">Previous</span>
                                                </a>
                                            </li>
                                            <!--Numbers-->
                                            <li class="page-item active">
                                                <a href="/support/page/1/" class="page-link waves-effect">1</a>
                                            </li>
                                            <li class="page-item">
                                                <a href="/support/page/2/" class="page-link waves-effect">2</a>
                                            </li>
                                            <li class="page-item">
                                                <a href="/support/page/3/" class="page-link waves-effect">3</a>
                                            </li>
                                            <li class="page-item">
                                                <a href="/support/page/4/" class="page-link waves-effect">4</a>
                                            </li>
                                            <li class="page-item">
                                                <a href="/support/page/5/" class="page-link waves-effect">5</a>
                                            </li>
                                            <!--Arrow right-->
                                            <li class="page-item">
                                                <a href="/support/page/2/" class="page-link waves-effect" aria-label="Next">
                                                    <span aria-hidden="true">»</span>
                                                    <span class="sr-only">Next</span>
                                                </a>
                                            </li>
                                            <!--First-->
                                            <li class="page-item clearfix d-none d-md-block">
                                                <a href="/support/page/1116/" class="page-link waves-effect">Last</a>
                                            </li>
                                        </ul>
                                    </nav>
                                    <!--/Pagination -->
                                </div>
                                <!--Bottom Table UI-->
                            </div>
                        </div>
                        <!--/.Card-->
                    </section>
                    <!--Section: Topics-->
                </div>
                <!--Grid column E-1-->


                <!--Grid column S-2-->
                <div class="col-md-3 mb-4">
                    <!--Card-->
                    <div class="card users-listing-small">
                        <div class="card-header text-center py-3 cc_cursor">
                            <h4>Top contributors</h4>
                        </div>
                        <!--Card content-->
                        <div class="card-body">
                            <ul class="list-unstyled">
                                <li class="media">
                                    <img src="https://secure.gravatar.com/avatar/bda8809b9cea6787ae25443065983c5d?s=96&amp;d=mm&amp;r=g" alt="" class="rounded-circle mr-2">
                                    <div class="media-body top-creators-card">
                                        <h5 class="mt-0 mb-2 font-weight-bold">1.
                                            <a href="/profile/?id=22796">itay</a>
                                        </h5>
                                        <!-- Achievements -->
                                        <a class="badge purple darken-4">2447<i
                                                class="far fa-thumbs-up mx-1"></i>Support score</a>
                                        <br>
                                        <!--<a class="badge pink darken-2">7 snippets</a>-->
                                        <!--<a class="badge deep-orange darken-2">8 articles</a>-->
                                        <a class="badge purple" href="/support/?user=22796">150<i
                                                class="fas fa-question mx-1"></i>Questions</a>
                                        <a class="badge purple darken-2" href="/support/?userAnswered=22796">193<i
                                                class="far fa-comment mx-1"></i>Answers</a>
                                        <!-- <a class="badge pink">10<i class="fas fa-rocket mx-1"></i>Contributions</a> -->
                                        <!-- <a class="badge pink darken-4"><i class="fas fa-rocket mr-1"></i>Silver contributor</a> -->
                                        <!-- <br> -->
                                        <!--                         <a class="badge green"></a>
                         -->
                                        <!-- Achievements -->
                                    </div>
                                </li>
                                <hr>
                                <li class="media">
                                    <img src="https://secure.gravatar.com/avatar/cd86a7af7abf72bca02c1b498719a212?s=96&amp;d=mm&amp;r=g" alt="" class="rounded-circle mr-2">
                                    <div class="media-body top-creators-card">
                                        <h5 class="mt-0 mb-2 font-weight-bold">2.
                                            <a href="/profile/?id=41534">jouvrard</a>
                                        </h5>
                                        <!-- Achievements -->
                                        <a class="badge purple darken-4">903<i class="far fa-thumbs-up mx-1"></i>Support
                                            score</a>
                                        <br>
                                        <!--<a class="badge pink darken-2">7 snippets</a>-->
                                        <!--<a class="badge deep-orange darken-2">8 articles</a>-->
                                        <a class="badge purple" href="/support/?user=41534">47<i
                                                class="fas fa-question mx-1"></i>Questions</a>
                                        <a class="badge purple darken-2" href="/support/?userAnswered=41534">70<i
                                                class="far fa-comment mx-1"></i>Answers</a>
                                        <!-- <a class="badge pink">10<i class="fas fa-rocket mx-1"></i>Contributions</a> -->
                                        <!-- <a class="badge pink darken-4"><i class="fas fa-rocket mr-1"></i>Silver contributor</a> -->
                                        <!-- <br> -->
                                        <!--                         <a class="badge green"></a>
                         -->
                                        <!-- Achievements -->
                                    </div>
                                </li>
                                <hr>
                                <li class="media">
                                    <img src="https://secure.gravatar.com/avatar/3595fbb6add527f3eb695539f81c23a5?s=96&amp;d=mm&amp;r=g" alt="" class="rounded-circle mr-2">
                                    <div class="media-body top-creators-card">
                                        <h5 class="mt-0 mb-2 font-weight-bold">3.
                                            <a href="/profile/?id=82601">Grzegorz Bujański</a>
                                        </h5>
                                        <!-- Achievements -->
                                        <a class="badge purple darken-4">724<i class="far fa-thumbs-up mx-1"></i>Support
                                            score</a>
                                        <br>
                                        <!--<a class="badge pink darken-2">7 snippets</a>-->
                                        <!--<a class="badge deep-orange darken-2">8 articles</a>-->
                                        <a class="badge purple" href="/support/?user=82601">0<i
                                                class="fas fa-question mx-1"></i>Questions</a>
                                        <a class="badge purple darken-2" href="/support/?userAnswered=82601">67<i
                                                class="far fa-comment mx-1"></i>Answers</a>
                                        <!-- <a class="badge pink">10<i class="fas fa-rocket mx-1"></i>Contributions</a> -->
                                        <!-- <a class="badge pink darken-4"><i class="fas fa-rocket mr-1"></i>Silver contributor</a> -->
                                        <!-- <br> -->
                                        <!--                         <a class="badge green"></a>
                         -->
                                        <!-- Achievements -->
                                    </div>
                                </li>
                                <hr>
                                <li class="media">
                                    <img src="https://secure.gravatar.com/avatar/15d5eff0844a0662b19c432be551ea8c?s=96&amp;d=mm&amp;r=g" alt="" class="rounded-circle mr-2">
                                    <div class="media-body top-creators-card">
                                        <h5 class="mt-0 mb-2 font-weight-bold">4.
                                            <a href="/profile/?id=68939">David J</a>
                                        </h5>
                                        <!-- Achievements -->
                                        <a class="badge purple darken-4">556<i class="far fa-thumbs-up mx-1"></i>Support
                                            score</a>
                                        <br>
                                        <!--<a class="badge pink darken-2">7 snippets</a>-->
                                        <!--<a class="badge deep-orange darken-2">8 articles</a>-->
                                        <a class="badge purple" href="/support/?user=68939">18<i
                                                class="fas fa-question mx-1"></i>Questions</a>
                                        <a class="badge purple darken-2" href="/support/?userAnswered=68939">45<i
                                                class="far fa-comment mx-1"></i>Answers</a>
                                        <!-- <a class="badge pink">10<i class="fas fa-rocket mx-1"></i>Contributions</a> -->
                                        <!-- <a class="badge pink darken-4"><i class="fas fa-rocket mr-1"></i>Silver contributor</a> -->
                                        <!-- <br> -->
                                        <!--                         <a class="badge green"></a>
                         -->
                                        <!-- Achievements -->
                                    </div>
                                </li>
                                <hr>
                                <li class="media">
                                    <img src="https://secure.gravatar.com/avatar/0a7481118a5b3a7fa67b7de9e09ddb8f?s=96&amp;d=mm&amp;r=g" alt="" class="rounded-circle mr-2">
                                    <div class="media-body top-creators-card">
                                        <h5 class="mt-0 mb-2 font-weight-bold">5.
                                            <a href="/profile/?id=66215">digitalmanagerguru</a>
                                        </h5>
                                        <!-- Achievements -->
                                        <a class="badge purple darken-4">551<i class="far fa-thumbs-up mx-1"></i>Support
                                            score</a>
                                        <br>
                                        <!--<a class="badge pink darken-2">7 snippets</a>-->
                                        <!--<a class="badge deep-orange darken-2">8 articles</a>-->
                                        <a class="badge purple" href="/support/?user=66215">51<i
                                                class="fas fa-question mx-1"></i>Questions</a>
                                        <a class="badge purple darken-2" href="/support/?userAnswered=66215">29<i
                                                class="far fa-comment mx-1"></i>Answers</a>
                                        <!-- <a class="badge pink">10<i class="fas fa-rocket mx-1"></i>Contributions</a> -->
                                        <!-- <a class="badge pink darken-4"><i class="fas fa-rocket mr-1"></i>Silver contributor</a> -->
                                        <!-- <br> -->
                                        <!--                         <a class="badge green"></a>
                         -->
                                        <!-- Achievements -->
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--/.Card-->
                </div>
                <!--Grid column E-2-->
            </div>
            <!--Grid row-->
        </div>
    </main>



    <!-- row button signOut Start -->
    <button type="button" id="btn_signOut" class="btn btn-dark-green">Sign Out</button>
    <!-- row button signOut END -->



    <!-- END your project here-->
    <!-- END your project here-->
    <!-- END your project here-->




    <!-- jQuery -->
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <!-- Bootstrap tooltips -->
    <script type="text/javascript" src="js/popper.min.js"></script>
    <!-- Bootstrap core JavaScript -->
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <!-- MDB core JavaScript -->
    <script type="text/javascript" src="js/mdb.min.js"></script>
    <!-- Your add on -->
    <script type="text/javascript" src="js/jsTree/jstree.min.js"></script>
    <script type="text/javascript" src="js/addons/jquery.cookie.js"></script>
    <script type="text/javascript" src="js/addons/jstorage.min.js"></script>
    <script type="text/javascript" src="js/addons/datatables.min.js"></script>
    <script type="text/javascript" src="js/addons/axios.min.js"></script>
    <script type="text/javascript" src="jsLocal/gobalVar.js"></script>
    <!-- Your custom scripts (optional) -->
    <script type="text/javascript" src="jsLocal/index_TaskTree.js"></script>
    <script type="text/javascript" src="jsLocal/signIn.js"></script>
    <script type="text/javascript" src="jsLocal/index.js"></script>
</body>

</html>


$(document).ready(function(){resize();});
$(window).resize(function(){resize();});

function resize()
{
    var mobileMaxWidth = 640; //Define this to whatever size you want
    if($(window).width() > mobileMaxWidth)
    {
        $("div#desktop").show();
        $("div#mobile").hide();
    }
    else
    {
        $("div#desktop").hide();
        $("div#mobile").show();
    }
}



https://www.w3schools.com/js/js_date_methods.asp


Method	Description
getFullYear()	Get the year as a four digit number (yyyy)
getMonth()	Get the month as a number (0-11)
getDate()	Get the day as a number (1-31)
getHours()	Get the hour (0-23)
getMinutes()	Get the minute (0-59)
getSeconds()	Get the second (0-59)
getMilliseconds()	Get the millisecond (0-999)
getTime()	Get the time (milliseconds since January 1, 1970)
getDay()	Get the weekday as a number (0-6)
Date.now()	Get the time. ECMAScript 5.

var d = new Date();
document.getElementById("demo").innerHTML = d.getTime();


// ==================                          param URL
https://www.sitepoint.com/get-url-parameters-with-javascript/





 function b2TaskTreeAssignDataAfterLogin() {
        var data = {
            creator_id: GV_STORE_SIGN_IN_INFO.userid,
        };

        $.ajax({
            type: "GET",
            data: data,
            contentType: "application/json",
            url: GV_Server_Address + "/getMenuByCreatorID",
            success: function(data) {
                if (data.errno != undefined) {
                    auto_SaveMenuTaskTree = setInterval(function() {
                        clearInterval(auto_SaveMenuTaskTree);
                        GF_ShowToastrWarning("KHÔNG THỂ TẢI FOLDER TREE TASK");
                        setTimeout(() => {
                            window.open("signIn.html", "_self");
                        }, 1000);
                    }, 2000);
                } else {
                    var obj = JSON.parse(data[0].tasktree);
                    // b2TaskTreeAssignData("jstree_div", obj);

                    $("#" + "jstree_div").jstree(true).settings.core.data = obj;
                    $("#" + "jstree_div")
                        .jstree(true)
                        .refresh();

                    var timeOut = setTimeout(function() {
                        if (
                            bCheckToIndexFromDetail == true &&
                            $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) != null &&
                            $.jStorage.get(GV_KEY_STORE_TASK_GRP_TASK_DETAIL) != undefined
                        ) {
                            bCheckToIndexFromDetail = false;
                            var arr_ID_Parents =
                                GV_STORE_TASK_GRP_TASK_DETAIL.arr_ID_Parents_Folder;
                            var textP = "";
                            array_key_store_node = [];
                            // set color of all parents Start
                            $.each(arr_ID_Parents, function(index, value) {
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
                                cur_pathFolder =
                                    cur_pathFolder +
                                    (cur_pathFolder === "" ? "" : " > ") +
                                    node.text;
                            });

                            $("#path_folder").html(cur_pathFolder);
                            // set color of all parents End
                            cur_folderID = GV_STORE_TASK_GRP_TASK_DETAIL.cur_folderID;
                            ShowGrpTaskAndTaskDetail();
                        }
                    }, 500);
                }
            },
            error: function(err) {},
        });
    }
    

             if (fullName == '' || fullName == null || fullName == undefined) {
                                fullName = user.lastname + " " + user.firstname;
                            }
                            
                                <!-- https://harvesthq.github.io/chosen/ show list below -->





       $("#create_task_group_btn_create_email_contain").click(function(e) {
        var control_richText = undefined;
        var control_file_email = $("#fileinput2");
        var control_file_name_email = ("#fileinput3");

        $("#div_textarea_email_container")
            .find(".richText-editor")
            .each(function() {
                //var id_richText = $(this).attr('id');
                control_richText = $(this);
                var hdr = $("#email_contain_header").val();
                var htmlEmail = control_richText[0].outerHTML;
                var ArrayFile = undefined;

                if (hdr.trim() === "" || hdr.trim().length < 3) {
                    $("#email_contain_header").focus();
                    return;
                }

                $("#show_spinner_upload_file").show();

                var d = GetSysDate();
                var t = GetSysTime();
                var idCmtMst = GenUserID();

                var data = {
                    id: idCmtMst,
                    creator_id: GV_STORE_TASK_GRP_TASK_DETAIL.creator_id,
                    task_grp_detail_id: GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id,
                    cmt_contain: htmlEmail,
                    cmt_type: "MST_EMAIL",
                    cmt_mst_id: "",
                    cmt_mst_header: hdr,
                    updatedate: d,
                    updatetime: t,
                    create_datetime: d + t,
                };

                // post data
                // in SERVER get data USING :  req.body.data
                axios
                    .post(GV_Server_Address + "/InsertCmtMst", {
                        data: data,
                    })
                    .then(function(response) {
                        if (response.data.errno != undefined) {
                            // ERR

                            $("#email_contain_header").focus();
                        } else {
                            // SUCCESS

                            // get file start====================================================================
                            var cntFile = control_file_email.prop("files").length;
                            if (cntFile == 0) {
                                ArrayFile = undefined;

                                GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHeader = '';
                                GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHtml = '';

                                GF_SetjStorage(
                                    GV_KEY_STORE_TASK_GRP_TASK_DETAIL,
                                    GV_STORE_TASK_GRP_TASK_DETAIL
                                );

                                Load_All_Email_Comment_File();
                                // HandleAssignEmailToFormDetail(hdr, htmlEmail, idCmt, ArrayFile);
                                control_richText.html("");
                                $("#email_contain_header").val("");
                                $("#email_contain_header").focus();

                                return;
                            }
                            var formData = new FormData();
                            var d = GetSysDate();
                            var t = GetSysTime();
                            formData.append(
                                "task_grp_detail_id",
                                GV_STORE_TASK_GRP_TASK_DETAIL.task_grp_detail_id
                            );
                            formData.append("idCmt", idCmtMst);
                            formData.append(
                                "creator_id",
                                GV_STORE_TASK_GRP_TASK_DETAIL.creator_id
                            );
                            formData.append(
                                "accesstoken",
                                GV_STORE_TASK_GRP_TASK_DETAIL.accesstoken
                            );
                            formData.append("updatedate", d);
                            formData.append("updatetime", t);
                            formData.append("create_datetime", d + t);

                            if (cntFile == 1) {
                                formData.append("flag_multiFlag", "false");
                            } else if (cntFile > 1) {
                                formData.append("flag_multiFlag", "true");
                            }

                            for (let index = 0; index < cntFile; index++) {
                                formData.append(
                                    "userfile",
                                    control_file_email.prop("files")[index]
                                );
                            }

                            $.ajax({
                                method: "POST",
                                url: GV_Server_Address + "/uploadFile",
                                data: formData,
                                //contentType: 'application/json',

                                contentType: false,
                                processData: false,
                                cache: false,

                                success: function(data) {
                                    if (data.errno) {
                                        // ERR

                                        $("#show_msg_err_upload_file").show();
                                        setTimeout(function() {

                                            GV_STORE_TASK_GRP_TASK_DETAIL.verifyGoogleAcc = "true";


                                            $("#div_textarea_email_container").find(".richText-editor").each(function() {
                                                //var id_richText = $(this).attr('id');
                                                control_richText = $(this);
                                                var hdr = $("#email_contain_header").val();
                                                var htmlEmail = control_richText[0].outerHTML;

                                                GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHeader = hdr;
                                                GV_STORE_TASK_GRP_TASK_DETAIL.EmailContainHtml = htmlEmail;
                                            });

                                            GF_SetjStorage(
                                                GV_KEY_STORE_TASK_GRP_TASK_DETAIL,
                                                GV_STORE_TASK_GRP_TASK_DETAIL
                                            );

                                            $("#show_msg_err_upload_file").hide();
                                            location.href = GV_Server_Address + GV_auth_google;
                                        }, 1500);
                                    } else {
                                        // SCC

                                        control_richText.html("");
                                        $("#email_contain_header").val("");
                                        control_file_name_email.val("");

                                        GF_ShowToastrSuccess("THÀNH CÔNG!!");

                                        // HandleAssignEmailToFormDetail(hdr, htmlEmail, idCmt, data);
                                        Load_All_Email_Comment_File();


                                        control_file_email.val("");
                                    } // END SCC
                                },
                                error: function(err) {

                                    $("#show_msg_err_upload_file").show();
                                    setTimeout(function() {

                                        GV_STORE_TASK_GRP_TASK_DETAIL.verifyGoogleAcc = "true";
                                        GF_SetjStorage(
                                            GV_KEY_STORE_TASK_GRP_TASK_DETAIL,
                                            GV_STORE_TASK_GRP_TASK_DETAIL
                                        );
                                        $("#show_msg_err_upload_file").hide();
                                        location.href = GV_Server_Address + GV_auth_google;
                                    }, 1500);
                                },
                            });

                            // get file end====================================================================



                            $("#email_contain_header").focus();

                        } // }// end else SUCCESS
                    })
                    .catch(function(error) {
                        console.log(error);
                        $("#email_contain_header").focus();
                    });
            });
    });
    
                                