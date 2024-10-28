// login code starts-
document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "check_logged_in_status" }, (response) => {
    console.log("Login status response:", response); // Debugging log

    if (response && response.logged_in) {
      document.getElementById("login-section").classList.add("hidden");
      document.getElementById("fetch-section").classList.remove("hidden");
    } else {
      document.getElementById("login-section").classList.remove("hidden");
      document.getElementById("fetch-section").classList.add("hidden");
    }
  });

  document.getElementById("btn-login").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://www.linkedin.com/login" });
  });

  document.getElementById("btn-f").addEventListener("click", () => {
    const linkedin_url = document.getElementById("linkedin-url").value;
    chrome.runtime.sendMessage({ action: "fetch_data", linkedin_url });
  });

  const fetchButton = document.getElementById("btn-f");
  const linkedinUrlInput = document.getElementById("linkedin-url");

  // Handle fetch data button click
  fetchButton.addEventListener("click", () => {
    const url = linkedinUrlInput.value.trim();
    if (url) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        chrome.tabs.update(activeTab.id, { url: url }, () => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === activeTab.id && info.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);

              chrome.tabs.sendMessage(
                activeTab.id,
                { action: "scrapeProfile" },
                (response) => {
                  if (response && response.success) {
                    chrome.tabs.create({ url: "./new-page/new-page.html" });
                  } else {
                    console.error(
                      "Error in sending message to content script."
                    );
                  }
                }
              );
            }
          });
        });
      });
    }
  });
});
