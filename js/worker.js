//msg received from main
onmessage = function(e){
    var workerResult = e.data;
    postMessage(workerResult);
    console.log("received from main");
//    setTimeout(function(){
//        document.querySelectorAll(".delete_btn")[4].onclick = function(){
//            alert("felipao");
//        }
//    }, 1000);
}