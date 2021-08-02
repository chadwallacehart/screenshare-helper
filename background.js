let targetTabs = [];
let controlTab;

function log(message){
    if (typeof message === "string")
        console.log(`background worker| `,  message);
    else
        console.log(`background worker| `, ...message)
}


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // ToDo: Edge doesn't have a sender.tab object


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
        else {
            let tabId = sender.tab ? sender.tab.id : "undefined id";

            log(`message from tab ${tabId} on ${sender.tab ? sender.tab.url : "undefined url"}`, request);

            if(!targetTabs.includes(tabId))
                targetTabs.push(sender.tab.id);
        }



        if(sendResponse){
            sendResponse({wssh: "ACK"});
        }
        else {
            log("response not requested");
        }
    });

chrome.runtime.onInstalled.addListener(async () => {


    // Do this to load a help page
    /*
    let url = chrome.runtime.getURL("onInstallPage.html");
    let inputTab = await chrome.tabs.create({url});
    console.log(`inputTab ${inputTab.id}`)
     */

    chrome.runtime.openOptionsPage();

});

log("background.js loaded");

