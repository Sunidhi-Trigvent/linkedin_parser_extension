chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeProfile") {
        setTimeout(() => {
            const profileNameElement = document.querySelector("h1.text-heading-xlarge");
            const profileHeadlineElement = document.querySelector("div.text-body-medium");
            const profileImageElement = document.querySelector("img.pv-top-card-profile-picture__image--show");

            const profileData = {
                name: profileNameElement ? profileNameElement.innerText : "Not found",
                headline: profileHeadlineElement ? profileHeadlineElement.innerText : "Not found",
                image: profileImageElement ? profileImageElement.src : "",
            };

            chrome.storage.sync.get("profiles", ({ profiles = [] }) => {
                profiles.push(profileData);
                chrome.storage.sync.set({ profiles }, () => {
                    console.log("Profile data saved in chrome.storage", profiles);

                    // Send updated profiles list to newpage.js
                    chrome.runtime.sendMessage({ type: "profileDataUpdated", profiles });
                });
            });

            sendResponse({ success: true, profileData });
        }, 1);
        return true;
    }
});
