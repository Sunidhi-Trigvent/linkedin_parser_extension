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
  });
  