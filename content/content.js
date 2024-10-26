chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeProfile") {
      setTimeout(() => {
        // Scrape the profile data
        const profileNameElement = document.querySelector(
          "h1.text-heading-xlarge"
        );
        const profileHeadlineElement = document.querySelector(
          "div.text-body-medium"
        );
        const profileImageElement = document.querySelector(
          "img.pv-top-card-profile-picture__image--show"
        );
  
        const profileName = profileNameElement
          ? profileNameElement.innerText
          : "Not found";
        const profileHeadline = profileHeadlineElement
          ? profileHeadlineElement.innerText
          : "Not found";
        const profileImage = profileImageElement ? profileImageElement.src : "";
  
        const profileData = {
          name: profileName,
          headline: profileHeadline,
          image: profileImage,
        };
  
        // Fetch existing profiles
        chrome.storage.sync.get("profiles", ({ profiles = [] }) => {
          profiles.push(profileData); // Add the new profile
          chrome.storage.sync.set({ profiles }, () => {
            console.log("Profile data saved in chrome.storage", profiles);
          });
        });
  
        sendResponse({ success: true, profileData });
      }, 1000); // Adjust the delay as needed
      return true; // Indicate that the response is asynchronous
    }
  });
  