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



//create user
var Ultidoc = Ultidoc || {};
//var Ultidoc.Views = Ultidoc.Views || {};
//var Ultidoc.Models = Ultidoc.Models || {};

Ultidoc.App = (function(){
    var bigfileUpload = document.querySelector("#big_file_uploader"),
        topfileUpload = document.querySelector("#top_file_uploader"),
        add_in_wrapper = document.querySelector(".wrapper"),
        list_items = document.querySelector(".list_item_wrap"),
        date_d = document.querySelector(".list_item_wrap .date_d"),
        date_dm = document.querySelector(".list_item_wrap .date_md"),
        share_btn = document.querySelector(".list_item_wrap .share_btn"),
        iconFile = document.querySelector(".list_item_wrap .iconFile"),
        user_m = document.querySelector(".list_item_wrap .user_m"),
        delete_btn = document.querySelector(".list_item_wrap .delete_btn"), 
        mainFunc;
        //resultQuery = document.querySelector(".results"),
        //appendHtml = document.querySelector(".elem"),
        
    
    mainFunc = function(){
        
        //user constructor
        function CreateSessionUser(username,file) {
            var that = this;
    //        if(username != "" && file != ""){
    //        console.log("nothing!");
    //         return;
    //        }
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
                //public.fileName = (UserStorageData.userKey.fileDesc == UserStorageData.getItem(keyNames[int]));
//                var userfileDesc = UserStorageData.userKey.fileDesc;
//                if(userfileDesc.search(userfileDesc) != userfileDesc){
//                    console.log(userfileDesc + " yes is " + userfileDesc.search(userfileDesc));
//                } else {
//                    console.log(userfileDesc + " no is " + userfileDesc.search(userfileDesc));
//                }
                
//                var str = UserStorageData.userKey.fileDesc;
//                console.log(str);
//                appendHtml.textContent = str;
                
                var date_d_str,
                    date_dm_str,
                    user_str = public.userFullName,
                    name_icon_str,
                    intercept_name,
                    htmlStr,
                    gp_html_str;
                    
                    
                
                for (var key in UserStorageData) {
                    //intercept_name = UserStorageData[key]['fileDesc'];
//                    if(obj == UserStorageData.userKey.fileDesc){

//                    }
                    date_d_str = UserStorageData[key]['date'];
                    date_dm_str = UserStorageData[key]['lastDateMod'];
                    name_icon_str = UserStorageData[key]['fileDesc'];
                    
                    add_in_wrapper
//                    //intercept here
//                    console.log(obj);
                }
                
                //list_items = document.querySelector(".list_item_wrap"),

                htmlStr = ["<div class='list_item_wrap'>",
                "<div class='list_space'>",
                "<ul class='list_divider'>",
                "<li class='leftd'>",
                "<span class='iconFile' data-file-type='" + name_icon_str + "'></span>",
                "<div class='date_desc'>",
                "<p class='date_d'>" + date_d_str + "</p>",
                "<p class='date_md'>" + date_dm_str + "</p>",
                "</div>",
                "</li>",
                "<li class='rightd'>",
                "<h2 class='user_m'>" + user_str + "</h2>",
                "<button class='share_btn'>share</button>",
                "<span class='delete_btn'>x</span>",
                "</li>",
                "</ul>",
                "</div>",
                "</div>"];

                gp_html_str = htmlStr.join("");
                add_in_wrapper.innerHTML = gp_html_str;
                //add_in_wrapper.html
                
//                date_d.textContent = date_d_str;
//                date_dm.textContent = date_dm_str;
//                name_icon_str.textContent = date_d_str;
//                user_m.textContent = user_str;

                
                
                //retrivedDataDistr(stringing);
                
                //populate data into localStorage
                public.localStorage.setItem(userKey, JSON.stringify(UserStorageData.userKey));
            }(window));
            
        };
        

        function retrivedData(){
            
            var keyNames = [],
                values = [],
                int = 0;
            
             function reconstructData(){
                var numKeys = localStorage.length;
                for (int; int < numKeys; int++) {
                    //get key name
                    keyNames[int]=localStorage.key(int);                    
                    //use key name to retreive
                    values[int]=JSON.parse(localStorage.getItem(keyNames[int]));
                    console.log(values[int]);
                }
            }
            
            return reconstructData;
        };
        
        //clouser function int var
        var retrieveFullData = retrivedData();
        retrieveFullData();

        bigfileUpload.onchange = function(){
            var createNewUser = new CreateSessionUser("felipe",this.files[0]);
        };
        
    };//end
    
    
    
    return {
        initApp: mainFunc
    }; 
}());

window.onload = function(){
    Ultidoc.App.initApp();
}
