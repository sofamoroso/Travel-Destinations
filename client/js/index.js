import { deleteDestination, fetchTravelDestinationsByUserAndCountry, fetchUsers, fetchTravelDestinations } from './dataService.js';

const usersPerPage = 5; 
let currentPage = 0;
let communityUsers = [];
let allTravelDestinations = [];

// Load the navbar, data, and set up iframe communication
document.addEventListener('DOMContentLoaded', () => {
	const token = sessionStorage.getItem('jwt-TravelDestination');

	if (token) {
		loadData();
		initializeEventListeners();
	}
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
	document.addEventListener('destinationChanged', () => {
		loadData();

		// Dynamically update the sidebar content when a destination is added
		const sidebar = document.getElementById('right-sidebar');
		if (sidebar.classList.contains('show')) {
			updateSidebarContent();
		}
	});
}

// Function to load data and create user buttons
async function loadData() {
	const [users, travelDestinations] = await fetchData();
	const userButtonsContainer = document.getElementById('user-buttons');
	const iframe = document.getElementById('worldMapIframe');
	const loggedInUserId = sessionStorage.getItem('logged-_id');

	//clearUserButtons(userButtonsContainer);

	if (users.length > 0) {
		const loggedInUserName = sessionStorage.getItem('logged-username');
		const profileCard = document.getElementById('profile-card');

		profileCard.classList.add('active');
		communityUsers = users.filter((user) => user._id !== loggedInUserId);
		allTravelDestinations = travelDestinations;
		// sortUsers(users);
		// createUserButtons(users, travelDestinations, userButtonsContainer, iframe, loggedInUserId);
		populateUserCard(loggedInUserName, loggedInUserId, travelDestinations, profileCard, iframe);
		createUserButtons(communityUsers, travelDestinations, userButtonsContainer, iframe);
	} else {
		console.error('users array is not defined');
	}

	loadLoggedInUserDestinations(travelDestinations, iframe, loggedInUserId);
}

// Function to fetch users and travel destinations from the backend
async function fetchData() {
	const [users, travelDestinations] = await Promise.all([fetchUsers(), fetchTravelDestinations()]);
	return [users, travelDestinations];
}

function clearUserButtons(container) {
	container.innerHTML = '';
}

// function sortUsers(users, loggedInUserId) {
//     users.sort((a, b) =>
//         a._id === loggedInUserId ? -1 : b._id === loggedInUserId ? 1 : 0
//     );
// }

// Function to create user buttons and send travel destinations to the iframe
function createUserButtons(users, travelDestinations, container, iframe) {
    clearUserButtons(container);

    // Calculate start and end index
    const start = currentPage * usersPerPage;
    const end = start + usersPerPage;
    const paginatedUsers = users.slice(start, end);

    paginatedUsers.forEach((user) => {
        const button = document.createElement('button');
        button.textContent = user.username;
        button.addEventListener('click', () => handleUserButtonClick(user, travelDestinations, iframe, button));
        container.appendChild(button);
    });

    // Enable/disable buttons based on the current page
    document.getElementById('prevButton').style.visibility  = currentPage === 0 ? 'hidden' : 'visible';
    document.getElementById('nextButton').style.visibility  = end >= users.length ? 'hidden' : 'visible';
}

// Function to handle next button click
function nextPage() {
    if ((currentPage + 1) * usersPerPage < communityUsers.length) {
        currentPage++;
        updateUserButtons();
    }
}

// Function to handle previous button click
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        updateUserButtons();
    }
}

// Function to update user buttons based on current page
function updateUserButtons() {
    const userButtonsContainer = document.getElementById('user-buttons');
    const iframe = document.getElementById('worldMapIframe');

    createUserButtons(communityUsers, allTravelDestinations, userButtonsContainer, iframe);
}

// Event listeners for buttons
document.getElementById('nextButton').addEventListener('click', nextPage);
document.getElementById('prevButton').addEventListener('click', prevPage);

function handleUserButtonClick(user, travelDestinations, iframe, button) {
	sessionStorage.setItem('selectedUser', user.username);
	sessionStorage.setItem('selectedUserId', user._id);

	const filteredDestinations = travelDestinations.filter((destination) => destination.userId === user._id);
	const profileCard = document.getElementById('profile-card');

	const uniqueCountries = new Set(filteredDestinations.map((destination) => destination.country));
	console.log(uniqueCountries); // This will log the Set of unique countries

	iframe.contentWindow.postMessage({ action: 'visitedPlaces', travelDestinations: uniqueCountries }, '*');

	profileCard.classList.remove('active');

	document.querySelectorAll('#user-buttons button').forEach((btn) => btn.classList.remove('active'));
	button.classList.add('active');

	const addDestinationButtons = document.querySelectorAll('.addDestinationBtn');
	toggleButtonVisibility(Array.from(addDestinationButtons));

	hideSidebar();
}

