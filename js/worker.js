//msg received from main
onmessage = function(e){
    var workerResult = e.data;
    postMessage(workerResult);
    console.log("received from main");
}