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
                noAltFound(tab);
            }
        });
    }
    return true;
});

function findAlt(tab, callback) {
    chrome.tabs.sendMessage(tab.id, {type: "getClickedEl"}, {}, function (response) {
        callback(response?.alt);
        return true;
    })
}

function noAltFound(tab) {
    chrome.tabs.sendMessage(tab.id, {type: "alertNoAlt"}, {},
        resp => {
            return true;
        })
}

function copyAlt(tab) {
    chrome.tabs.sendMessage(tab.id, {type: "copyAlt"}, {},
        resp => {
            return true;
        })
}
