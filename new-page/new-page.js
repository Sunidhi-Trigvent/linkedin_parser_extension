document.addEventListener("DOMContentLoaded", () => {
    loadProfileData();

    // Listen for the updated profile data message from content.js
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "profileDataUpdated") {
            displayProfileData(message.profiles);
        }
    });
});

function loadProfileData() {
    chrome.storage.sync.get("profiles", ({ profiles }) => {
        displayProfileData(profiles || []);
    });
}

function displayProfileData(profiles) {
    const tbody = document.querySelector("#profile-data tbody");
    tbody.innerHTML = ""; // Clear existing entries

    if (profiles.length > 0) {
        profiles.forEach((profile, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${profile.image || "default-image.jpg"}" alt="Profile Image" class="profile-image"></td>
                <td>${profile.name}</td>
                <td>${profile.headline}</td>
                <td><img src="../assets/images/delete.png" alt="Delete" class="delete-icon" data-index="${index}"></td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners for delete icons
        document.querySelectorAll(".delete-icon").forEach((icon) => {
            icon.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                chrome.storage.sync.get("profiles", ({ profiles }) => {
                    if (profiles) {
                        profiles.splice(index, 1);
                        chrome.storage.sync.set({ profiles }, () => {
                            console.log("Profile deleted successfully");
                            loadProfileData(); // Reload profile data
                        });
                    }
                });
            });
        });

        // Add event listener to enlarge image on click
        document.querySelectorAll(".profile-image").forEach((image) => {
            image.addEventListener("click", function () {
                const modal = document.getElementById("image-modal");
                const modalImage = document.getElementById("enlarged-image");

                modal.classList.add("show-modal"); // Show modal
                modalImage.src = this.src.replace("shrink_800_800", "shrink_1200_1200");

                document.getElementById("close-modal").onclick = function () {
                    modal.classList.remove("show-modal"); // Hide modal
                };

                // Close modal when clicking outside of it
                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.classList.remove("show-modal"); // Hide modal
                    }
                };
            });
        });
    } else {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="4">No profiles available.</td>`;
        tbody.appendChild(row);
    }
}
