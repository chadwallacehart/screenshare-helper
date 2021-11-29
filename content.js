function debug(...messages){
    console.debug(`wssh 🕵️‍ `,  ...messages);
}

debug(`content.js loaded on ${window.location.href}`);

/*
 * Simulate a keystroke from actual keystroke event information
 * keyInfo needs to contain most of the relevant info from the original keyBoardEvent
 */
function simulateKeyStroke(keyInfo){
    keyInfo.srcElement = document.activeElement;
    let keyboardEvent = new KeyboardEvent(keyInfo.type, {...keyInfo});
    document.body.focus();
    document.body.dispatchEvent(keyboardEvent);
    debug(`simulated ${keyboardEvent.key} in ${document.activeElement.tagName}`)
}


/*
 * Communicate with the background worker context
 */

function sendToBackground(message) {

    /*
    function backgroundMessageHandler(message) {
        if(message !== undefined && message.wssh && message.wssh !== "ACK")
            console.debug(message)
    }
    */

    try{
        chrome.runtime.sendMessage(message); //, backgroundMessageHandler);
        debug("sent this to background worker:", message);

    }
    catch(err){
        console.debug(err)
    }
}

// Listen for updates from background.js
chrome.runtime.onMessage.addListener(
    (request, sender) => {
        debug(`from ${sender.id}`, request, sender);


        if(request && request.keyEventInfo){
            simulateKeyStroke(request.keyEventInfo)
        }
        //else if(request !== undefined && request.wssh && request.wssh !== "ACK")
            // debug(`from ${sender.id}`, request);
    }
);


/*
 * Communicate with the injected content
 */

const sendToInject = message => {
    debug("sending this to inject.js", message);
    const toInjectEvent = new CustomEvent('wssh', {detail: message});
    document.dispatchEvent(toInjectEvent);
};

document.addEventListener('wssh', e => {
    if (!e.detail)
        return;

    let data = e.detail;
    sendToBackground(data);
});



/*
 * Capture Handle ID setup
 */
// Make a short pseudo-random id: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
let handleId = (Math.random() + 1).toString(36).substring(2);
navigator.mediaDevices.setCaptureHandleConfig(
    { handle: handleId, permittedOrigins: ["*"] }
);
debug(`captureHandle: ${handleId}`);

// ToDo: remove the URL before release - it shouldn't matter
sendToBackground({url: window.location.href, captureHandle: handleId});

// Tell background to remove unneeded tabs
window.addEventListener('beforeunload', () => {
    sendToBackground({unload: "unload"})
});

