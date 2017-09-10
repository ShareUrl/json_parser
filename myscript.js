
//chrome.runtime.sendMessage("hello world!!");

document.addEventListener("invokeVkEvent", function(data) {
    chrome.runtime.sendMessage("test");
});