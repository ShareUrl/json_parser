document.documentElement.setAttribute('extension-installed', false);

document.addEventListener("invokeVkEvent", function(data) {
    chrome.runtime.sendMessage("Start");
});