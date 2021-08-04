function debug(...messages){
    console.debug(`wssh 💉 `,  ...messages);
}

debug("injected");


const origGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);

async function shimGetUserMedia(constraints) {

    let stream = await origGetDisplayMedia(constraints);

    let [track] = stream.getVideoTracks();

    let capturedHandle = track && track.getCaptureHandle() && track.getCaptureHandle().handle;

    if(capturedHandle){
        debug(`captured handle is: ${capturedHandle}`);

        track.onended = ()=> debug(`captured tab ended`);

        //ToDo: tell the background worker to relay keys

    }
    else {
        // send a notice a tab wasn't shared
    }


    return stream
}

if ( navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices ) {
    navigator.mediaDevices.getDisplayMedia = shimGetUserMedia;
}
else{
    // ToDo
}
