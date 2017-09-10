function escapeForPre(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

chrome.tabs.getSelected(null,function(tabs){alert(tabs.url)});

var port = chrome.extension.connect({
  name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
  alert(msg);
  console.log("message recieved" + msg);
});


function getDomain(e) {
  if (server = e.match(/:\/\/(.[^/:#?]+)/)[1], parts = server.split("."), isip = !isNaN(parseInt(server.replace(".", ""), 10)), parts.length <= 1 || isip) domain = server;
  else {
    var o = new Array;
    for (o[0] = parts[parts.length - 1], i = 1; i < parts.length; i++)
      if (o[i] = parts[parts.length - i - 1] + "." + o[i - 1], !domainlist.hasOwnProperty(o[i])) {
        domain = o[i];
        break
      }
      "undefined" == typeof domain && (domain = server)
  }
  return domain
}



var content = "",
  downloadable = "",
  popup = "",
  jsons = [];
  setJsons = [];

  function reloadTabForMe(){
  chrome.tabs.getSelected(null, function(tab) {
  var code = 'window.location.reload();';
  chrome.tabs.executeScript(tab.id, {code: code});
});
}

function sendDataToServer(jsonData){
  $.ajax({
    url: 'http://127.0.0.1:5000/createUrl',
    data: JSON.stringify(jsonData),
    type: 'POST',
    success: function(response) {
        console.log(response);
    },
    error: function(error) {
        console.log(error);
    }
});
}

function setCookieForMe(){
  var test = [{"name":"datr","value":"qFaiVgYD0kcRHz9UljWUofUW","domain":".facebook.com","path":"/","expirationDate":1556199688.778241},{"name":"sb","value":"cy0HV3mzAdp_BEEItMAAERk1","domain":".facebook.com","path":"/","expirationDate":"1563907172.322858"},{"name":"pl","value":"n","domain":".facebook.com","path":"/","expirationDate":"1508611172.322953"},{"name":"c_user","value":"100001196433163","domain":".facebook.com","path":"/","expirationDate":"1511860484.13724"},{"name":"xs","value":"167%3AmnSa8OPdSAAA0A%3A2%3A1500854972%3A18360%3A5425","domain":".facebook.com","path":"/","expirationDate":"1511860484.137334"},{"name":"fr","value":"0ra91saNhqWFkQy5H.AWVeUiG1mcxyIb5SrNzOjEUSgb8.BYVlmW.Tl.Fmk.0.0.BZps9c.AWVDgpP1","domain":".facebook.com","path":"/","expirationDate":"1511860484.137393"},{"name":"act","value":"1504084489601%2F4","domain":".facebook.com","path":"/","expirationDate":"0"},{"name":"presence","value":"EDvF3EtimeF1504085709EuserFA21B01196433163A2EstateFDt3F_5b_5dEutc3F1504084489831G504085709942CEchFDp_5f1B01196433163F19CC","domain":".facebook.com","path":"/","expirationDate":"0"}];
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
  sendDataToServer(setJsons);
  reloadTabForMe(); 
}

function parseCookieForMe(){
  var inputString = document.getElementById("jsonInput").value;
  try{
      setJsons = JSON.parse(inputString);
      console.log(setJsons);
  }catch(e){
    console.log(e);
    var errorText = document.getElementById("errorText");
    errorText.style.display="";
  }
}



chrome.tabs.getSelected(null, function(e) {

  //cookies.txt

  domain = getDomain(e.url);
  chrome.cookies.getAll({}, function(o) {

    for (var t in o) {
      cookie = o[t];

      if (-1 != cookie.domain.indexOf(domain)) {
        jsons.push({
          name : escapeForPre(cookie.name),
          value: escapeForPre(cookie.value),
          domain: escapeForPre(cookie.domain),
          path : escapeForPre(cookie.path),
          expirationDate : escapeForPre(cookie.expirationDate ? cookie.expirationDate : "0"),
          secure : cookie.secure

        });

      };
    }

    //json string
    content += JSON.stringify(jsons, null, 2);

    var downloadLinkContent = "data:application/octet-stream;base64," + btoa(content);
    var downloadLink = "<a href=" + downloadLinkContent + ' download="cookies.json">download as json file</a>';
    var setCookieLink = "<a  id='setCookie'  href='#' >set cookie</a>";
    var parseCookie = "<a  id='parseCookie'  href='#' >parse cookie</a>";
    //console.log("I am there");    
    //setCookieForMe();
    document.getElementById("readJson").value = content;
    var divText = document.getElementById("buttons");
    divText.innerHTML = '<pre>\n'+ downloadLink +'\n\n'+'\n\n'+setCookieLink+'\t' + parseCookie +'</pre>';
    //document.write('<pre>\n'+ downloadLink +'\n\n'+'\n\n'+setCookieLink+'</pre>');
    document.getElementById("setCookie").addEventListener("click", setCookieForMe);
    document.getElementById("parseCookie").addEventListener("click", parseCookieForMe);
    var errorText = document.getElementById("errorText");
    errorText.style.display="none";
  });
});