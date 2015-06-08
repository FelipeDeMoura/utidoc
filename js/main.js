var invokeWorker = new Worker("js/worker.js");
//var initSocket = new WebSocket("ws://felipedemoura.github.io/utidoc/uploader.html");
var getUservaleu;
//create user
var Ultidoc = Ultidoc || {};

Ultidoc.App = (function(){
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
                    date: that.file.lastModified,
                    lastDateMod: that.file.lastModifiedDate,
                    shared: userKey}
                };
                
                var date_d_str,
                    date_dm_str,
                    user_str = public.userFullName,
                    name_icon_str,
                    intercept_name,
                    deleteKey;
                    
                    
                
                for (var key in UserStorageData) {
                    date_d_str = UserStorageData[key]['date'];
                    date_dm_str = UserStorageData[key]['lastDateMod'];
                    name_icon_str = UserStorageData[key]['fileDesc'],
                    deleteKey = userKey;
                    //intercept here
                    //UserStorageData.userKey.fileDesc
                }
                buildHtmlfunc(user_str, date_d_str, date_dm_str, name_icon_str, deleteKey);
                
                //populate json string into localStorage
                public.localStorage.setItem(userKey, JSON.stringify(UserStorageData.userKey));
            }(window));
            
        };
        
        //build html
        buildHtmlfunc = function(username, date, datemodified, filename, delKey){
            var htmlStr,
            gp_html_str;
            
            htmlStr = ["<div class='list_item_wrap'>",
                "<div class='list_space'>",
                "<ul class='list_divider'>",
                "<li class='leftd'>",
                "<span class='iconFile' data-type='" + filename + "'></span>",
                "<div class='date_desc'>",
                "<p class='date_d'>" + date + "</p>",
                "<p class='date_md'>" + datemodified + "</p>",
                "</div>",
                "</li>",
                "<li class='rightd'>",
                "<h2 class='user_m'>" + username + "</h2>",
                "<button class='share_btn'>share</button>",
                "<span class='delete_btn' id='" + delKey + "'>x</span>",
                "</li>",
                "</ul>",
                "</div>",
                "</div>"];

                gp_html_str = htmlStr.join("");
                add_in_wrapper.innerHTML = gp_html_str;
                
                sendMsgToWorker += gp_html_str;
            
                //send msg to worker
                invokeWorker.postMessage(sendMsgToWorker);
                //console.log("send msg to worker");
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
                    
                    date_d_str = values[int]['date'];
                    date_dm_str = values[int]['lastDateMod'];
                    name_icon_str = values[int]['fileDesc'];
                    user_str = values[int]['user'],
                    deleteKey = keyNames[int];
                    
                    buildHtmlfunc(user_str, date_d_str, date_dm_str, name_icon_str, deleteKey);
                    //deleteRows(keyNames[int]);
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
        
        bigfileUpload.onchange = function(){
            var createNewUser = new CreateSessionUser(window.loginUser,this.files[0]);
        };
        
        function openLoginDialog(getUserName){
            var lh_bgk = document.querySelector(".hlight_box"),
                login_user = document.querySelector(".login_user"),
                clickGo = document.querySelector(".sign_in_submit"),
                signIn = document.querySelector("#signIn");
            
            if(getUserName != undefined){
                return;
            }
                lh_bgk.setAttribute("class", "hlight_box");
                login_user.setAttribute("class", "login_user");

                clickGo.onclick = function(e){
                    lh_bgk.setAttribute("class", "hlight_box hidebx");
                    login_user.setAttribute("class", "login_user hidebx");
                    getUserName = signIn.value;
                    window.loginUser = getUserName;
                }
        };
        
        //login user
        openLoginDialog(window.loginUser);
        
        //msg received from worker
        invokeWorker.onmessage = function(e) {
            add_in_wrapper.innerHTML = e.data;
            //console.log("msg received from worker");
            
            //var receiveWk = e.data
            //initSocket.onopen = function (event) {
                  //initSocket.send(receiveWk); 
            //};
        }
        
        //remove rows
//        delete_btn.onclick = function(){
//            localStorage.removeItem(this.id);
//            add_in_wrapper.removeChild(this);
//        }
        
        
    };//end
    
    
    
    return {
        initApp: mainFunc
    }; 
}());

window.onload = function(){
    Ultidoc.App.initApp();
}
