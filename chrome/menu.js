const menuId = "alt_text_copy_menu";
const title = chrome.i18n.getMessage("menuItemText");

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create(
        {
            id: menuId,
            title: title,
            type: "normal",
            contexts: [
                "image"
            ]
        },
        function () {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            }
        }
    );
    return true;
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (menuId === info.menuItemId) {
        findAlt(tab, alt => {
            if (alt) {
                copyAlt(tab);
            } else {
                noAltFound();
            }
        });
    }
    return true;
});

function findAlt(tab, callback) {
    chrome.tabs.sendMessage(tab.id, {type: "getClickedEl"}, {}, function (response) {
        callback(response.alt);
        return true;
    })
}

function noAltFound() {
    alert("Image has no alt text");
}

function copyAlt(tab) {
    chrome.tabs.sendMessage(tab.id, {type: "copyAlt"}, {},
        resp => {
            console.log(`Got resp in copy: ${JSON.stringify(resp)}`)
            return true;
        })
}