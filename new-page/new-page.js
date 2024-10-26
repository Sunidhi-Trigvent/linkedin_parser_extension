document.addEventListener("DOMContentLoaded", () => {
    // Fetch the profile data from chrome.storage
    chrome.storage.sync.get("profiles", ({ profiles }) => {
      const tbody = document.querySelector("#profile-data tbody");
      tbody.innerHTML = ""; // Clear existing entries
  
      if (profiles && profiles.length > 0) {
        profiles.forEach((profile, index) => {
          const row = document.createElement("tr");
  
          row.innerHTML = `
            <td><img src="${
              profile.image || "default-image.jpg"
            }" alt="Profile Image" class="profile-image" width="100" height="100" style="border-radius: 50%; cursor: pointer;"></td>
            <td>${profile.name}</td>
            <td>${profile.headline}</td>
            <td><img src="../assets/images/delete.png" alt="Delete" class="delete-icon" data-index="${index}" style="cursor: pointer; width: 24px; height: 24px;"></td>
          `;
          tbody.appendChild(row);
        });
  
        // Add event listeners to each delete icon
        document.querySelectorAll(".delete-icon").forEach((icon) => {
          icon.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
  
            // Fetch profiles from storage again to update them
            chrome.storage.sync.get("profiles", ({ profiles }) => {
              if (profiles) {
                // Remove the profile at the specific index
                profiles.splice(index, 1);
                chrome.storage.sync.set({ profiles }, () => {
                  console.log("Profile deleted successfully");
  
                  // Reload the table to reflect the changes
                  location.reload();
                });
              }
            });
          });
        });
  
        // Add event listener to enlarge image on click with HD quality
        document.querySelectorAll(".profile-image").forEach((image) => {
          image.addEventListener("click", function () {
            const modal = document.getElementById("image-modal");
            const modalImage = document.getElementById("enlarged-image");
  
            // Set modal display to block and update image source to HD
            modal.style.display = "flex";
            modalImage.src = this.src.replace(
              "shrink_800_800",
              "shrink_1200_1200"
            ); // Update to HD quality
  
            // Close modal when clicking the close button
            document.getElementById("close-modal").onclick = function () {
              modal.style.display = "none";
            };
          });
        });
      } else {
        console.error("No profiles found in chrome.storage");
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="4">No profiles available.</td>`;
        tbody.appendChild(row);
      }
    });
  });
  