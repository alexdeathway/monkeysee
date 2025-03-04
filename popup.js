document.addEventListener("DOMContentLoaded", async () => {
    console.log("MonkeySee Tracker Loaded");

    const wordsContainer = document.getElementById("words");

    try {
        const data = await browser.storage.local.get({ mistakes: {} });
        const mistakes = data.mistakes || {};

        console.log("Loaded Mistakes:", mistakes);

        for (let word in mistakes) {
            const div = document.createElement("div");
            div.className = "word";
            div.innerHTML = `<span class="word-text">${word} <span class="count" style="display: none;">(${mistakes[word]})</span></span>
                             <button data-word="${word}">Delete</button>`;
            wordsContainer.appendChild(div);
        }

        //words count will be patched in next few updates
        wordsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("word-text")) {
                const countSpan = e.target.querySelector(".count");
                if (countSpan) {
                    countSpan.style.display = countSpan.style.display === "none" ? "inline" : "none";
                }
            }
        });

        // Add event listeners for delete buttons
        document.querySelectorAll("button[data-word]").forEach(button => {
            button.addEventListener("click", async (e) => {
                const word = e.target.getAttribute("data-word");
                delete mistakes[word];

                await browser.storage.local.set({ mistakes });
                location.reload();
            });
        });

    } catch (error) {
        console.error("Error accessing storage:", error);
    }
});

