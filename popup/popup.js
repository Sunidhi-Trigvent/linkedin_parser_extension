// login code starts-
document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "check_logged_in_status" }, (response) => {
      console.log("Login status response:", response); // Debugging log
  
      if (response && response.logged_in) {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("fetch-section").style.display = "block";
      } else {
        document.getElementById("login-section").style.display = "block";
        document.getElementById("fetch-section").style.display = "none";
      }
    });
  
    // Button listeners remain the same
    document.getElementById("btn-login").addEventListener("click", () => {
      chrome.tabs.create({ url: "https://www.linkedin.com/login" });
    });
  
    document.getElementById("btn-f").addEventListener("click", () => {
      const linkedin_url = document.getElementById("linkedin-url").value;
      chrome.runtime.sendMessage({ action: "fetch_data", linkedin_url });
    });
    // login code ends.


    // const loginButton = document.getElementById("btn-login");
    const fetchSection = document.getElementById("fetch-section");
    // const loginSection = document.getElementById("login-section");
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
                    // Profile data successfully scraped, open the new page
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
  


  