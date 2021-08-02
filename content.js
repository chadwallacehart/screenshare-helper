function debug(message){
    console.debug(`wssh content| `, message)
}

debug(`content.js loaded on ${window.location.href}`);


function sendToBackground(message) {

    function backgroundMessageHandler(message) {
        if(message !== undefined && message.wssh && message.wssh !== "ACK")
            debug(message)
    }

    try{
        chrome.runtime.sendMessage(message, backgroundMessageHandler);
    }
    catch(err){
        debug(err)
    }
}

// Listen for updates from background.js
chrome.runtime.onMessage.addListener(
    (request, sender) => {

        /*
        function backgroundMessageHandler(message) {
            if(message !== undefined && message.wssh && message.wssh !== "ACK")
                console.debug("wssh content: ", message);

            if(message && message.keyEventInfo){
                let keyboardEvent = new KeyboardEvent(message.keyEventInfo.type, {...message.keyEventInfo});
                //console.log("rebuilt event:", keyboardEvent);
                document.body.dispatchEvent(keyboardEvent);
                console.debug(`wssh content: simulated ${keyboardEvent.key} in ${document.activeElement.tagName}`)
            }
        }


        console.debug("wssh content: message from background.js", request, sender);
        backgroundMessageHandler(request)
         */

        if(request && request.keyEventInfo){
            let keyboardEvent = new KeyboardEvent(request.keyEventInfo.type, {...request.keyEventInfo});
            //console.log("rebuilt event:", keyboardEvent);
            document.body.dispatchEvent(keyboardEvent);
            debug(`simulated ${keyboardEvent.key} in ${document.activeElement.tagName}`)
        }
        else if(request !== undefined && request.wssh && request.wssh !== "ACK")
            console.debug(`from ${sender.id}`, request);
    }
);

sendToBackground({url: window.location.href});


