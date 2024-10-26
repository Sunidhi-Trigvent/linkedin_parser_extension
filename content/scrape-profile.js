document.addEventListener("DOMContentLoaded", () => {
    // Fetch the profile data from chrome.storage
    chrome.storage.sync.get("profileData", ({ profileData }) => {
      if (profileData) {
        // Update the table with the fetched data
        const nameElement = document.getElementById("profile-name");
        const headlineElement = document.getElementById("profile-headline");
        const imageElement = document.getElementById("profile-image");
  
        nameElement.innerText = profileData.name;
        headlineElement.innerText = profileData.headline;
        imageElement.src = profileData.image || "default-image.jpg"; // Use a default image if none is available
      } else {
        console.error("Profile data not found in chrome.storage");
      }
    });
  });
  