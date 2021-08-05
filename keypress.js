let keys = [];
function updateKeys(){
    // console.log(keys);
    document.getElementById("key").innerText = keys.join(" ");
}

document.addEventListener('keydown', async e => {
    await relayToTabs(e);

    // just for display
    const key = e.code;
    if(!keys.includes(key)){
        console.log(`${key} down`, keys);
        keys.push(key);
        updateKeys()
    }
});

document.addEventListener('keyup', async e => {
    await relayToTabs(e);

    // just for display
    const key = e.code;
    console.log(`${key} up`, keys);
    keys = keys.filter(item => item !== key);
    updateKeys();
});

async function relayToTabs(event){

    if(!event.key){
        console.error("key error", event);
        return
    }

    const keyEventInfo = {
        altKey: event.altKey,
        bubbles: event.bubbles,
        cancelBubble: event.cancelBubble,
        cancelable: event.cancelable,
        charCode: event.charCode,
        code: event.code,
        composed: event.composed,
        ctrlKey: event.ctrlKey,
        currentTarget: event.currentTarget,
        defaultPrevented: event.defaultPrevented,
        detail: event.detail,
        eventPhase: event.eventPhase,
        isComposing: event.isComposing,
        isTrusted: event.isTrusted,
        key: event.key,
        keyCode: event.keyCode,
        metaKey: event.metaKey,
        repeat: event.repeat,
        returnValue: event.returnValue,
        shiftKey: event.shiftKey,
        type: event.type,
        which: event.which
    };

    console.log("KeyboardEvent:", keyEventInfo);
    chrome.runtime.sendMessage({keyEventInfo: keyEventInfo});
}

/*
altKey: false
bubbles: true
cancelBubble: false
cancelable: true
charCode: 0
code: "KeyD"
composed: true
ctrlKey: false
currentTarget: null
defaultPrevented: false
detail: 0
eventPhase: 0
isComposing: false
isTrusted: true
key: "d"
keyCode: 68
location: 0
metaKey: false
path: (4) [body, html, document, Window]
repeat: false
returnValue: true
shiftKey: false
sourceCapabilities: InputDeviceCapabilities {firesTouchEvents: false}
srcElement: body
target: body
timeStamp: 2847.7999999970198
type: "keyup"
view: Window {window: Window, self: Window, document: document, name: '', location: Location, …}
which: 68
[[Prototype]]: KeyboardEvent
 */
