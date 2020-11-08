//import express from "express";
const express = require("express");
const upload = require("express-fileupload");

const mysql = require("mysql");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const app = express();
const fs = require("fs");
var session = require('express-session');

// const http = require('http');
// const fs = require('fs');
const mysqlConfig = require("./mysqlCon");
// const path = require('path');
// const router = express.Router();1
const cors = require("cors");

const phone = require("./phone");
const phonePrefix = require("./phonePrefix");
const baseValue = require("./baseValue");

const random_name = require("node-random-name");

const axios = require("axios");

const KEYS = require("./config/keys");

// async
const async = require("async");
const asyncHandler = require("express-async-handler");
const { google } = require("googleapis");
const stream = require("stream");

// const knex = require("knex")({
//   client: "mysql",
//   connection: {
//     host: mysqlConfig.host,
//     user: mysqlConfig.user,
//     password: mysqlConfig.password,
//     database: mysqlConfig.database,
//   },
// });

app.use(upload());
app.use(cors()); // <---- use cors middleware
app.use(express.json());

app.all("/", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

var db_config = {
    host: mysqlConfig.host,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    multipleStatements: true, // can using 2 SELECT statement
};

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function (err) {
        // The server is either down
        if (err) {
            // or restarting (takes a while sometimes).
            console.log("error when connecting to db:", err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        } else {
            console.log("MYSQLXXX Connected...");
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on("error", function (err) {
        console.log("db error", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else {
            // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}

handleDisconnect();

//////////////////////////////////////////////////////////////////////////  LOGIN START

app.get("/", function (req, res) {
    res.send("Vinh'LAM :HELLO!!");
});

const GV_auth_google = '/auth/login/googleServer'; // googleLocal  <=> googleServer
// giữ lại dòng trên, dùng lại khi cần, chỉ cần copy : const GV_auth_google = '/auth/login/googleServer'; // googleLocal  <=> googleServer


///////////////////////////////// Gmail : qml.babymommycare@ptd.edu.vn  folder  START
const folderID_will_store_in = `1kPQYMKsYACh4kW69071cARQnSzu3onEh`; // Folder named: 'QMLOffice1.01'
///////////////////////////////// Gmail : qml.babymommycare@ptd.edu.vn  folder  END

let linkToHost = '';
let port111 = '';

if (GV_auth_google == '/auth/login/googleLocal') {

    KEYS.googleOauth.ENV = '--LOCAL--';
    KEYS.googleOauth.clientID = '184561540998-tcgijslh4f2m2g600r7b2sjjq3v791u3.apps.googleusercontent.com';
    KEYS.googleOauth.clientSecret = 'qnhah2wMoFu1vZWIEAKrDblS';

    linkToHost = `http://localhost:5501`;
    port111 = process.env.PORT | 3000;

    app.listen(process.env.port || port111, () =>
        console.log(`APP listening on port ${port111}!`)
    );
} else {

    KEYS.googleOauth.ENV = '--SERVER--';
    KEYS.googleOauth.clientID = '184561540998-n91tm9uab3u3v1ls0b3gqhqadlo16nkb.apps.googleusercontent.com';
    KEYS.googleOauth.clientSecret = 'gN57dl0g5H9uD8PLHL65dSHv';

    //linkToHost = `https://qmloffice.github.io/qmloffice`;
    linkToHost = `http://qmloffice.site`;
    port111 = process.env.PORT | 3000;
    app.listen(port111, "0.0.0.0", () => {
        console.log(`APP listening on port  ${process.env.PORT}!`);
    });
}

console.log("RUN.ENV = " + GV_auth_google + ":PORT:" + port111);

app.use(session({
    secret: "secret2212121",
    saveUninitialized: true,
    resave: true
}))

// set cookie base on this user
passport.serializeUser((user, done) => {
    console.log(`passport.serializeUser111`);

    //
    let sessionUser = {
        _id: user.googleID,
        refreshToken: user.refreshToken,
        accessToken: user.accesstoken,
        name: user.name,
        pic_url: user.pic_url,
        email: user.email,
    };
    // console.log(sessionUser);
    done(null, sessionUser);
});

// get cookie & get relevent session data
passport.deserializeUser((sessionUser, done) => {
    console.log(`passport.deserializeUser`);
    done(null, sessionUser); // now can access request.user
});



passport.use(
    // google login
    new GoogleStrategy(
        // google keys
        {
            clientID: KEYS.googleOauth.clientID,
            clientSecret: KEYS.googleOauth.clientSecret,
            callbackURL: KEYS.googleOauth.callback,
            passReqToCallback: true,
        },
        (request, accessToken, refreshToken, profile, done) => {
            console.log(`passport.use(new GoogleStrategy()`);
            //console.log(refreshToken);
            //save data in session
            user = {
                refreshToken: refreshToken,
                accesstoken: accessToken,
                googleID: profile.id,
                name: profile.displayName,
                pic_url: profile._json.picture,
                email: profile._json.email,
            };

            //console.log(profile)

            done(null, user);
        }
    )
);

// init passport

app.use(passport.initialize());
app.use(passport.session())

app.get(
    GV_auth_google,
    passport.authenticate("google", {
        scope: ["profile", "https://www.googleapis.com/auth/drive", "email"],

    })
);

const querystring = require("querystring");
let cur_login_google_acc = undefined;

// Authorized redirect URIs on google "http://localhost:3000/auth/google/redirect"
app.get("/auth/google/redirect", passport.authenticate("google"), async function (
    req,
    res
) {
    // console.log(req.user);
    // {
    //     refreshToken: undefined,
    //     accesstoken: 'ya29.a0AfH6SMDuoda66ik2CvX8yXZVkb44dDTuShDpuzPkRC07whG0oE0imzvURpzoru5416QCv4PoP5waoxCXzVXuNFVRmAXVMGK2t1cOf_YdrZLO-3SjJBDuNUdeL--8N6nfngYCp4KSNWeryc08vW9Uf-2lsv_53S8KIb4',
    //     googleID: '113486759599812914431',
    //     name: 'Vinh Lam',
    //     pic_url: 'https://lh5.googleusercontent.com/-nTxSsnx2qqs/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclQYhNHIYWpskXpA_ajPTOEatYLWA/photo.jpg',      
    //     email: 'lqvinh.hsu@gmail.com',
    //     authority_code: 'NONE',
    //     id: '113486759599812914431',
    //     menu_id: '202008272001100947'
    //   }

    let dataSearch = {
        id: req.user.googleID,
    };

    var sqlCheckBeforeInsert = `
           SELECT *, M.id as menu_id, U.id as id_user
           FROM USER U
           LEFT JOIN MENU M ON U.id = M.creator_id
           WHERE U.id = '${req.user.googleID}'
    `;
    //sqlCheckBeforeInsert = `SELECT id from USER where id = '202007181517230520'`;

    // console.log(sqlCheckBeforeInsert);
    await connection.query(sqlCheckBeforeInsert, [2, 1], function (
        error,
        results,
        fields
    ) {
        if (error) {
            console.log(`ERR : /auth/google/redirect`);
            res.redirect(linkToHost + '/signIn.html');
            return;
        } else {
            var count1 = 0;
            console.log(`results for : /auth/google/redirect`);

            if (results.length > 0) {
                count1 = Object.keys(results[0]).length;
            }
            // if found USER OK just return info of this USER
            if (count1 > 0) {
                //const query = JSON.stringify(req.user);
                //cur_login_google_acc = req.user;

                req.user.authority_code = results[0].authority_code;
                req.user.id = results[0].id_user;
                req.user.menu_id = results[0].menu_id;
                req.user.name = results[0].displayName;
                req.user.delete_system = results[0].delete_system;

                // console.log("/google/redirect11");
                // console.log(req.user);

                const query22 = querystring.stringify(req.user);
                res.redirect(linkToHost + `/?` + query22);
            } else {
                // insert nếu ko có User trong he thong START

                var d = GetSysDate();
                var t = GetSysTime();

                var dataUser = {
                    id: req.user.googleID,
                    user_type_id: "GOOGLE",
                    authority_code: "0", // 1 :ADMIN (full control) , 0 : Staff
                    id_user: "",
                    firstname: "",
                    lastname: "",
                    displayName: req.user.name,
                    address: "",
                    phone1: "",
                    phone2: "",
                    email: req.user.email,
                    password: "",
                    updatedate: d,
                    updatetime: t,
                    create_datetime: d + t,
                    refreshToken: req.user.refreshToken,
                    delete_system: '0'
                };

                let sql = "INSERT INTO USER SET ?";

                let query = connection.query(sql, dataUser, (err, result) => {
                    if (err) {
                        var errno =
                            "/auth/google/redirect-->INSERT INTO USER ERR:" +
                            req.user.googleID;
                        res.send({
                            errno: errno,
                        });
                    } else {


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

                        let dataMenu = {
                            id: GenUserID(),
                            creator_id: req.user.googleID,
                            tasktree: dataNodeTaskRoot,
                            updatedate: d,
                            updatetime: t,
                            create_datetime: d + t,
                        };

                        let sqlMENU = "INSERT INTO MENU SET ?";
                        let queryMENU = connection.query(
                            sqlMENU,
                            dataMenu,
                            (err, result) => {
                                if (err) {
                                    var errno = "bug mysql INSERT INTO MENU";
                                    res.send({
                                        errno: errno,
                                    });
                                } else {
                                    console.log("INSERT INTO MENU OK !!");
                                    req.user.authority_code = "NONE";
                                    req.user.id = req.user.googleID;
                                    req.user.menu_id = dataMenu.id;
                                    req.user.name = req.user.name;
                                    const objResponse = querystring.stringify(req.user);
                                    res.redirect(linkToHost + '/?' + objResponse);
                                }
                            }
                        );
                    }
                });
                // insert nếu ko có USer trong he thong END
            }
        }
    });
});


//////////////////////////////////////////////////////////////////////////  LOGIN END

function GenUserID() {
    var dtNow = new Date();
    var dd = dtNow.getDate().toString().padStart(2, "0");
    var MM = dtNow.getMonth().toString().padStart(2, "0");
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

function GenPhoneInfo() {
    var num = Math.floor(1000000 + Math.random() * 9000000).toString();
    var index = Math.floor(1000000 + Math.random() * 9000000)
        .toString()
        .substring(0, 1);
    var pre = phonePrefix.Viettel_Prefix[index];
    num = pre + num;
    var nameAgency = phone.GetNameAgency(pre);
    return {
        nameAgency: nameAgency,
        number: num,
    };
}



app.get("/insert", function (req, res) {
    // console.log(random_name()); // -> "Brittny Kraska"
    // console.log(random_name({ first: true, gender: "male" })); // -> "Jean"
    // console.log(random_name({ last: true })); // -> "Kinsel"
    // console.log(random_name({ seed: 'Based on this' })); // -> "Garrett Scheets"
    // console.log(random_name({ random: Math.random, female: true })); // -> "Jo"
    var name = random_name({
        first: true,
        gender: "male",
    });
    var genp = GenPhoneInfo();
    let test_data = {
        id: GenUserID(),
        name: name,
        phone: genp.number,
        phone_agency: genp.nameAgency,
        email: name + "@gmail.com",
    };

    let sql = "INSERT INTO test SET ?";
    let query = connection.query(sql, test_data, (err, result) => {
        if (err) {
            throw err;
        }
        //console.log(result);
        res.send("INSERT OK !!");
    });
});

app.post("/insertuser", function (req, res) {
    let test_data = {
        id: req.body.id,
        authority_code: req.body.au_id,
        id_user: req.body.id_user,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        phone1: req.body.phone1,
        phone2: req.body.phone2,
        email: req.body.email,
        password: req.body.password,
        updatedate: req.body.updatedate,
        updatetime: req.body.updatetime,
        create_datetime: req.body.create_datetime,
    };

    var objectRegistedErr = "";
    var sqlCheckBeforeInsert = `SELECT 'id_user' as type from USER where id_user = '${test_data.id_user}'; 
                              SELECT 'phone1' as type from USER where phone1 = '${test_data.phone1}';
                              SELECT 'email' as type from USER where email = '${test_data.email}'`;
    connection.query(sqlCheckBeforeInsert, [0, 1, 2], function (
        error,
        results,
        fields
    ) {


        var count1 = Object.keys(results[0]).length;
        var count2 = Object.keys(results[1]).length;
        var count3 = Object.keys(results[2]).length;

        if (count1 > 0) {
            //  objectRegistedErr = results[0][0].type.toString();
            objectRegistedErr = "USER NAME";
        } else if (count2 > 0) {
            objectRegistedErr = "PHONE";
        } else if (count3 > 0) {
            objectRegistedErr = "EMAIL";
        }

        var errno;
        if (objectRegistedErr != "") {
            errno = objectRegistedErr + " da duoc dang ki";
            res.send({
                errno: errno,
            });
        } else {
            let sql = "INSERT INTO USER SET ?";
            let query = connection.query(sql, test_data, (err, result) => {
                if (err) {
                    errno = "bug mysql INSERT INTO USER";
                    res.send({
                        errno: errno,
                    });
                } else {
                    let dataMenu = {
                        id: GenUserID(),
                        creator_id: test_data.id,
                        tasktree: req.body.dataNodeTaskRoot,
                        updatedate: test_data.updatedate,
                        updatetime: test_data.updatetime,
                        create_datetime: test_data.create_datetime,
                    };

                    let sqlMENU = "INSERT INTO MENU SET ?";
                    let queryMENU = connection.query(sqlMENU, dataMenu, (err, result) => {
                        if (err) {
                            errno = "bug mysql INSERT INTO MENU";
                            res.send({
                                errno: errno,
                            });
                        } else {
                            res.send(result);
                        }
                    });
                }
            });
        }
    });
});

app.post("/insertauthority", function (req, res) {
    let test_data = {
        id: GenUserID(),
        code: req.body.code.trim(),
        name: req.body.name.trim(),
        icon_path: req.body.iconpath.trim(),
        updatedate: GetSysDate(),
        updatetime: GetSysTime(),
    };

    var objectRegistedErr = "";
    var sqlCheckBeforeInsert = `SELECT 'name' as type from AUTHORITY where name = '${test_data.name}'; 
                              SELECT 'code' as type from AUTHORITY where code = '${test_data.code}'`;

    connection.query(sqlCheckBeforeInsert, [2, 1], function (
        error,
        results,
        fields
    ) {
        if (error) {
            console.log("throw /insertauthority");
        }

        var count1 = Object.keys(results[0]).length;
        var count2 = Object.keys(results[1]).length;

        if (count1 > 0) {
            //  objectRegistedErr = results[0][0].type.toString();
            objectRegistedErr = "NAME";
        } else if (count2 > 0) {
            objectRegistedErr = "ICON";
        }

        if (objectRegistedErr != "") {
            var errno = objectRegistedErr + " da duoc dang ki";
            res.send({
                errno: errno,
            });
        } else {
            let sql = "INSERT INTO AUTHORITY SET ?";
            let query = connection.query(sql, test_data, (err, result) => {
                if (err) {
                    console.log("INSERT INTO AUTHORITY err:");

                    res.send(err);
                } else {
                    console.log("INSERT INTO AUTHORITY result:");
                    res.send(result);
                }
            });
        }
    });
});

app.get("/authoritygetall", function (req, res) {
    let sql = "SELECT * FROM AUTHORITY";
    let query = connection.query("SELECT * FROM AUTHORITY", function (
        error,
        results,
        fields
    ) {
        if (error) {
            throw error;
        }
        res.send(results);
    });
});

app.post("/updatemenuafteraction", function (req, res) {
    let data = {
        id: req.body.id,
        tasktree: req.body.tasktree,
        updatedate: req.body.updatedate,
        updatetime: req.body.updatetime,
    };

    let sql = `
  UPDATE MENU SET tasktree = '${data.tasktree}' ,
  updatedate = ${data.updatedate} ,
  updatetime=${data.updatetime} 
  WHERE id='${data.id}'`;

    let query = connection.query(sql, function (error, results, fields) {
        let errno = "sv:/updatemenuafteraction ERR";
        if (error) {
            res.send({
                errno: errno,
            });
        } else {
            res.send({
                data: results,
            });
        }
    });
}); // end updatemenuafteraction


app.post("/signin", function (req, res) {
    let _data = {
        id: req.body.userid.trim(),
        pass: req.body.password.trim(),
    };

    var sqlCheckSignIn = ` 
  SELECT  *, m.id as menu_id, m.creator_id as creator_id, USER.id AS userid , USER.id AS user_id
  FROM  USER LEFT JOIN MENU m ON USER.id = m.creator_id
  WHERE  
     (id_user = '${_data.id}' AND password = '${_data.pass}') OR 
     (phone1 = '${_data.id}'  AND password = '${_data.pass}' ) OR
     (phone2 = '${_data.id}'  AND password = '${_data.pass}' ) OR
     ( email = '${_data.id}' AND password = '${_data.pass}' )
     `;

    // console.log(sqlCheckSignIn);

    var errText = "SIGN_IN_ERR";

    connection.query(sqlCheckSignIn, function (error, results, fields) {
        if (error) {
            res.send({
                errno: errText,
            });
        } else {
            if (results.length == 0) {
                res.send({
                    errno: errText,
                });
            } else {
                res.send({
                    data: results[0],
                });
            }
        }
    });
});

app.get("/getMenuByCreatorID", function (req, res) {
    var errno = "ERR GET FROM MENU ";
    let sql =
        "SELECT * FROM MENU WHERE creator_id='" + req.query.creator_id + "'";

    //console.log(sql);
    let query = connection.query(sql, function (error, results, fields) {
        if (error) {
            res.send({
                errno: errno,
            });
        } else {
            //console.log(results);
            res.send(results);
        }
    });
});

// using axios
app.get("/getalluser", function (req, res) {

    //let sql = "SELECT * FROM USER WHERE delete_system is null OR delete_system = '0'";
    let sql = "SELECT * FROM USER WHERE delete_system is null OR delete_system <> '1'";
    let query = connection.query(sql, function (error, results, fields) {
        if (error) {
            res.send({
                errno: error,
            });
        } else {
            res.send(results);
        }
    });
});

// using axios
app.get("/getalluserFullInfo", function (req, res) {

    //let sql = "SELECT * FROM USER WHERE delete_system is null OR delete_system = '0'";
    let sql = "SELECT * FROM USER";
    let query = connection.query(sql, function (error, results, fields) {
        if (error) {
            res.send({
                errno: error,
            });
        } else {
            res.send(results);
        }
    });
});

// using axios
app.post("/deleteUserOutSystem", async function (req, res) {

    var user = req.body.data;
    let sql = `
    UPDATE USER SET updatedate = ${user.updatedate} ,
                    updatetime = ${user.updatetime},
                    delete_system = ${user.val_xoa}
    WHERE id='${user.id}'`;

    let query = await connection.query(sql, function (error, results, fields) {
        if (error) {
            let errno = "sv:/deleteUserOutSystem ERR:::" + user.id;
            res.send({
                errno: errno,
            });
        } else {
            res.send({
                data: results,
            });
        }
    });
});

// using axios
app.post("/updateAuthorityUser", async function (req, res) {

    var user = req.body.data;

    let sql = `
    UPDATE USER SET updatedate = ${user.updatedate} ,
                    updatetime = ${user.updatetime},
                    authority_code = ${user.authority_code}
    WHERE id='${user.id}'`;


    let query = await connection.query(sql, function (error, results, fields) {
        if (error) {
            let errno = "sv:/updateAuthorityUser ERR:::" + user.id;
            res.send({
                errno: errno,
            });
        } else {
            res.send({
                data: results,
            });
        }
    });
});



app.get("/get_1_user_info_by_email", function (req, res) {

    let dataXXX = JSON.parse(req.query.data);
    let id = dataXXX.id;


    let sql = `SELECT * FROM USER WHERE id = '${id}'`;
    let query = connection.query(sql, function (error, results, fields) {
        if (error) {
            error1 = 'get_1_user_info_by_email ERR'

            res.send({
                errno: error1,
            });
        } else {
            res.send(results);
        }
    });
});





// using axios.get
app.get("/get_all_user_by_task_Grp_Detail_ID", function (req, res) {
    let data = JSON.parse(req.query.data);

    // ${data.id}
    // -- OUT_DETAIL trong câu sql bên dưới : user ben ngoai co the duoc them vao TASK_DETAIL
    // -- IN_DETAIL trong câu sql bên dưới: user ben TRONG KHONG the DUOC them vao TASK_DETAIL
    let sql = `
    SELECT *, 'OUT_DETAIL' AS TYPE from  USER AS u where (u.delete_system is null OR u.delete_system <> '1') AND u.id NOT IN
          (SELECT TGD_USER.user_id FROM TASK_GROUP_DETAIL_USER TGD_USER WHERE TGD_USER.task_grp_detail_id = '${data.id}')
    UNION
    SELECT *, 'IN_DETAIL' AS TYPE from  USER AS u where (u.delete_system is null OR u.delete_system  <> '1') AND u.id IN
    (SELECT TGD_USER.user_id FROM TASK_GROUP_DETAIL_USER TGD_USER WHERE TGD_USER.task_grp_detail_id = '${data.id}')
    `;

    // console.log(sql)

    let query = connection.query(sql, function (error, results, fields) {
        if (error) {
            var errno = "vs /get_all_user_by_task_Grp_Detail_ID ERR ";
            res.send({
                errno: errno,
            });
        } else {
            res.send(results);
        }
    });
});

// using axios.get
app.get("/GetAllFileFromDB", function (req, res) {
    let data = JSON.parse(req.query.data);

    let sql = `
    SELECT id
    ,creator_id
    ,task_grp_detail_id
    ,file_name
    ,file_encoding
    ,file_md5
    ,file_mimetype
    ,file_size_byte
    ,updatedate
    ,updatetime
    ,create_datetime
     FROM TASK_GROUP_DETAIL_USER_CMT_FILE_UPLOAD

    `;

    let query = connection.query(sql, function (error, results, fields) {

        if (error) {
            var errno = "vs /GetAllFileFromDB ERR ";
            res.send({
                errno: errno,
            });
        } else {
            res.send(results);
        }
    });
});

app.post("/addtaskuser", async (req, res) => {
    var curTaskID = req.body.curTaskID;
    var creatorTask = req.body.creatorTask;
    let errno = [];
    var cnt = 0;
    var cntERR = 0;
    for (var userID of req.body.listUserIDSelected) {
        var d = GetSysDate().toString();
        var t = GetSysTime().toString();
        let data = {
            creator_task: creatorTask,
            task_id: curTaskID,
            user_in_task: userID,
            updatedate: d,
            updatetime: t,
            create_datetime: d + t,
        };

        let sql = "REPLACE INTO USER_TASK SET ?";
        let query = await connection.query(sql, data, (err, result) => {
            cnt++;

            if (err) {
                errno.push(err.sqlMessage);
            } else { }

            if (cnt == req.body.listUserIDSelected.length) {
                if (errno.length > 0) {
                    cntERR++;
                    res.send({
                        errno: errno,
                    });
                } else {
                    res.send("đã thêm " + (cnt - cntERR) + " item thành công");
                }
            }
        });
    }
});

// using axios.post
app.post("/addtaskgroup", function (req, res) {
    let data = req.body.data;
    let test_data = {
        id: data.id,
        creator_id: data.creator_id,
        folder_id: data.folder_id,
        title_id: data.title_id,
        group_name: data.group_name.trim(),
        updatedate: data.updatedate,
        updatetime: data.updatetime,
        create_datetime: data.create_datetime,
    };

    let sql = "INSERT INTO TASK_GROUP SET ?";
    let query = connection.query(sql, test_data, (err, result) => {
        if (err) {
            console.log("INSERT INTO TASK_GROUP ERR:");
            res.send({
                errno: errno,
            });
        } else {
            console.log("INSERT INTO TASK_GROUP SCC:");
            res.send(result);
        }
    });
});

// using axios.post
app.post("/addtaskgroupDetail", async function (req, res) {
    let data = req.body.data;
    let listUser = data.listUser;
    let task_grp_detail_id = data.id;
    let creator_id = data.creator_id;

    let test_data = {
        id: task_grp_detail_id,
        creator_id: creator_id,
        folder_id: data.folder_id,
        title_id: data.title_id,
        group_id: data.group_id,
        task_grp_dtl_name: data.task_grp_name,
        // description_general: data.description_general, ===> go to detail to update
        updatedate: data.updatedate,
        updatetime: data.updatetime,
        create_datetime: data.create_datetime,
    };

    let cntERR = 0;
    let cnt = 0;
    let errno = [];
    let sql = "";
    for (var userID of listUser) {
        let data = {
            id: userID.split("__")[1], // just id of record
            task_grp_detail_id: task_grp_detail_id,
            user_id: userID.split("__")[0], // this is id of user checked in checked box
            creator_id: creator_id,
            updatedate: test_data.updatedate,
            updatetime: test_data.updatetime,
            create_datetime: test_data.create_datetime,
        };

        sql = "INSERT INTO TASK_GROUP_DETAIL_USER SET ?";
        let query1 = await connection.query(sql, data, (err, result) => {
            cnt++;

            if (err) {
                errno.push("ERR:" + userID);
            }
            if (cnt == listUser.length) {
                sql = "INSERT INTO TASK_GROUP_DETAIL SET ?";
                let query2 = connection.query(sql, test_data, (err2, result) => {
                    console.log("XXXXXXXXXXXXXXXXXXXXXXX");

                    if (err2) {
                        errno.push("ERR : INSERT INTO TASK_GROUP_DETAIL");
                        res.send({
                            errno: errno,
                        });
                    } else {
                        if (errno.length > 0) {
                            res.send({
                                errno: errno,
                            });
                        } else {
                            res.send("đã thêm " + cnt + " item thành công");
                        }
                    }
                });
            }
        });
    }
});

// using axios.post
app.post("/UpdateDescriptionGeneralForTaskGrpDetail", async function (
    req,
    res
) {
    console.log("UpdateDescriptionGeneralForTaskGrpDetail");
    let data = req.body.data;
    let test_data = {
        id: data.id,
        description_general: data.description_general,
        updatedate: data.updatedate,
        updatetime: data.updatetime,
    };

    let sql = `UPDATE TASK_GROUP_DETAIL SET description_general='${data.description_general}', 
                     updatedate=${data.updatedate}, 
                     updatetime=${data.updatetime} 
                WHERE id='${data.id}'`;

    let query = await connection.query(sql, function (error, results, fields) {
        let errno = "sv:/UpdateDescriptionGeneralForTaskGrpDetail ERR";
        if (error) {
            res.send({
                errno: errno,
            });
        } else {
            res.send({
                data: results,
            });
        }
    });
});

// using axios.get
app.get("/getTaskGrpAndTaskDetailWhenClickOnTitle", async function (req, res) {
    let data = JSON.parse(req.query.data);
    let sql = `  SELECT * FROM TASK_GROUP t WHERE folder_id = '${data.folder_id}' AND title_id='${data.title_id}'
                 ORDER BY CONVERT(t.create_datetime, UNSIGNED INTEGER) DESC;

                 SELECT * , TGD.id AS 'TASK_GROUP_DETAIL_ID', TGD.create_datetime AS 'TASK_GRP_DTL_CREATE_TIME'
                 FROM TASK_GROUP TG 
                       JOIN TASK_GROUP_DETAIL TGD ON TG.folder_id =  TGD.folder_id AND TG.id =  TGD.group_id
                 WHERE TG.folder_id = '${data.folder_id}' AND TG.title_id='${data.title_id}'
                 ORDER BY CONVERT(TGD.create_datetime, UNSIGNED INTEGER);

                 SELECT  TGD.folder_id , TG.title_id, TG.id AS 'GROUP_ID', TGD.id AS 'TASK_GROUP_DETAIL_ID' , TG.group_name, TGD.task_grp_dtl_name, U.*
                 FROM TASK_GROUP TG 
                   JOIN TASK_GROUP_DETAIL TGD ON TG.folder_id =  TGD.folder_id AND TG.id =  TGD.group_id  
                   JOIN TASK_GROUP_DETAIL_USER TGU ON TGU.task_grp_detail_id = TGD.id
                                       LEFT JOIN USER U ON U.id = TGU.user_id
                 WHERE TG.folder_id = '${data.folder_id}' AND  TG.title_id='${data.title_id}' AND (U.delete_system is null OR U.delete_system <> '1')
                 ORDER BY TGD.group_id , TGD.id
    `;


    let query = await connection.query(sql, [2, 1], function (error, results, fields) {
        if (error) {
            var errno = "vs /getTaskGrpAndTaskDetailWhenClickOnTitle ERR ";
            console.log(errno);
            res.send({
                errno: errno,
            });
        } else {
            console.log("/getTaskGrpAndTaskDetailWhenClickOnTitle SCC");
            res.send(results);
        }
    });
});

// using axios.get
app.get("/Get_description_general_Intask_grp_detail", async function (req, res) {
    let data = JSON.parse(req.query.data);
    let sql = ` SELECT * FROM TASK_GROUP_DETAIL WHERE id = '${data.id}'`;
    // console.log(sql);
    let query = await connection.query(sql, [2, 1], function (error, results, fields) {
        if (error) {
            var errno = "Server: /Get_description_general_Intask_grp_detail ERR ";
            console.log(errno);
            res.send({
                errno: errno,
            });
        } else {
            console.log("Server: /Get_description_general_Intask_grp_detail SCC");
            res.send(results);
        }
    });
});

app.post("/upload", async function (req, res) {
    if (req.files == undefined || req.files == null) {
        res.send({
            errno: "ERR NO FILE..",
        });
    }


    //console.log('length', req.files.userfile.data.toString());

    let fileBuffer = Buffer.from(req.files.userfile.data);

    let fileName = req.files.userfile.name;
    let fullPath = __dirname + "/uploadFileVink/" + fileName;
    var d = GetSysDate();
    var t = GetSysTime();

    let data = {
        id: GenUserID(),
        creator_id: req.body.loginId,
        file_buffer: req.files.userfile.data,
        file_name: req.files.userfile.name,
        file_encoding: req.files.userfile.encoding,
        file_md5: req.files.userfile.md5,
        file_mimetype: req.files.userfile.mimetype,
        file_size_byte: req.files.userfile.size,
        updatedate: d,
        updatetime: t,
        create_datetime: d + t,
    };

    let sql = "INSERT INTO TASK_GROUP_DETAIL_USER_FILE_UPLOAD SET ?";
    let query = await connection.query(sql, data, (err, result) => {
        if (err) {
            res.send({
                errno: "Save file " + fileName + " ERR !!",
            });
        } else {
            res.send("Save file " + fileName + " SCC !!");
        }

        // req.files.userfile.mv(fullPath, function (err) {1
        //   if (err) {
        //     res.send({
        //       errno: err,
        //     });
        //   } else {
        //     res.send("Save file " + fileName + " SCC !!");
        //   }
        // });
    });
});

app.get("/getFileBy_CreatorID_TaskDtlID_FileID/:fileID/:fileName", async function (
    req,
    res
) {
    //let data = JSON.parse(req.query.data);

    var fileID = req.params.fileID;
    var fileName = req.params.fileName;
    let sql = `SELECT * FROM TASK_GROUP_DETAIL_USER_FILE_UPLOAD where id ='${fileID}';`;

    let query = await connection.query(sql, [2, 1], function (error, results, fields) {
        if (error) {
            res.send({
                errno: "getFileBy_CreatorID_TaskDtlID_FileID " + "ERR !!",
            });
        } else {
            //console.log(results[0].file_buffer.toString()); // ==> ��{�ʊ*>�e�0���W+����N��╗s���}��.[�B?�������U�8M?`║r�J╝s�wjm�f��RRg�U��D�eI���(�����g\�P╔᏾P&��V�ϡ��}e��
            //console.log(results[0].file_buffer); // SEND FILE OK by buffer : <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff e2 02 28 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 02 18 00 00 00 00 02 10 00 00 ...
            // 488922 more bytes>

            // const buf4 = Buffer.from(results[0].file_buffer);
            res.end(results[0].file_buffer);
        }
    });
});

// using axios.post
app.post("/insertTitle", async function (req, res) {
    console.log("insertTitle");

    let data = req.body.data;


    let test_data = {
        id: data.id,
        folder_id: data.folder_id,
        creator_id: data.creator_id,
        title_text: data.title_text,
        updatedate: data.updatedate,
        updatetime: data.updatetime,
        create_datetime: data.create_datetime,
    };

    let sql = "INSERT INTO FOLDER_TITLE SET ?";
    let query = await connection.query(sql, test_data, (err, result) => {
        if (err) {
            console.log("INSERT INTO TASK_GROUP ERR:");
            errno = "INSERT INTO TASK_GROUP ERR:";
            res.send({
                errno: errno,
            });
        } else {
            console.log("INSERT INTO TASK_GROUP SCC:");
            res.send(result);
        }
    });
});

// using axios.get
app.get("/GetTitleByFolderID", async function (req, res) {
    let data = JSON.parse(req.query.data);

    let sql = `SELECT * FROM FOLDER_TITLE WHERE folder_id='${data.folder_id}'`;

    let query = await connection.query(sql, function (error, results, fields) {
        console.log(error);
        if (error) {
            var errno = "GetTitleByFolderID ERR ";
            res.send({
                errno: errno,
            });
        } else {
            res.send(results);
        }
    });
});

// using axios.post
app.post("/InsertUserWhenClickBtnAddUserToTaskDetail", async function (
    req,
    res
) {
    let listUserInfo = req.body.data.listUserInfo;

    // console.log(listUserInfo);
    let errno = [];
    let cnt = 0;

    for (var user of listUserInfo) {
        let data = {
            id: user.id, // just id of record
            task_grp_detail_id: user.task_grp_detail_id,
            user_id: user.user_id,
            creator_id: user.creator_id,
            updatedate: user.updatedate,
            updatetime: user.updatetime,
            create_datetime: user.create_datetime,
        };

        sql = "INSERT INTO TASK_GROUP_DETAIL_USER SET ?";
        let query1 = await connection.query(sql, data, (err, result) => {
            cnt++;

            if (err) {
                errno.push("ERR:" + user.user_id);
            }
            if (cnt == listUserInfo.length) {
                if (errno.length > 0) {
                    res.send({
                        errno: errno,
                    });
                } else {
                    res.send(result);
                }
            }
        });
    }
});

// using axios.post
app.post("/DeleteUserInGrpTaskDetail", async function (req, res) {
    var data = req.body.data;
    let sql = `DELETE FROM TASK_GROUP_DETAIL_USER WHERE user_id='${data.userID}' AND task_grp_detail_id='${data.task_grp_detail_id}';`;
    let query = await connection.query(sql, data, (err, result) => {
        if (err) {
            res.send({
                errno: "ERR :" + sql,
            });
        } else {
            res.send("DELETE SUCCESS");
        }
    });
});

// using axios.post
app.post("/InsertCmtMst", async function (req, res) {
    let data = req.body.data.data;
    sql = "INSERT INTO TASK_GROUP_DETAIL_USER_COMMENT SET ?";
    let query1 = await connection.query(sql, data, (err, result) => {
        if (err) {
            var errno = "/InsertCmtMst ERR";
            res.send({
                errno: errno,
            });
        } else {
            res.send(result);
        }
    });
});

// using ajax.post
app.post("/uploadFile", function (req, res) {

    if (req.files == undefined || req.files == null) {
        res.send({
            errno: "ERR NO FILE..",
        });
    }

    var creator_id = req.body.creator_id;
    var accesstoken = req.body.accesstoken;
    var flag_multiFlag = req.body.flag_multiFlag;
    var updatedate = req.body.updatedate;
    var updatetime = req.body.updatetime;
    var create_datetime = req.body.create_datetime;
    var task_grp_detail_id = req.body.task_grp_detail_id;
    var idCmt = req.body.idCmt;

    var cnt = 0;
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accesstoken,
    });

    const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
    });

    let arr_file = [];
    let arr_file_info = [];

    if (flag_multiFlag == "false") {
        arr_file.push(req.files.userfile);
    } else if (flag_multiFlag == "true") {
        for (var file of req.files.userfile) {
            arr_file.push(file);
        }
    }
    console.log(`arr_filearr_filearr_filearr_filearr_filearr_filearr_filearr_filearr_filearr_filearr_file START`)
    console.log(arr_file)
    console.log(`arr_filearr_filearr_filearr_filearr_filearr_filearr_filearr_filearr_filearr_filearr_file END`)




    for (var file of arr_file) {
        var file_name = file.name;
        var file_buffer = file.data;
        var file_size = file.size;
        var file_encoding = file.encoding;
        var file_mimetype = file.mimetype;
        var file_md5 = file.md5;

        var fileInfoObject = {};
        fileInfoObject.name = file_name;
        fileInfoObject.size = file_size;
        fileInfoObject.encoding = file_encoding;
        fileInfoObject.md5 = file_md5;

        arr_file_info.push(fileInfoObject);

        let bufferStream = new stream.PassThrough();
        bufferStream.end(file_buffer);

        const driveResponse1 = drive.files.create({
            requestBody: {
                name: file_name,
                mimeType: file_mimetype,
                parents: [folderID_will_store_in],
            },
            media: {
                mimeType: file_mimetype,
                body: bufferStream,
            },
        });

        driveResponse1
            .then((data) => {
                if (data.status == 200) {
                    cnt++;
                    console.log(`data.status upFile: 200: [${data.data.name}]`);

                    for (var fileInfo of arr_file_info) {
                        if (fileInfo.name == data.data.name) {
                            fileInfo.linkdown = `https://drive.google.com/uc?id=${data.data.id}&export=download`;
                            fileInfo.id = data.data.id;
                            fileInfo.mimeType = data.data.mimeType;
                        }
                    }
                    // HandLoadFileInfo(drive, data.data.id, res, arr_file_info);

                    if (cnt == arr_file.length) {
                        // insert file in to DB START
                        cnt = 0;
                        var arr_file_info_res = [];
                        for (var fileInfo of arr_file_info) {
                            let dataFile = {
                                id: fileInfo.id,
                                store_id: "GOOGLE_DRIVE",
                                creator_id: creator_id,
                                task_grp_detail_id: task_grp_detail_id,
                                cmt_id: idCmt,
                                //file_buffer: ,
                                file_name: fileInfo.name,
                                file_encoding: fileInfo.encoding,
                                file_md5: fileInfo.md5,
                                file_mimetype: fileInfo.mimeType,
                                file_size_byte: fileInfo.size,
                                file_link_download: fileInfo.linkdown,
                                updatedate: updatedate,
                                updatetime: updatetime,
                                create_datetime: create_datetime,
                            };

                            arr_file_info_res.push(dataFile);

                            let sql =
                                "INSERT INTO TASK_GROUP_DETAIL_USER_CMT_FILE_UPLOAD SET ?";
                            let query = connection.query(sql, dataFile, (err, result) => {
                                if (err) {
                                    res.send({
                                        errno: "Save file " + dataFile.file_name + " ERR !!",
                                    });
                                } else {
                                    cnt = cnt + 1;
                                    if (cnt == arr_file_info.length) {
                                        res.send(arr_file_info_res);
                                    }
                                }
                            });
                        }

                        // insert file in to DB END
                    }
                } else {
                    var errno = "else/uploadFile ERR [data.status]";
                    console.log(errno);
                    let sql_delCmt = `DELETE FROM TASK_GROUP_DETAIL_USER_COMMENT WHERE id='${idCmt}';`;
                    let query1 = connection.query(sql_delCmt, undefined, (err, result) => {
                        if (err) {
                            var cnnt = 1;
                        } else {
                            var cnnt = 1;
                        }
                    });

                    let sql_delNotifyCmt = `DELETE FROM TASK_GROUP_DETAIL_USER_CMT_NOTIFY WHERE cmt_id='${idCmt}';`;
                    let query22 = connection.query(sql_delNotifyCmt, undefined, (err, result) => {
                        if (err) {
                            res.send({
                                errno: errno,
                            });
                        } else {
                            res.send({
                                errno: errno,
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                var errno = "/uploadFile ERR -catch";
                console.log("/uploadFile ERR catch11111");
                console.log(errno);

                let sql_delCmt = `DELETE FROM TASK_GROUP_DETAIL_USER_COMMENT WHERE id='${idCmt}';`;
                let query1 = connection.query(sql_delCmt, undefined, (err, result) => {
                    if (err) {
                        var cnnt = 1;
                    } else {
                        var cnnt = 1;
                    }
                });

                let sql_delNotifyCmt = `DELETE FROM TASK_GROUP_DETAIL_USER_CMT_NOTIFY WHERE cmt_id='${idCmt}';`;
                let query22 = connection.query(sql_delNotifyCmt, undefined, (err, result) => {
                    if (err) {
                        res.send({
                            errno: errno,
                        });
                    } else {
                        res.send({
                            errno: errno,
                        });
                    }
                });


            });



    }
});

// using axios.post
app.post("/uploadFile2", function (req, res) {

    console.log(`""req START""`);


    var accesstoken = req.body.accesstoken;
    var flag_multiFlag = req.body.flag_multiFlag;

    console.log(`""req END""`);

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accesstoken,
    });

    const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
    });

    var cnt = req.body.cnt;
    var file = req.files.userfile;

    // console.log(file);
    var file_name = file.name;
    var file_size = file.size;
    var file_encoding = file.encoding;
    var file_md5 = file.md5;
    var file_mimetype = file.mimetype;
    var file_buffer = file.data;
    let bufferStream = new stream.PassThrough();
    bufferStream.end(file_buffer);
    // console.log(bufferStream);

    const driveResponse1 = drive.files.create({
        requestBody: {
            name: file_name,
            mimeType: file_mimetype,
            parents: [folderID_will_store_in],
        },
        media: {
            mimeType: file_mimetype,
            body: bufferStream,
        },
    });
    var mes = '';
    driveResponse1
        .then((data) => {
            if (data.status == 200) {

                mes = `data.status upFile OK 200: [${file_name}][${file_size}_BYTE]`;
                console.log(mes);


                res.send({
                    cnt,
                    mes: mes,
                    file_id: data.data.id,
                    file_mimetype: data.data.mimeType,
                    file_name: file_name,
                    file_size_byte: file_size,
                    file_encoding: file_encoding,
                    file_md5: file_md5
                });
            } else {
                mes = `data.status upFile err ${data.status}: [${file_name}][${file_size}_BYTE]`;
                console.log(mes);

                res.send({
                    errno: mes,
                });

            }
        })
        .catch((err) => {

            mes = `upFile catch: [${file_name}][${file_size}_BYTE]`;
            console.log(mes);
            // console.log(err)
            res.send({
                errno: mes,
            });
        });
});


app.post("/insertFileToDB", function (req, res) {

    var sqlFile = `INSERT INTO TASK_GROUP_DETAIL_USER_CMT_FILE_UPLOAD(
        id
        ,store_id
        ,creator_id
        ,task_grp_detail_id
        ,cmt_id
        ,file_name
        ,file_encoding
        ,file_md5
        ,file_mimetype
        ,file_size_byte
        ,file_link_download
        ,updatedate
        ,updatetime
        ,create_datetime)
    VALUES
    `;
    var list_val = '';
    var cnt = 0;


    var cmtID = req.body.dataFile.data[0].cmt_id;
    for (var file of req.body.dataFile.data) {
        cnt++;

        // var linkDown = `https://drive.google.com/uc?id=${file.id}&export=download`;
        var DauPhay = cnt == req.body.dataFile.data.length ? "" : ",";

        list_val += `
                ('${file.id}', '${file.store_id}', '${file.creator_id}', '${file.task_grp_detail_id}' , '${file.cmt_id}', '${file.file_name}', '${file.file_encoding}', '${file.file_md5}', '${file.file_mimetype}', ${file.file_size_byte}, '${file.file_link_download}', '${file.updatedate}', '${file.updatetime}', '${file.create_datetime}') ${DauPhay}
                `;
    }

    sqlFile = sqlFile + list_val;

    //console.log(sqlFile)

    let query = connection.query(sqlFile, 1, (err, result) => {
        if (err) {
            errno = "/INSERT INTO TASK_GROUP_DETAIL_USER_CMT_FILE_UPLOAD ERR";
            res.send({
                errno: errno,
            });
        } else {
            console.log(`/INSERT INTO TASK_GROUP_DETAIL_USER_CMT_FILE_UPLOAD SCC`)
            res.send(result);
        }
    });

});


// using axios.get
app.get("/errweb/:errcode", async function (req, res) {

    let errcode = req.params.errcode;
    let dataXXX = JSON.parse(req.query.data);

    //const query22 = querystring.stringify({ errcode: errcode });
    // res.redirect(linkToHost + '/page404/?' + query22);
    res.send(errcode);
});



// using axios.get
app.get("/GetAllEmailAndFileAndCommentByTaskID", async function (req, res) {
    let data = JSON.parse(req.query.data);
    let sql = ` 
                SELECT T.id AS cmt_id, T.creator_id, T.task_grp_detail_id, T.cmt_type, 
                       T.cmt_mst_id, T.cmt_mst_header, T.cmt_contain, T.create_datetime
                FROM TASK_GROUP_DETAIL_USER_COMMENT T
                     LEFT JOIN USER U ON U.id =  T.creator_id
                WHERE T.task_grp_detail_id ='${data.task_grp_detail_id}' 
                       AND T.cmt_type='MST_EMAIL'
                       AND (U.delete_system is null OR U.delete_system <> '1')
                ORDER BY CONVERT(T.create_datetime, UNSIGNED INTEGER);

                SELECT T.id, T.store_id, T.creator_id, T.task_grp_detail_id, T.cmt_id, 
                       T.file_name, T.file_size_byte, T.file_mimetype, T.file_link_download, T.create_datetime
                FROM TASK_GROUP_DETAIL_USER_CMT_FILE_UPLOAD T
                      LEFT JOIN USER U ON U.id =  T.creator_id
                WHERE T.task_grp_detail_id ='${data.task_grp_detail_id}' 
                      AND (U.delete_system is null OR U.delete_system <> '1')
                ORDER BY T.cmt_id;

                SELECT T.id AS cmt_id, T.creator_id, U.displayName creator_name, T.task_grp_detail_id, T.cmt_type, 
                       T.cmt_mst_id, T.cmt_mst_header, T.cmt_contain, T.create_datetime
                FROM TASK_GROUP_DETAIL_USER_COMMENT T
                LEFT JOIN USER U ON U.id =  T.creator_id
                WHERE T.task_grp_detail_id ='${data.task_grp_detail_id}' 
                     AND T.cmt_type='DTL_EMAIL' 
                     AND (U.delete_system is null OR U.delete_system <> '1')
                ORDER BY CONVERT(T.create_datetime, UNSIGNED INTEGER);

                SELECT CMT.task_grp_detail_id,  CMT.id cmt_id, CMT.cmt_type , CMT.cmt_mst_id, NOTIFY.id notify_id ,
                      NOTIFY.creator_id, NOTIFY.notify_to_user_id
                FROM TASK_GROUP_DETAIL_USER_CMT_NOTIFY NOTIFY
                       LEFT JOIN TASK_GROUP_DETAIL_USER_COMMENT CMT ON NOTIFY.cmt_id = CMT.id
                       LEFT JOIN USER U ON U.id =  NOTIFY.notify_to_user_id
                 WHERE CMT.task_grp_detail_id IN (${data.task_grp_detail_id}) 
                      AND NOTIFY.notify_to_user_id = '${data.user_login_id}'
                      AND (U.delete_system is null OR U.delete_system <> '1')
                ORDER BY CMT.task_grp_detail_id,CMT.id, NOTIFY.id;                
    `;
    console.log(`GetAllEmailAndFileAndCommentByTaskID`)
    // console.log(sql)

    let query = await connection.query(sql, [2, 1], function (error, results, fields) {
        if (error) {
            var errno = "vs /GetAllEmailAndFileByTaskID ERR ";
            console.log(errno);
            res.send({
                errno: errno,
            });
        } else {
            console.log("/GetAllEmailAndFileByTaskID SCC");
            res.send(results);
        }
    });
});

// using axios.post
app.post("/InsertCmtDetailForEmailMaster_InsertNotifytoCmtDtl", async function (req, res) {
    let data = req.body.data;
    sql = "INSERT INTO TASK_GROUP_DETAIL_USER_COMMENT SET ?";
    let query1 = await connection.query(sql, data, (err, result) => {
        if (err) {
            errno = "/InsertCmtDetailForEmailMaster_InsertNotifytoCmtDtl ERR";
            res.send({
                errno: errno,
            });
        } else {
            console.log("/InsertCmtDetailForEmailMaster_InsertNotifytoCmtDtl SCC");

            var sqlNotify = `INSERT INTO TASK_GROUP_DETAIL_USER_CMT_NOTIFY(id, creator_id, notify_to_user_id, cmt_id, create_datetime)
                              VALUES
                              `;
            var list_val = '';
            var cnt = 0;
            for (var user of req.body.listUserIDNotifyTo) {
                cnt++;
                if (cnt == req.body.listUserIDNotifyTo.length) {
                    list_val += `
                        ('${user.id}', '${user.creator_id}','${user.notify_to_user_id}', '${user.cmt_id}' , '${user.create_datetime}')
                            `;
                } else {
                    list_val += `
                        ('${user.id}', '${user.creator_id}','${user.notify_to_user_id}', '${user.cmt_id}' , '${user.create_datetime}'),
                            `;
                }

            }
            sqlNotify = sqlNotify + list_val;
            let query2 = connection.query(sqlNotify, data, (err, result) => {
                if (err) {
                    errno = "/INSERT INTO TASK_GROUP_DETAIL_USER_CMT_NOTIFY ERR";
                    res.send({
                        errno: errno,
                    });
                } else {
                    console.log(`/INSERT INTO TASK_GROUP_DETAIL_USER_CMT_NOTIFY SCC`)
                    res.send(result);
                }
            });
        }
    });
});

// using axios.post
app.post("/updateListUserInDetail", async function (req, res) {

    var cntUpd = 0;
    for (var user of req.body.data.data) {
        let sql = `
            UPDATE USER SET phone1 = '${user.phone1}' ,
                            phone2 = '${user.phone2}' ,
                            
                            address = '${user.address}' ,
                            displayName= '${user.fullName}' ,
                            updatedate = ${user.updatedate} ,
                            updatetime= ${user.updatetime} 
            WHERE id='${user.userID}'`;

        if (
            user.create_datetime != "" &&
            user.create_datetime != null &&
            user.create_datetime != undefined
        ) {
            sql = `
            UPDATE USER SET phone1 = '${user.phone1}' ,
                            phone2 = '${user.phone2}' ,
                            create_datetime = '${user.create_datetime}',
                            address = '${user.address}' ,
                            displayName= '${user.fullName}' ,
                            updatedate = ${user.updatedate} ,
                            updatetime= ${user.updatetime} 
            WHERE id='${user.userID}'`;
        }

        let query = await connection.query(sql, function (error, results, fields) {
            if (error) {
                let errno = "sv:/updateListUserInDetail ERR:::" + user.userID;
                res.send({
                    errno: errno,
                });
            } else {
                cntUpd++;
                if (cntUpd == req.body.data.data.length) {
                    res.send({
                        data: results,
                    });
                }
            }
        });
    }
}); // end updateListUserInDetail


// using axios.post
app.post("/updateListUserJoinDate", async function (req, res) {
    console.log(`updateListUserJoinDate`)
    // console.log(req.body.data.data);


    var cntUpd = 0;
    for (var user of req.body.data.data) {
        let sql = `
            UPDATE USER SET create_datetime= '${user.create_datetime}' ,
                            updatedate = ${user.updatedate} ,
                            updatetime= ${user.updatetime}
            WHERE id='${user.id}'`;

        let query = await connection.query(sql, function (error, results, fields) {
            if (error) {
                let errno = "sv:/updateListUserJoinDate ERR:::" + user.id;
                res.send({
                    errno: errno,
                });
            } else {
                cntUpd++;
                if (cntUpd == req.body.data.data.length) {
                    res.send({
                        data: results,
                    });
                }
            }
        });
    }
}); // end updateListUserInDetail


// using axios.get
app.get("/GetAllTaskOfOneUser", async function (req, res) {
    let data = JSON.parse(req.query.data);

    let sql = `
    SELECT TU.user_id, U.displayName, U.email, TDTL.folder_id,
    F.id title_id, F.title_text ,TG.id grp_id, TG.group_name, 
    TU.task_grp_detail_id , TDTL.task_grp_dtl_name , TU.create_datetime, MENU.id menu_id
    , U2.displayName creator_name
    
    FROM TASK_GROUP_DETAIL_USER TU
      LEFT JOIN TASK_GROUP_DETAIL TDTL ON TDTL.id = TU.task_grp_detail_id
      LEFT JOIN TASK_GROUP TG ON TG.id = TDTL.group_id
      LEFT JOIN FOLDER_TITLE F ON F.id = TG.title_id
      LEFT JOIN USER U ON U.id = TU.user_id
      LEFT JOIN MENU ON MENU.id = U.id
        LEFT JOIN USER U2 ON U2.id = TU.creator_id
      

    WHERE TU.user_id = '${data.id}'
    ORDER BY TU.create_datetime DESC

  `;

    // console.log(sql);

    let query = await connection.query(sql, function (error, results, fields) {
        //console.log(error);
        if (error) {
            var errno = "GetAllTaskOfOneUser ERR ";
            res.send({
                errno: errno,
            });
        } else {
            res.send(results);
        }
    });
});
// end GetAllTaskOfOneUser

// using axios.get
app.get("/get_Notify_By_TaskDtlID_And_userLogin", async function (req, res) {
    let data = JSON.parse(req.query.data);

    let sql = `
        SELECT CMT.task_grp_detail_id,  CMT.id cmt_id, CMT.cmt_type , CMT.cmt_mst_id, NOTIFY.id notify_id ,NOTIFY.creator_id, NOTIFY.notify_to_user_id
            FROM TASK_GROUP_DETAIL_USER_CMT_NOTIFY NOTIFY
            LEFT JOIN TASK_GROUP_DETAIL_USER_COMMENT CMT ON NOTIFY.cmt_id = CMT.id
        WHERE CMT.task_grp_detail_id IN (${data.list_task_grp_dtl_id}) AND NOTIFY.notify_to_user_id = '${data.user_login_id}'
            ORDER BY CMT.task_grp_detail_id,CMT.id, NOTIFY.id
    `;


    let query = await connection.query(sql, function (error, results, fields) {

        if (error) {
            var errno = "get_Notify_By_TaskDtlID_And_userLogin ERR ";
            res.send({
                errno: errno,
            });
        } else {
            res.send(results);
        }
    });
});
// end GetAllTaskOfOneUser


// using axios.post
app.post("/DeleteNotifyByID", async function (req, res) {
    var data = req.body.data;
    let sql = `DELETE FROM TASK_GROUP_DETAIL_USER_CMT_NOTIFY WHERE id='${data.id}';`;
    let query = await connection.query(sql, data, (err, result) => {
        if (err) {
            res.send({
                errno: "DeleteNotifyByID ERR :" + sql
            });
        } else {
            res.send("DeleteNotifyByID SUCCESS");
        }
    });
});

async function HandLoadFileInfo(drive, fileID, res, arr_result) {
    console.log(`HandLoadFileInfo()`);
    const params = {
        pageSize: 1000,
        includeRemoved: false,
        fileId: fileID,
        fields: `nextPageToken, files(contentHints/thumbnail,fileExtension,iconLink,id,name,size,thumbnailLink,webContentLink,webViewLink,mimeType,parents)`,
        showDeleted: false,
        q: `trashed=false`,
    };
    // params.q = query;
    const res33 = await drive.files.list(params);
    console.log(`res33.data.files.length : ` + res33.data.files.length);
    if (res33.data.files.length > 0) {
        let listFile = res33.data.files;

        // {
        //     id: '1MHI8pDOnl7laJwC3Jo9d1Eo7apRbo3dE',
        //     name: 'bang hieu vẽ phấn.PNG',
        //     mimeType: 'image/png',
        //     parents: [ '13--DIQCKDxWgHLYPeJxYnDJBpM3_9enb' ],
        //     webContentLink: 'https://drive.google.com/uc?id=1MHI8pDOnl7laJwC3Jo9d1Eo7apRbo3dE&export=download',
        //     webViewLink: 'https://drive.google.com/file/d/1MHI8pDOnl7laJwC3Jo9d1Eo7apRbo3dE/view?usp=drivesdk',
        //     iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/image/png',
        //     thumbnailLink: 'https://lh3.googleusercontent.com/P9xuNBjU8SspLHRhOs9SgrKmQhAcFiKrHeDC3hClBrPfqsOgAOfCPTlAzt88AZCjqXqXOE2NFEU=s220',
        //     fileExtension: 'PNG',
        //     size: '238129'
        //   },

        let xx = 0;
        let fileResult = undefined;
        listFile.forEach(function (file) {
            xx = xx + 1;
            if (file.id === fileID) {
                fileResult = file;
                arr_result.push(file);
            }
        });

        if (fileResult != undefined) {
            console.log("HandLoadFileInfo()");
            //console.log(fileResult);
        } else {
            console.log(`Can not get find from ID : ${fileID}`);
        }
    }
}

app.post("/test_file_admin", async function (req, res_to) {

    var mes = '';
    var accesstoken = req.body.data.accesstoken;
    var fodlerName = req.body.data.fodlerName;
    var emailAddress = req.body.data.emailAddress;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accesstoken
    });

    const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
    });

    let sql = `
             select email , is_share_folder_gg 
                    from USER
                WHERE email is not null 
                AND email != ''
             AND (is_share_folder_gg is null OR is_share_folder_gg <> '1')
             order by create_datetime ASC
    `;
    //console.log(sql)
    let query = await connection.query(sql, `data`, (err, result) => {
        if (err) {
            res.send({
                errno: sql
            });
        } else {

            var permissions = [];
            for (var res of result) {
                var obj = {
                    'type': 'user',
                    'role': 'writer',
                    'emailAddress': res.email
                };
                permissions.push(obj);
            }
            console.log(permissions.length);

            var permissionsCheckList = [];

            GivePermissionToFolder(-1, drive, permissions, permissionsCheckList, res_to);



        }
    });

    return;

    const driveResponse2 = drive.files.create({
        requestBody: {
            name: fodlerName,
            mimeType: 'application/vnd.google-apps.folder'
        }
    });
    var mes = '';
    driveResponse2.then(data => {

        if (data.status == 200) {

            mes = `data.status create Foleder OK: 200 [${data.data.name}]`;

            var permission = {
                'type': 'user',
                'role': 'writer',
                'emailAddress': 'lqvinh.hsu@gmail.com'
            };

            drive.permissions.create({
                resource: permission,
                fileId: data.data.id,
                fields: 'id',
            }, function (err, res) {
                if (err) {
                    // Handle error...
                    mes = mes + '__permissions assign to folder [err1]';
                    console.log(mes);
                    res_to.send(mes);
                } else {
                    console.log('Permission ID: ', res)
                    mes = mes + '__permissions assign to folder OK2';
                    res_to.send(mes);
                }
            });

        } else {
            mes = `data.status create Foleder : err ${data.status}`;
            res_to.send({
                errno: mes
            });
        }

    }).catch(err => {
        mes = `data.status create Foleder : catch `;
        res_to.send({
            errno: mes
        });

    })
})

// init sum = -1
function GivePermissionToFolder(sum, drive, permissions, permissionsCheckList, res_to) {

    if (sum >= permissions.length) {

        if (permissionsCheckList.length > 0) {
            console.log(`FINISHED!! has ${permissionsCheckList.length} objects below :`);

            var arrEmailString = '';
            var cnt = 0;
            for (var per of permissionsCheckList) {
                cnt++;
                var dauPhay = cnt == permissionsCheckList.length ? "" : ",";
                arrEmailString = arrEmailString + `
                          '${per.emailAddress}'${dauPhay}`;
            }

            let sql = `
                    UPDATE USER SET is_share_folder_gg = '1'
                    WHERE email in (${arrEmailString})`;



            let query = connection.query(sql, function (error, results, fields) {

                if (error) {

                } else {
                    res_to.send('OK add finished');
                }
            });
        } else {
            console.log(`FINISHED!! has update 0 data`);
            res_to.send('OK 0 data');
        }

        return;
    }


    if (permissionsCheckList == undefined) {
        permissionsCheckList = [];
    }


    // Using the NPM module 'async'
    async.eachSeries(permissions, function (permission, permissionCallback) {

        sum++;
        console.log(`item index: ${sum}`);
        permission = permissions[sum];


        drive.permissions.create({
            resource: permission,
            fileId: folderID_will_store_in,
            fields: 'id',
        }, function (err, res) {
            if (err) {

                console.log('ERR create permission -- ' + err);
                permissionCallback(`err`);

            } else {
                console.log('[Permission ID OK : ' + permission.emailAddress);
                permissionsCheckList.push(permission);
                permissionCallback(null);
            }

        });


    }, function (err_async) {
        if (err_async) {
            // Handle error
            console.error(`err NOT COMPLETE`);
            GivePermissionToFolder(sum, drive, permissions, permissionsCheckList, res_to);
        } else {
            // All permissions inserted
            console.error(`All permissions inserted`);
        }
    });

}

// for TEST when START SERVER !!!!
var sqlTest = "SELECT 1; SELECT 1";
var d = new Date();

console.log("-----------------------");
console.log(GetSysDate() + "__" + GetSysTime());

connection.query(sqlTest, [2, 1], function (error, results, fields) {

    if (error) {

        console.log("DB MySQL ERR at time : " + GetSysDate() + "__" + GetSysTime());
        handleDisconnect();
    } else {

        console.log("START CONNECT MYSQL TO SEVER [status OK]!!!!");
        console.log(results[0]);
        console.log(results[1]);
    }
});


var cntTime = 0;
WakeUpMySQL();
var setsetInterval11;

function WakeUpMySQL() {
    setsetInterval11 = setInterval(function () {
        connection.query(sqlTest, [2, 1], function (error, results, fields) {

            if (error) {
                clearInterval(setsetInterval11);
                console.log(`WAKE UP MYSQL [status FAILD]!!!! AT ${GetSysDate()} - ${GetSysTime()} `);
                console.log('WE WakeUpMySQL() again !!');
                handleDisconnect();

                WakeUpMySQL();
            } else {

                console.log(`WAKE UP MYSQL [status OK]!!!!AT ${GetSysDate()} - ${GetSysTime()} `);
                console.log(results[0]);
            }
        });

    }, 50000)
}