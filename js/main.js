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
    var fileUpload = document.querySelector("#file_uploader"),
        resultQuery = document.querySelector(".results"),
        appendHtml = document.querySelector(".elem"),
        mainFunc;
    
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
                
                for (var key in UserStorageData) {
                    var obj = UserStorageData[key]['fileDesc'];
//                    if(obj == UserStorageData.userKey.fileDesc){
//                        console.log("found math: " + obj);
//                    }
//                    //intercept here
//                    console.log(obj);
                }
                
                
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

        fileUpload.onchange = function(){
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
