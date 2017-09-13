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
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Toggle the pinned status
        var current = tabs[0];
        //window.alert("current"+current.id);
        //chrome.tabs.remove(current.id);
        console.log("current"+current.id);
        chrome.tabs.update(current.id, {'url': "https://www.facebook.com"});
     });
  
    getDataFromCode("NTUBSO");
});

function getDataFromCode(refCode){
    $.ajax({
        url: 'http://127.0.0.1:5000/url/' + refCode,
        type: 'GET',
        async: false,
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
    var domainUrl = "";
    setJsons = JSON.parse(refData);
    for(var i=0;i<setJsons.length;i++){
        var singleCookie = setJsons[i];
        singleCookie.url = "http" + ((singleCookie.secure) ? "s" : "") + "://" + singleCookie.domain + singleCookie.path;
        if(domainUrl.length===0){
            domainUrl = singleCookie.url;
        }
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
      return domainUrl; 
};

function reloadTabForMe() {
    //working code
    // chrome.tabs.getCurrent(function(tab) {
    //     //window.alert("myTab"+tab);
    //     console.log(tab);
    // });
    // chrome.tabs.create({
    //     url: "https://www.facebook.com"
    // });
};