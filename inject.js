function debug(...messages) {
    console.debug(`wssh 💉 `, ...messages);
}

function sendToContentJs(messageObj) {
    const toContentEvent = new CustomEvent('wssh', {detail: messageObj});
    document.dispatchEvent(toContentEvent);
}

// is this necessary here?
// if ( navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices ) {
if (!window.webRTCScreenShareHelper) {
    let origGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);

    async function shimGetUserMedia(constraints) {
        window.webRTCScreenShareHelper = true;

        let stream = await origGetDisplayMedia(constraints);
        let [track] = stream.getVideoTracks();
        let capturedHandle = track && track.getCaptureHandle() && track.getCaptureHandle().handle;

        if (capturedHandle) {
            debug(`captured handle is: ${capturedHandle}`);

            track.onended = () => {
                debug(`captured handle ${capturedHandle} ended`);
                sendToContentJs({lostDisplayMediaHandle: capturedHandle});
            };

            sendToContentJs({gotDisplayMediaHandle: capturedHandle});
        } else {
            // send a notice a tab wasn't shared
        }
        return stream
    }

    navigator.mediaDevices.getDisplayMedia = shimGetUserMedia;
}

/*
 * debugging
 */

['keydown', 'keyup'].forEach(event => {
    document.addEventListener(event, async e => {
        debug(`${event} event: ${e.code}`, e);
    })
});


debug("injected");

// ToDo: prevent repeat overloading of getDisplayMedia?
/*
if(origGetDisplayMedia){
    debug("duplicate gDM shim");
}
else

 */


