var imported = document.createElement('script');
imported.src = 'jquery.js';
document.head.appendChild(imported);

// var localPort;
// chrome.extension.onConnect.addListener(function(port) {
//     console.log("Connected .....");
//     port.onMessage.addListener(function(msg) {
//          console.log("message recieved" + msg);
//          port.postMessage("Hi Popup.js");
//     });
//     //localPort=port;
// })

chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
    //alert(response);
    // $.ajax({
    //     url: 'http://127.0.0.1:5000/createUrl',
    //     data: '{"data":"dd"}',
    //     type: 'POST',
    //     success: function(response) {
    //         console.log(response);
    //     },
    //     error: function(error) {
    //         console.log(error);
    //     }
    // });
    var gotData = getDataFromCode("BMGO5K");
    console.log("from background.js ====> " +gotData);
});

function getDataFromCode(refCode){
    $.ajax({
        url: 'http://127.0.0.1:5000/url/' + refCode,
        type: 'GET',
        success: function(response) {
            console.log(response);
            setDataToCurrentTab(response);
            return response;
        },
        error: function(error) {
            console.log(error);
            //return response;
        }
    });
};

function setDataToCurrentTab(refData){
    for(var i=0;i<setJsons.length;i++){
        var singleCookie = setJsons[i];
        singleCookie.url = "http" + ((singleCookie.secure) ? "s" : "") + "://" + singleCookie.domain + singleCookie.path;
        delete singleCookie["secure"];
        singleCookie["expirationDate"] = parseInt(singleCookie["expirationDate"]);
         delete singleCookie["expirationDate"];
        console.log(JSON.stringify(setJsons[i]));
        console.log(singleCookie);
        
        chrome.cookies.set(setJsons[i],function (cookie){
            console.log(JSON.stringify(cookie));
            console.log(chrome.extension.lastError);
            console.log(chrome.runtime.lastError);
        });
      }
      reloadTabForMe(); 
};

function reloadTabForMe() {
    chrome.tabs.getSelected(null, function (tab) {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, { code: code });
    });
};