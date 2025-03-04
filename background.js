const storage = browser.storage ? browser.storage : chrome.storage;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveMistakes") {
        storage.local.get({ mistakes: {} }).then(data => {
            const storedMistakes = data.mistakes;

            for (const [word, count] of Object.entries(message.mistakes)) {
                storedMistakes[word] = (storedMistakes[word] || 0) + count;
            }

            storage.local.set({ mistakes: storedMistakes }).then(() => {
                console.log("Stored mistakes successfully.");
                sendResponse({ success: true });
            });
        });

        return true; 
    }
});
