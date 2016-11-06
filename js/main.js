//var invokeWorker = new Worker("js/worker.js");
var getUservaleu;
//create user
var Ultidoc = Ultidoc || {};

Ultidoc.App = (function(){
  // test
    var bigfileUpload = document.querySelector("#big_file_uploader"),
        topfileUpload = document.querySelector("#top_file_uploader"),
        add_in_wrapper = document.querySelector(".wrapper"),
        list_items = document.querySelector(".list_item_wrap"),
        share_btn = document.querySelector(".list_item_wrap .share_btn"),
        iconFile = document.querySelector(".list_item_wrap .iconFile"),
        delete_btn = document.querySelectorAll(".list_item_wrap .delete_btn"),
        mainFunc,
        buildHtmlfunc,
        sendMsgToWorker = "";

    mainFunc = function(){

        //user constructor
        function CreateSessionUser(username,file) {
            var that = this;
            this.username = username,
            this.file = file,
            this.addlocalStorage = (function(public){
                public.userFullName = that.username;
                var uniqueKey = Math.floor((Math.random() * 1000) + 1),
                userKey = (uniqueKey + "-" + userFullName.replace(/ /g,'')),
                UserStorageData = {userKey:
                    {user: userFullName,
                    fileDesc: that.file.name,
                    //date: that.file.lastModified,
                    date: new Date(),
                    lastDateMod: that.file.lastModifiedDate,
                    shared: userKey}
                };

                //populate json string into localStorage
                public.localStorage.setItem(userKey, JSON.stringify(UserStorageData.userKey));

                var user_str = public.userFullName;

                buildHtmlfunc(user_str, timeConverter(UserStorageData['userKey']['date']).currentDate, timeConverter(UserStorageData['userKey']['lastDateMod']).currentDate, UserStorageData['userKey']['fileDesc'], userKey);

                //populate json string into localStorage
                //public.localStorage.setItem(userKey, JSON.stringify(UserStorageData.userKey));
            }(window));

        };

        function scanForDuplicate(currentFile){
            var keyNames = [],
                values = [],
                duplicateFile = false;

                for (var i =0; i < localStorage.length; i++) {
                    //get key name
                    keyNames[i]=localStorage.key(i);
                    //use key name to retreive
                    values[i]=JSON.parse(localStorage.getItem(keyNames[i]));
                    values[i]["fileDesc"];

                    if(currentFile === values[i]["fileDesc"]){
                        alert("Duplicate file: " + currentFile);
                        //localStorage.removeItem(keyNames[i]);
                        duplicateFile = true;
                    }
                }

            return {
                duplicate: duplicateFile
            }
        }

        //time converter
        var timeConverter = function(curdate){

            var returnDate,
            curd = new Date(curdate);


            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            };

            var monthNam = [
                "Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct",
                "Nov", "Dec"
            ];

            returnDate = [
                {
                    "day": curd.getDate(),
                    "month": monthNam[curd.getMonth()],
                    "year": curd.getFullYear(),
                    "hour": addZero(curd.getHours()),
                    "minutes": addZero(curd.getMinutes())
                }
            ];

            return {
                currentDate : returnDate[0]
            };
        };

        //build html
        buildHtmlfunc = function(username, date, datemodi, filename, delKey){
            var htmlStr = [],
            gp_html_str;

            //I know better I wanted to use createElement object or a underscore template
            htmlStr = ["<div class='list_item_wrap'>",
                "<div class='list_space'>",
                "<ul class='list_divider'>",
                "<li class='leftd'>",
                "<span class='iconFile icon-" + filename.substr(filename.lastIndexOf('.') + 1) +"' data-type='" + filename + "'></span>",
                "<div class='date_desc'>",
                "<p class='date_d' style=''>" + date.month + " " + date.day + ", " + date.year + " at " + date.hour + ":" + date.minutes + "</p>",
                "<p class='date_md' style='font-size:11px;'>" + "<small style='display:block;'>Last Date Modified: </small>" + datemodi.month + " " + datemodi.day + ", " + datemodi.year + " at " + datemodi.hour + ":" + datemodi.minutes + "</p>",
                "</div>",
                "</li>",
                "<li class='rightd'>",
                "<h2 class='user_m'>" + username + "</h2>",
                "<small class='fileTxt'>" + filename.substr(0, filename.lastIndexOf('.')) + "</small>",
                "<div><button class='share_btn'>share</button></div>",
                "<span class='delete_btn' id='" + delKey + "'>x</span>",
                "</li>",
                "</ul>",
                "</div>",
                "</div>"];

                gp_html_str = htmlStr.join("");
                add_in_wrapper.innerHTML += gp_html_str;

                //sendMsgToWorker += gp_html_str;

                //send msg to worker
                //invokeWorker.postMessage(sendMsgToWorker);

        };

        //add event handler
        registerEventHandler(function(selector,sharebtn){
           delefiles(selector);
           shareFiles(sharebtn);
        });

        function shareFiles(shareselector){
            var clickshare;
            for(var i =0; i < shareselector.length; i++) {
                shareselector[i].onclick = function(event){
                    clickshare(this);
                };
            };

            clickshare = function(){
                alert("Backend not available");
            }
        };


        function delefiles(getdom){

         var deleteFile;

            for(var i =0; i < getdom.length; i++) {
                getdom[i].onclick = function(event){
                    deleteFile(this);
                };
            };

            deleteFile = function(that){

                dialogTrig(null);
                var noBtn = document.querySelector("#n"),
                    yesBtn = document.querySelector("#y");

                noBtn.onclick = function(){
                    dialogTrig('hidebx');
                };

                yesBtn.onclick = function(){
                    dialogTrig('hidebx');
                    var getParent = that.parentNode.parentNode;
                    var nextParent = getParent.parentNode;
                    nextParent.parentNode.style.display = "none";

                    localStorage.removeItem(that.getAttribute("id"));
                    add_in_wrapper.removeChild(nextParent.parentNode);
                };
            };
        };

        function dialogTrig(hide){

            hide = (hide == null) ? "" : hide;
            var hlightBox = document.querySelector(".hlight_box"),
                dialogMes = document.querySelector(".dialogMessage");

            hlightBox.setAttribute("class", "hlight_box " + hide);
            dialogMes.setAttribute("class", "dialogMessage " + hide);
        };


        function retrivedData(){

            var keyNames = [],
                values = [],
                int = 0;

             //stract data from localStorage into the DOM
             function reconstructData(){

                var numKeys = localStorage.length,
                    date_d_str,
                    date_dm_str,
                    name_icon_str,
                    user_str,
                    deleteKey;

                for (int; int < numKeys; int++) {
                    //get key name
                    keyNames[int]=localStorage.key(int);
                    //use key name to retreive
                    values[int]=JSON.parse(localStorage.getItem(keyNames[int]));

                    date_d_str = timeConverter(values[int]['date']).currentDate;
                    date_dm_str = timeConverter(values[int]['lastDateMod']).currentDate;
                    name_icon_str = values[int]['fileDesc'];
                    user_str = values[int]['user'],
                    deleteKey = keyNames[int];

                    buildHtmlfunc(user_str, date_d_str, date_dm_str, name_icon_str, deleteKey);
                }

                var userGlobal = (function(public){
                    public.loginUser = user_str;
                }(window));
            }

            return reconstructData;
        };

        //clouser function int var - keep state of the browser
        var retrieveFullData = retrivedData();
        retrieveFullData();
        //var xmlhttp = new XMLHttpRequest();
        bigfileUpload.onchange = function(){
            //scanForDuplicate(this.files[0].name).duplicate;
            console.log('upload images');
            //check for duplicate
            if(scanForDuplicate(this.files[0].name).duplicate){
                return;
            }

            var createNewUser = new CreateSessionUser(window.loginUser,this.files[0]);
            //add event handler
            registerEventHandler(function(selector,sharebtn){
                delefiles(selector);
                shareFiles(sharebtn);
            });

            //xmlhttp.open("POST",this.files[0],false);
            var formData = new FormData();
            //formData.append('photos[]', this.files, this.files.name);
            //xmlhttp.send();
        };

        function openLoginDialog(getUserName){
            var lh_bgk = document.querySelector(".hlight_box"),
                login_user = document.querySelector(".login_user"),
                clickGo = document.querySelector("#submitUser"),
                signIn = document.querySelector("#selectUsers");

                if(getUserName != undefined){
                  $('.login-form').hide();
                  return;
                }

                lh_bgk.setAttribute("class", "hlight_box");
                login_user.setAttribute("class", "login_user");

                clickGo.onclick = function(e) {
                    // lh_bgk.setAttribute("class", "hlight_box hidebx");
                    // login_user.setAttribute("class", "login_user hidebx");
                    getUserName = signIn.value;
                    window.loginUser = getUserName;
                    console.log(getUserName);
                }
        };

        //login user
        openLoginDialog(window.loginUser);

        //msg received from worker
        //invokeWorker.onmessage = function(e) {
            //add_in_wrapper.innerHTML = e.data;
            //console.log("msg received from worker");
        //}

    };//end

    function registerEventHandler(callback){

        function getEvent() {
            return {
                bindEventHan: true,
                deletebtn: document.querySelectorAll(".list_item_wrap .delete_btn"),
                share_btn: document.querySelectorAll(".list_item_wrap .share_btn")
            }
        };

        setTimeout(function(){
            callback(getEvent().deletebtn, getEvent().share_btn);
        }, 500);
    };


    return {
        initApp: mainFunc
    };
}());

