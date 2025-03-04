const storage = browser.storage || chrome.storage;

// Function to extract correct words from error elements
async function extractCorrectWords() {
    const wordElements = document.querySelectorAll(".word.nocursor.error");
    const mistakes = {};

    wordElements.forEach(div => {
        // Collect only valid letters (ignoring "incorrect extra" class)
        const correctWord = Array.from(div.children)
            //extra class are added when user types character that are longer than
            //the word for ex: typing 'thought" for 'though' 't'  will have extra class
            //we need to ignore those
            .filter(letter => !letter.classList.contains("extra")) 
            .map(letter => letter.textContent)
            .join("");
        // console.log(`Correct word: ${correctWord}`);
        if (correctWord) {
            mistakes[correctWord] = (mistakes[correctWord] || 0) + 1;
        }
        
    });

    if (Object.keys(mistakes).length > 0) {
        try {
            const data = await storage.local.get({ mistakes: {} });
            const storedMistakes = data.mistakes || {};

            for (const [word, count] of Object.entries(mistakes)) {
                storedMistakes[word] = (storedMistakes[word] || 0) + count;
            }

            await storage.local.set({ mistakes: storedMistakes });
            console.log(`Stored words: ${Object.keys(mistakes).join(", ")}`);
        } catch (error) {
            console.error("Error accessing storage:", error);
        }
    }
}

//observer monitor when element resultWordsHistory and wpmChart are present
//need better way to detect as they are present in background as well
//

let observer;

function startObserver() {
    //kill the observer before if present
    if (observer) observer.disconnect(); 

    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            console.log("mutation detected before obsever element");
            if (document.getElementById("resultWordsHistory") && document.getElementById("wpmChart")) {
                console.log("trigger elements found extracting words..");
                extractCorrectWords();
            }
            else {
                console.log("something went wrong, target elements not found");
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

//check for the visibility of the document
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        startObserver(); 
        if (document.getElementById("resultWordsHistory") && document.getElementById("wpmChart")) {
            console.log("visibilitychange triggered");
            extractCorrectWords(); 
        }
    } else {
        if (observer) observer.disconnect(); 
    }
});


console.log("started initial observer");
startObserver();
