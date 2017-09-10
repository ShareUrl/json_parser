var imported = document.createElement('script');
imported.src = 'jquery.js';
document.head.appendChild(imported);

var localPort;
chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
         console.log("message recieved" + msg);
         port.postMessage("Hi Popup.js");
    });
    //localPort=port;
})

chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
    //alert(response);
    $.ajax({
        url: 'http://127.0.0.1:5000/createUrl',
        data: '{"data":"dd"}',
        type: 'POST',
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
})