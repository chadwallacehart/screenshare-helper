function debug(...messages){
    console.log(`wssh content| `,  ...messages);
}

debug(`content.js loaded on ${window.location.href}`);


function sendToBackground(message) {

    function backgroundMessageHandler(message) {
        if(message !== undefined && message.wssh && message.wssh !== "ACK")
            console.debug(message)
    }

    try{
        chrome.runtime.sendMessage(message); //, backgroundMessageHandler);
        // debug("sendMessage: ", message)
    }
    catch(err){
        console.debug(err)
    }
}

// Listen for updates from background.js
chrome.runtime.onMessage.addListener(
    (request, sender) => {
        if(request && request.keyEventInfo){
            let keyboardEvent = new KeyboardEvent(request.keyEventInfo.type, {...request.keyEventInfo});
            //console.log("rebuilt event:", keyboardEvent);
            document.body.dispatchEvent(keyboardEvent);
            debug(`simulated ${keyboardEvent.key} in ${document.activeElement.tagName}`)
        }
        else if(request !== undefined && request.wssh && request.wssh !== "ACK")
            debug(`from ${sender.id}`, request);
    }
);


/*
 * Capture Handle ID setup
 */
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
let handleId = (Math.random() + 1).toString(36).substring(2);
navigator.mediaDevices.setCaptureHandleConfig(
    { handle: handleId, permittedOrigins: ["*"] }
);
debug(`captureHandle: ${handleId}`);

// ToDo: remove the URL before release - it shouldn't matter
sendToBackground({url: window.location.href, captureHandle: handleId});

// Tell background to remove unneeded tabs
window.addEventListener('beforeunload', () => {
    sendToBackground({message: "unload"})
});