function populateUserCard(loggedInUserName, loggedInUserId, travelDestinations, card, iframe) {
	const profileName = document.querySelector('#profile-data h3');
	const profileCountryCount = document.querySelector('#country-count span');

	const filteredDestinations = travelDestinations.filter((destination) => destination.userId === loggedInUserId);
	const uniqueCountries = new Set(filteredDestinations.map((destination) => destination.country));

	profileName.textContent = loggedInUserName;
	profileCountryCount.textContent = uniqueCountries.size;

	card.addEventListener('click', () => handleUserCardClick(loggedInUserId, loggedInUserName, uniqueCountries, iframe));
}

function handleUserCardClick(loggedInUserId, loggedInUserName, uniqueCountries, iframe) {
	sessionStorage.setItem('selectedUser', loggedInUserName);
	sessionStorage.setItem('selectedUserId', loggedInUserId);
	const profileCard = document.getElementById('profile-card');


	console.log(uniqueCountries); // This will log the Set of unique countries

	iframe.contentWindow.postMessage({ action: 'visitedPlaces', travelDestinations: uniqueCountries }, '*');
	
	profileCard.classList.add('active');
	document.querySelectorAll('#user-buttons button').forEach((btn) => btn.classList.remove('active'));

	const addDestinationButtons = document.querySelectorAll('.addDestinationBtn');
	toggleButtonVisibility(Array.from(addDestinationButtons));

	hideSidebar();
}

// Highlight the logged in user button and send their travel destinations to the iframe
function loadLoggedInUserDestinations(travelDestinations, iframe, loggedInUserId) {
	const myTravelDestinations = travelDestinations.filter((destination) => destination.userId === loggedInUserId);

	const uniqueCountries = new Set(myTravelDestinations.map((destination) => destination.country));
	console.log(uniqueCountries); // This will log the Set of unique countries

	iframe.contentWindow.postMessage({ action: 'visitedPlaces', travelDestinations: uniqueCountries }, '*');
}

// Function to show the sidebar with the clicked path = country name
async function showSidebar(path, countryCode) {
	const userId = sessionStorage.getItem('selectedUserId');
	const username = sessionStorage.getItem('selectedUser');

	sessionStorage.setItem('selectedCountry', path);
	sessionStorage.setItem('selectedCountryCode', countryCode);

	const travelDestinations = await fetchTravelDestinationsByUserAndCountry(userId, path);

	if (!travelDestinations) {
		console.error('Failed to fetch travel destinations.');
		return;
	}

	initializeSidebarContent(path, countryCode, username, travelDestinations);
}

function initializeSidebarContent(path, countryCode, username, travelDestinations) {
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
	const editButton = card.querySelector('.edit-btn');
	const deleteButton = card.querySelector('.delete-btn');

	cityName.textContent = destination.city;
	cityDescription.textContent = destination.description;
	dateVisited.textContent = `Visited on: ${new Date(destination.date).toLocaleDateString()}`;

	for (let i = 0; i < maxStars; i++) {
		const star = document.createElement('span');
		star.classList.add('star');
		if (i < destination.rating) {
			star.classList.add('filled');
		}
		star.textContent = '★';
		ratingDiv.appendChild(star);
	}

	// Display edit and delete buttons for the logged in user only
	toggleButtonVisibility([editButton, deleteButton]);

	editButton.addEventListener('click', async () => {
		console.log(`Editing destination: ${destination.city} from ${destination.country}`);
		await window.openEditDestinationDialog(destination);
	});

	deleteButton.addEventListener('click', async () => {
		await deleteDestination(destination);
	});

	sidebarContent.appendChild(card);
}

// Function to update the sidebar content when a destination is added
async function updateSidebarContent() {
	const selectedCountry = sessionStorage.getItem('selectedCountry');
	const selectedCountryCode = sessionStorage.getItem('selectedCountryCode');
	const username = sessionStorage.getItem('logged-username');
	const userId = sessionStorage.getItem('logged-_id');
	const travelDestinations = await fetchTravelDestinationsByUserAndCountry(userId, selectedCountry);

	initializeSidebarContent(selectedCountry, selectedCountryCode, username, travelDestinations);
}

// Function to toggle the visibility of the add/edit/delete destination button
function toggleButtonVisibility(buttons) {
	const selectedUser = sessionStorage.getItem('selectedUser');
	const loggedinUser = sessionStorage.getItem('logged-username');
	if (selectedUser === loggedinUser) {
		buttons.forEach((button) => (button.style.display = 'block'));
	} else {
		buttons.forEach((button) => (button.style.display = 'none'));
	}
}
