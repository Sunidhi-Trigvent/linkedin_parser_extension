chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "check_logged_in_status") {
      chrome.cookies.get(
        { url: "https://www.linkedin.com", name: "li_at" },
        (cookie) => {
          console.log("LinkedIn Cookie:", cookie); // Log cookie info for debugging
          sendResponse({ logged_in: !!cookie });
        }
      );
      return true; // Keeps the message channel open for async response
    }
  });
  