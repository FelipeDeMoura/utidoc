//var myinput = document.querySelector(".mymsg"),
//    myresult = document.querySelector(".myresult");
//
//var myWorker = new Worker("js/worker.js");
//
//myinput.onchange = function(){
//    myWorker.postMessage(myinput.value);
//    console.log("message posted to worker")
//}
//
//myWorker.onmessage = function(e) {
//    myresult.textContent = e.data;
//    console.log("message received from worker");
//}

var invokeWorker = new Worker("js/worker.js");
var initSocket = new WebSocket("ws://felipedemoura.github.io/utidoc/uploader.html");

//create user
var Ultidoc = Ultidoc || {};

Ultidoc.App = (function(){
    var bigfileUpload = document.querySelector("#big_file_uploader"),
        topfileUpload = document.querySelector("#top_file_uploader"),
        add_in_wrapper = document.querySelector(".wrapper"),
        list_items = document.querySelector(".list_item_wrap"),
        share_btn = document.querySelector(".list_item_wrap .share_btn"),
        iconFile = document.querySelector(".list_item_wrap .iconFile"),
        delete_btn = document.querySelector(".list_item_wrap .delete_btn"), 
        mainFunc,
        buildHtmlfunc,
        sendMsgToWorker = "";
    
    mainFunc = function(){
        
        //user constructor
        function CreateSessionUser(username,file) {
            var that = this;
            //exit if user dosent exist
            if(username == ""){
                console.log("nothing!");
                 return;
            }
            
            this.username = username,
            this.file = file,
            this.addlocalStorage = (function(public){
                public.userFullName = that.username;
                var uniqueKey = Math.floor((Math.random() * 1000) + 1),
                userKey = (uniqueKey + "-" + userFullName.trim()),
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
                    intercept_name;
                    
                    
                
                for (var key in UserStorageData) {
                    date_d_str = UserStorageData[key]['date'];
                    date_dm_str = UserStorageData[key]['lastDateMod'];
                    name_icon_str = UserStorageData[key]['fileDesc'];
                    //intercept here
                    //UserStorageData.userKey.fileDesc
                }
                
                buildHtmlfunc(user_str,date_d_str,date_dm_str,name_icon_str);
                
                //populate json string into localStorage
                public.localStorage.setItem(userKey, JSON.stringify(UserStorageData.userKey));
            }(window));
            
        };
        
        //build html
        buildHtmlfunc = function(username, date, datemodified, filename){
            var htmlStr,
            gp_html_str;
            
            htmlStr = ["<div class='list_item_wrap'>",
                "<div class='list_space'>",
                "<ul class='list_divider'>",
                "<li class='leftd'>",
                "<span class='iconFile' data-file-type='" + filename + "'></span>",
                "<div class='date_desc'>",
                "<p class='date_d'>" + date + "</p>",
                "<p class='date_md'>" + datemodified + "</p>",
                "</div>",
                "</li>",
                "<li class='rightd'>",
                "<h2 class='user_m'>" + username + "</h2>",
                "<button class='share_btn'>share</button>",
                "<span class='delete_btn'>x</span>",
                "</li>",
                "</ul>",
                "</div>",
                "</div>"];

                gp_html_str = htmlStr.join("");
                add_in_wrapper.innerHTML = gp_html_str;
                
                sendMsgToWorker += gp_html_str;
            
                //send msg to worker
                invokeWorker.postMessage(sendMsgToWorker);
                console.log("send msg to worker");
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
                    user_str;
                 
                for (int; int < numKeys; int++) {
                    //get key name
                    keyNames[int]=localStorage.key(int);                    
                    //use key name to retreive
                    values[int]=JSON.parse(localStorage.getItem(keyNames[int]));
                    //console.log(values[int]['date']);
                    
                    date_d_str = values[int]['date'];
                    date_dm_str = values[int]['lastDateMod'];
                    name_icon_str = values[int]['fileDesc'];
                    user_str = values[int]['user'];
                    
                    buildHtmlfunc(user_str,date_d_str,date_dm_str,name_icon_str);
                    
                }
            }
            
            return reconstructData;
        };
        
        //clouser function int var - keep state of the browser
        //var retrieveFullData = retrivedData();
        //retrieveFullData();

        bigfileUpload.onchange = function(){
            var createNewUser = new CreateSessionUser("felipe",this.files[0]);
        };
        
        //msg received from worker
        invokeWorker.onmessage = function(e) {
            //add_in_wrapper.innerHTML = e.data;
            console.log("msg received from worker");
            var receiveWk = e.data
            initSocket.onopen = function (event) {
                  initSocket.send(receiveWk); 
                  add_in_wrapper.innerHTML
            };
        }
        
        
    };//end
    
    
    
    return {
        initApp: mainFunc
    }; 
}());

window.onload = function(){
    Ultidoc.App.initApp();
}
