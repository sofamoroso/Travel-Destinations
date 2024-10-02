// Load the navbar, data, and set up iframe communication
document.addEventListener('DOMContentLoaded', () => {
	loadData();
	initializeEventListeners();
});

function initializeEventListeners() {
    // Listen for messages from the iframe (gets info about the path clicked)
	window.addEventListener('message', (event) => {
		console.log('Message received from MAP:', event.data);
		if (event.data && event.data.action === 'countryClicked') {
			showSidebar(event.data.path, event.data.countryCode);
		}
	});

	// Listen for the custom event destinationAdded to refresh the data
    document.addEventListener('destinationAdded', loadData);
}

// Function to load data and create user buttons
async function loadData() {
    const [users, travelDestinations] = await fetchData();
    const userButtonsContainer = document.getElementById('user-buttons');
    const iframe = document.getElementById('worldMapIframe');

    clearUserButtons(userButtonsContainer);

    if (users.length > 0) {
        const loggedInUserId = sessionStorage.getItem('logged-_id');
        sortUsers(users, loggedInUserId);
        createUserButtons(users, travelDestinations, userButtonsContainer, iframe, loggedInUserId);
    } else {
        console.error('users array is not defined');
    }
}

// Function to fetch users and travel destinations from the backend
async function fetchData() {
    const [users, travelDestinations] = await Promise.all([
        fetchUsers(),
        fetchTravelDestinations(),
    ]);
    return [users, travelDestinations];
}

function clearUserButtons(container) {
    container.innerHTML = '';
}

function sortUsers(users, loggedInUserId) {
    users.sort((a, b) =>
        a._id === loggedInUserId ? -1 : b._id === loggedInUserId ? 1 : 0
    );
}

// Function to create user buttons and send travel destinations to the iframe
function createUserButtons(users, travelDestinations, container, iframe, loggedInUserId) {
    users.forEach((user) => {
        const button = document.createElement('button');
        button.textContent = user.username;
        button.addEventListener('click', () => handleUserButtonClick(user, travelDestinations, iframe, button));
        container.appendChild(button);

        if (user._id === loggedInUserId) {
            highlightLoggedInUser(button, travelDestinations, iframe, loggedInUserId);
        }
    });
}

function handleUserButtonClick(user, travelDestinations, iframe, button) {
    sessionStorage.setItem('selectedUser', user.username);
    sessionStorage.setItem('selectedUserId', user._id);

    const filteredDestinations = travelDestinations.filter((destination) => destination.userId === user._id);
    iframe.contentWindow.postMessage({ action: 'visitedPlaces', travelDestinations: filteredDestinations }, '*');

    document.querySelectorAll('#user-buttons button').forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    hideSidebar();
}

// Highlight the logged in user button and send their travel destinations to the iframe
function highlightLoggedInUser(button, travelDestinations, iframe, loggedInUserId) {
    button.classList.add('active');
    const myTravelDestinations = travelDestinations.filter((destination) => destination.userId === loggedInUserId);
    iframe.contentWindow.postMessage({ action: 'visitedPlaces', travelDestinations: myTravelDestinations }, '*');
}

// Fetch all destinations for a specific user and country
async function fetchTravelDestinationsByUserAndCountry(userId, country) {
	try {
		const response = await fetch(
			`/api/travel-destinations/${userId}/${country}`
		);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const travelDestinations = await response.json();
		console.log('trvDestinationsByUserAndCountry', travelDestinations);

		return travelDestinations;
	} catch (error) {
		console.error('Error fetching visited places:', error);
		return [];
	}
}

// Function to show the sidebar with the clicked path = country name
async function showSidebar(path, countryCode) {
    const userId = sessionStorage.getItem('selectedUserId');
    const username = sessionStorage.getItem('selectedUser');

    sessionStorage.setItem('selectedCountry', path);

    const travelDestinations = await fetchTravelDestinationsByUserAndCountry(userId, path);

    updateSidebarContent(path, countryCode, username, travelDestinations);
}

function updateSidebarContent(path, countryCode, username, travelDestinations) {
    const sidebar = document.getElementById('right-sidebar');
    const sidebarTitle = document.getElementById('sidebar-title');
    const sidebarSubtitle = document.getElementById('sidebar-subtitle');
    const sideBarFlag = document.getElementById('sidebar-flag');
    const sidebarContent = document.getElementById('sidebar-content');
	const sidebarCloseButton = document.getElementById('close-sidebar-button');

    sideBarFlag.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;

    sidebarContent.innerHTML = '';
    sidebarTitle.innerHTML = `You clicked on ${path}.`;
    sidebarSubtitle.innerHTML = `${username} visited ${travelDestinations.length} places in this country.`;

    if (travelDestinations.length > 0) {
        travelDestinations.forEach(displayDestinationCards);
    } else {
        const noCitiesMessage = document.createElement('p');
		noCitiesMessage.textContent = 'No cities visited in this country.';
		sidebarContent.appendChild(noCitiesMessage);
    }
	
	sidebarCloseButton.addEventListener('click', hideSidebar);
	sidebar.classList.add('show');
}

// Function to hide the sidebar
function hideSidebar() {
	const sidebar = document.getElementById('right-sidebar');
	sidebar.classList.remove('show');

	sessionStorage.removeItem('selectedCountry');

	// Send message to iframe to removeClickedClass
	const iframe = document.getElementById('worldMapIframe');
	iframe.contentWindow.postMessage({ action: 'removeClickedClass' }, '*');
}

function displayDestinationCards(destination) {
	const template = document.getElementById('destination-card-template');
	const card = template.content.cloneNode(true);
	const sidebarContent = document.getElementById('sidebar-content');
	const cityName = card.querySelector('.city-name');
	const cityDescription = card.querySelector('.city-description');
	const dateVisited = card.querySelector('.date-visited');
	const ratingDiv = card.querySelector('.rating');
	const maxStars = 5;

	cityName.textContent = destination.city;
	cityDescription.textContent = destination.description;
	dateVisited.textContent = `Visited on: ${new Date(
		destination.date
	).toLocaleDateString()}`;

	for (let i = 0; i < maxStars; i++) {
		const star = document.createElement('span');
		star.classList.add('star');
		if (i < destination.rating) {
			star.classList.add('filled');
		}
		star.textContent = '★';
		ratingDiv.appendChild(star);
	}

	sidebarContent.appendChild(card);
}

// Function to fetch users from the backend
async function fetchUsers() {
	try {
		const response = await fetch('/api/users');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const users = await response.json();
		console.log(users);

		return users;
	} catch (error) {
		console.error('Error fetching users:', error);
		return [];
	}
}

// Function to fetch visited places from the backend
async function fetchTravelDestinations() {
	try {
		const response = await fetch('/api/travel-destinations');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const travelDestinations = await response.json();
		console.log(travelDestinations);

		return travelDestinations;
	} catch (error) {
		console.error('Error fetching visited places:', error);
		return [];
	}
}

