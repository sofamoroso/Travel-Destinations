// Define global variables
// window.globalUsername = null;

// Function to load the navbar
function loadNavbar() {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      // Attach logout event listener after the navbar has been loaded
      const logoutButton = document.getElementById("logoutButton");
      if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default link behavior
          handleLogout(); // Call the global logout function
        });
      }
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

function loadData() {
  // Check if users and visitedPlaces arrays are defined
  if (typeof users !== "undefined" && typeof visitedPlaces !== "undefined") {
    const userButtonsContainer = document.getElementById("user-buttons");
    const childFrame = document.getElementById("worldMapIframe");

    users.forEach((user) => {
      const button = document.createElement("button");
      button.textContent = user.name;
      button.addEventListener("click", () => {
        // Filter visitedPlaces based on the clicked user
        const filteredPlaces = visitedPlaces.filter(
          (place) => place.username === user.name.split(" ")[0]
        );
        // Send the filtered array to the child iframe
        childFrame.contentWindow.postMessage(
          { action: "visitedPlaces", travelDestinations: filteredPlaces },
          "*"
        );
      });
      userButtonsContainer.appendChild(button);
    });
  } else {
    console.error("users or visitedPlaces array is not defined");
  }
}

// Fetch all destinations for a specific user and country
async function fetchTravelDestinationsByUserAndCountry(userId, country) {
  try {
    const response = await fetch(
      `/api/travel-destinations/${userId}/${country}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const travelDestinations = await response.json();
    console.log("trvDestinationsByUserAndCountry", travelDestinations);

    return travelDestinations;
  } catch (error) {
    console.error("Error fetching visited places:", error);
    return [];
  }
}

const sidebarContent = document.getElementById("sidebar-content");

// Function to show the sidebar with the clicked path = country name
async function showSidebar(path, countryCode) {
  const userId = sessionStorage.getItem("selectedUserId");
  const username = sessionStorage.getItem("selectedUser");

  if (!userId || !username) {
    console.error("No user selected");
    return;
  }

  const travelDestinations = await fetchTravelDestinationsByUserAndCountry(
    userId,
    path
  );

  const sidebar = document.getElementById("right-sidebar");
  const sidebarTitle = document.getElementById("sidebar-title");
  const sidebarSubtitle = document.getElementById("sidebar-subtitle");
  const sideBarFlag = document.getElementById("sidebar-flag");
  const sidebarContent = document.getElementById("sidebar-content");

  sideBarFlag.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;

  sidebarContent.innerHTML = "";
  sidebarTitle.innerHTML = `You clicked on ${path}.`;
  sidebarSubtitle.innerHTML = `${username} visited ${travelDestinations.length} places in this country.`;

  if (travelDestinations.length > 0) {
    travelDestinations.forEach(displayDestinationCards);
  } else {
    const noCitiesMessage = document.createElement("p");
    noCitiesMessage.textContent = "No cities visited in this country.";
    sidebarContent.appendChild(noCitiesMessage);
  }

  sidebar.classList.add("show");
}

function hideSidebar() {
  const sidebar = document.getElementById("right-sidebar");
  sidebar.classList.remove("show");
}

function displayDestinationCards(destination) {
  const template = document.getElementById("destination-card-template");
  const card = template.content.cloneNode(true);
  const sidebarContent = document.getElementById("sidebar-content");
  const cityName = card.querySelector(".city-name");
  const cityDescription = card.querySelector(".city-description");
  const dateVisited = card.querySelector(".date-visited");
  const ratingDiv = card.querySelector(".rating");
  const maxStars = 5;

  cityName.textContent = destination.city;
  cityDescription.textContent = destination.description;
  dateVisited.textContent = `Visited on: ${new Date(
    destination.date
  ).toLocaleDateString()}`;

  for (let i = 0; i < maxStars; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    if (i < destination.rating) {
      star.classList.add("filled");
    }
    star.textContent = "★";
    ratingDiv.appendChild(star);
  }

  sidebarContent.appendChild(card);
}

// Function to fetch users from the backend
async function fetchUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const users = await response.json();
    console.log(users);

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Function to fetch visited places from the backend
async function fetchTravelDestinations() {
  try {
    const response = await fetch("/api/travel-destinations");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const travelDestinations = await response.json();
    console.log(travelDestinations);

    return travelDestinations;
  } catch (error) {
    console.error("Error fetching visited places:", error);
    return [];
  }
}

// Function to load data and create user buttons
async function loadData2() {
  // Fetch users from the backend
  const [users, travelDestinations] = await Promise.all([
    fetchUsers(),
    fetchTravelDestinations(),
  ]);

  const userButtonsContainer = document.getElementById("user-buttons");
  const childFrame = document.getElementById("worldMapIframe");

  //Clean previous users
  userButtonsContainer.innerHTML = "";

  // Check if users are defined
  if (users.length > 0) {
    // Get the logged-in user ID
    const loggedInUserId = sessionStorage.getItem("logged-_id");

    // Sort users to ensure the logged-in user is on top
    users.sort((a, b) =>
      a._id === loggedInUserId ? -1 : b._id === loggedInUserId ? 1 : 0
    );

    users.forEach((user) => {
      const button = document.createElement("button");
      button.textContent = user.username;
      button.addEventListener("click", () => {
        // Selected user
        sessionStorage.setItem("selectedUser", user.username);
        sessionStorage.setItem("selectedUserId", user._id);

        // Filter visitedPlaces based on the clicked user
        const filteredDestinations = travelDestinations.filter(
          (destination) => destination.userId === user._id
        );
        // Send the filtered array to the child iframe
        childFrame.contentWindow.postMessage(
          { action: "visitedPlaces", travelDestinations: filteredDestinations },
          "*"
        );

        // Highlight the clicked button
        document
          .querySelectorAll("#user-buttons button")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
      userButtonsContainer.appendChild(button);

      // Highlight the button/countries for the logged-in user by default
      if (user._id === loggedInUserId) {
        button.classList.add("active");
        const myTravelDestinations = travelDestinations.filter(
          (destination) => destination.userId === loggedInUserId
        );
        childFrame.contentWindow.postMessage(
          { action: "visitedPlaces", travelDestinations: myTravelDestinations },
          "*"
        );
      }
    });
  } else {
    console.error("users array is not defined");
  }
}

export { loadNavbar, loadData2, showSidebar, hideSidebar };
