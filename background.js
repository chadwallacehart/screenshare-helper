let targetTabs = [];
let controlTab;

function log(...messages){
    console.log(`👷 ️`,  ...messages);
}


chrome.runtime.onInstalled.addListener(async () => {


    // Do this to load a help page
    /*
    let url = chrome.runtime.getURL("onInstallPage.html");
    let inputTab = await chrome.tabs.create({url});
    console.log(`inputTab ${inputTab.id}`)
     */

    chrome.runtime.openOptionsPage();

});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // ToDo: Edge doesn't have a sender.tab object

        let tabId = sender.tab ? sender.tab.id : "undefined id";
        log(`message from tab ${tabId} on ${sender.tab ? sender.tab.url : "undefined url"}`, request);

        if(request.message === "options page" )
            controlTab = sender.tab.id;

            //console.log(`incoming message: ${request.message}`);

        else if(request.keyEventInfo){
            log(`incoming key event: `, request.keyEventInfo.keyCode);

            // now send this to active content pages
            targetTabs.forEach(tab => {
                chrome.tabs.sendMessage(tab, request, null, null); //response callback removed
            });
        }
        else if(request.message === "unload"){
            targetTabs = targetTabs.filter(tab=>tab.tabId !== tabId);
        }
        else {
            if(!request.captureHandle){
                log("no capture handle on tab")
            } else if(!targetTabs.find(tab=>tab.handle===request.captureHandle))
                targetTabs.push({tabId: sender.tab.id, handle: request.captureHandle});
        }

        if(sendResponse){
            sendResponse({wssh: "ACK"});
        }
        else {
            log("response not requested");
        }
    });


function inject(){
    let script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = function() {
        // console.debug("wssh 💉 inject script loaded");
        document.head.removeChild(this)
    };
    (document.head || document.documentElement).appendChild(script); //prepend
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // log(`tab ${tabId} updated to ${changeInfo.status}: ${tab.url}`);
    if (changeInfo.status === 'loading' && /^http/.test(tab.url)) { // complete

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: inject
        })
            .then(() => {
                log(`inject.js into tab ${tabId}`);
            })
            .catch(err => log(err));
    }
});

log("background.js loaded");