window.onload = function(){
    Ultidoc.App.initApp();
}


// test only

function success(position) {
  locationObj.latitude  = position.coords.latitude;
  locationObj.longitude = position.coords.longitude;
};

function geoLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      var locationObj = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      return resolve(locationObj);
    }, reject);
  });
}

function dropDownUsers() {
    var elem = $('#selectUsers');
    var userName = elem.val();
    elem.on('change', () => {
      userName = $(this).val();
    });
    return userName;
}

var PayloadObj = {
  username: dropDownUsers(),
  location: geoLocation()
};

// var myobj = PayloadObj;

var ImagePicker = ImagePicker || {};

ImagePicker.autoFill = (() => {
  var selectWater = $("input[name='optionsRadios']"),
  selectFish = $(".selectFish"),
  multipleSpec = $(".multipleSpec"),
  uploadFiles = $("#uploadFiles"),
  alertSpec = $(".alertSpec");

  function mulitSelection() {
    multipleSpec.on('change', function() {
      uploadFiles.children('.single, .multiple').hide();
      if($(this).is(':checked')) {
        console.log('true for multiple');
        uploadFiles.children('.multiple').show();
        alertSpec.show();
      } else {
        console.log('true for single');
        uploadFiles.children('.single').show();
        alertSpec.hide();
      }
    });
  }

  function selectWaterInput (defaultSelect) {
    selectFish.find('.' + defaultSelect).show();
    var selector = defaultSelect;
    selectWater.on('change', function() {
      selectFish.find('.form-control').hide();
      selector = $(this).val();
      selectFish.find('.' + selector).show();
      PayloadObj.fishType = $('.' + selector).val();
    });

    $('#freshwater, #saltwater').on('change', function(even) {
      PayloadObj.fishType = $(this).val();
    });
  }

  function initOption () {
     selectWaterInput('option1');
     mulitSelection();
  }

  return {
    init: initOption
  }
})();

ImagePicker.autoFill.init();

// $('document').ready(function(){
//     $('#submitUser').on('click', function() {

//     });
// });

function uploadImg () {
    $(".multipleInput").on('change', function() {
      var size = $(this).get(0).files.length;
      if (size > 5) {
        console.log('error');
      }
      console.log($(this).get(0).files);
    });
}

uploadImg();

$('.water').css('width', $('body').width()*2);
$('.water').css('height', $('body').width()*2);

// switch
$('.btn').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});
