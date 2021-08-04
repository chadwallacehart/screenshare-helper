function debug(...messages){
    console.log(`wssh 🕵️‍ `,  ...messages);
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

/*
 * Injection
 */
/*
async function inject() {
    let script = document.createElement('script');

    await fetch(chrome.runtime.getURL('inject.js') )
        .then(resp => resp.text())
        .then(scriptText => {
            script.textContent = scriptText;
            // console.log(scriptText);

            script.onload = () => {
                debug("webwebcam content: webwebcam inject script loaded");
                document.head.removeChild(this)
            };
            // ToDo: add to head or body? append or prepend?
            (document.head || document.documentElement).appendChild(script); //prepend

        })
        .catch(console.error);
}

//inject();

// doesn't work
/*
chrome.scripting.executeScript({
    file: 'inject.js'
});
*/

