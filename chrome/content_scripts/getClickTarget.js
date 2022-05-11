let clickedEl = null;

function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

document.addEventListener("contextmenu", function(event){
    clickedEl = event.target;
    return true;
}, {});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "getClickedEl") {
        sendResponse({alt: clickedEl.alt});
    } else if (request.type === "copyAlt") {
        copyToClipboard(clickedEl.alt)
            .catch(e => console.log(`Error copying text to clipboard: ${e}`));
        clickedEl = null;
    }
});