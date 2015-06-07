onmessage = function(e){
    console.log("message received from main script");
    var workerResult = 'Result: ' + e.data;
    postMessage(workerResult);
}