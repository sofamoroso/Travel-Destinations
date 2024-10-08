document.addEventListener('DOMContentLoaded', () => {
	initializeAuth();
});

function initializeAuth() {
	const token = sessionStorage.getItem('jwt-TravelDestination');
	const username = sessionStorage.getItem('logged-username');
	const _id = sessionStorage.getItem('logged-_id');

	const loggedIn = !!token;

	// Ensure that the selected user is the same as logged in user on page refresh
	if (loggedIn && username) {
		sessionStorage.setItem('selectedUser', username);
		sessionStorage.setItem('selectedUserId', _id);
	}

	console.log(loggedIn, username, _id);

	const loginModal = document.getElementById('modal');
	const registerModal = document.getElementById('registerModal');
	const authLinks = document.querySelectorAll('.authLink');
	const loginForm = document.getElementById('loginForm');
	const registerForm = document.getElementById('registerForm');
	const leftSidebar = document.querySelector('.left-sidebar');
	const mainContent = document.querySelector('.main-content');
	const logoutButton = document.getElementById('logoutButton');
	const deleteAccountButton = document.getElementById('deleteAccountButton'); //adding the delete account btn

	if (!loggedIn) {
		showLoginModal(loginModal, leftSidebar, mainContent);
	}

	handleLoginModalClose(loginModal, loggedIn, leftSidebar, mainContent);
	switchAuthModals(authLinks, loginModal, registerModal);
	handleRegisterModalCancel(registerModal, loginModal);
	handleLoginFormSubmit(loginForm);
	handleRegisterFormSubmit(registerForm);
	initializeLogoutButton(logoutButton);
	initializeDeleteAccountButton(deleteAccountButton, token);
}

function showLoginModal(loginModal, leftSidebar, mainContent) {
	loginModal.showModal();
	leftSidebar.classList.add('blur');
	mainContent.classList.add('blur');
}

function handleLoginModalClose(loginModal, loggedIn, leftSidebar, mainContent) {
	loginModal.addEventListener('close', () => {
		if (loggedIn) {
			leftSidebar.classList.remove('blur');
			mainContent.classList.remove('blur');
		}
	});
	// Prevent closing the modal when ESC key is pressed
    loginModal.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
        }
    });
}

function switchAuthModals(authLinks, loginModal, registerModal) {
	authLinks.forEach((authLink) => {
		authLink.addEventListener('click', (event) => {
			event.preventDefault();
			if (loginModal.hasAttribute('open')) {
				loginModal.close();
				registerModal.showModal();
			} else {
				loginModal.showModal();
				registerModal.close();
			}
		});
	});
}

function handleRegisterModalCancel(registerModal, loginModal) {
	registerModal.addEventListener('cancel', () => {
		loginModal.showModal();
	});
}

function handleLoginFormSubmit(loginForm) {
	loginForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const username = document.getElementById('username').value.trim();
		const password = document.getElementById('password').value.trim();
		login(username, password);
	});
}

function handleRegisterFormSubmit(registerForm) {
	registerForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const username = document.getElementById('regUsername').value.trim();
		const password = document.getElementById('regPassword').value.trim();
		const email = document.getElementById('regEmail').value.trim();
		register(username, password, email);
	});
}

function initializeLogoutButton() {
	// Display the button if the user is logged in or not
	if (sessionStorage.getItem('jwt-TravelDestination')) {
		logoutButton.style.display = 'block';
	} else {
		logoutButton.style.display = 'none';
	}

	// Attach logout event listener after the navbar has been loaded
	logoutButton.addEventListener('click', (event) => {
		event.preventDefault(); // Prevent default link behavior
		handleLogout();
	});
}

const handleLogout = () => {
	sessionStorage.removeItem('jwt-TravelDestination'); // Remove logged-in status from sessionStorage
	sessionStorage.removeItem('logged-_id');
	sessionStorage.removeItem('selectedUserId');
	sessionStorage.removeItem('logged-username');
	sessionStorage.removeItem('selectedUser');
	location.reload();
};

function initializeDeleteAccountButton(deleteAccountButton, token) {
	if (token) {
		deleteAccountButton.style.display = 'block'; // Show delete button
		deleteAccountButton.addEventListener('click', async (event) => {
			event.preventDefault(); // Prevent default link behavior
			handleDeleteAccount(); // Call delete account handler
		});
	} else {
		deleteAccountButton.style.display = 'none'; // Hide delete button
	}
}

async function handleDeleteAccount() {
	const confirmDeletion = confirm('Are you sure you want to delete your account?');

	if (confirmDeletion) {
		const token = sessionStorage.getItem('jwt-TravelDestination'); // Get the JWT token

		try {
			const response = await fetch(`/api/users/account`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`, // Send the token in the Authorization header
				},
			});

			if (response.ok) {
				alert('Your account has been deleted successfully.');
				handleLogout(); // Log the user out after deletion automatically
			} else {
				const data = await response.json();
				alert(data.message || 'An error occurred while deleting the account.');
			}
		} catch (error) {
			console.error('Error deleting account:', error);
		}
	}
}

const login = async (username, password) => {
	const LOGIN = "login";
	try {
		const response = await fetch('http://localhost:3000/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
		const data = await response.json();

		if (response.ok) {
			// Show popup after successful registration
			showPopupMessage('Login successful!', 3000, LOGIN, !!data.error);
			console.log(data);
			
			// Store JWT token in session storage
			sessionStorage.setItem('jwt-TravelDestination', data.token);
			sessionStorage.setItem('logged-username', data.username);
			sessionStorage.setItem('logged-_id', data._id);

			sessionStorage.setItem('selectedUser', data.username);
			sessionStorage.setItem('selectedUserId', data._id);

			setTimeout(() => {
				window.location.reload();
			}, 1500);
			
			//loginModal.close();
		} else {
			console.log(data);
			
			showPopupMessage(data.error, 3000, LOGIN, !!data.error);
		}
	} catch (error) {
		console.error('Error logging in:', error);
	}
};

const register = async (username, password, email) => {
	const registerModal = document.getElementById('registerModal');
	const loginModal = document.getElementById('modal');
	const REGISTER = "register";

	try {
		const response = await fetch('http://localhost:3000/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password, email }),
		});
		const data = await response.json();

		if (response.ok) {
			showPopupMessage(data.message, 3000, REGISTER, !!data.error);
			// Add a delay before closing the register modal and showing the login modal
			setTimeout(() => {
				registerModal.close();
				loginModal.showModal();
			}, 1500);
			
		} else {			
			showPopupMessage(data.error, 3000, REGISTER, !!data.error);
		}
	} catch (error) {
		console.error('Error registering user:', error);
	}
};


function showPopupMessage(message, duration = 3000, formType, error) {
    // Create the popup container
	let statusMessage = null;

	if (formType === "login") {
		statusMessage = document.querySelector("#login-status-message")
	} else if (formType === "register") {
		statusMessage = document.querySelector("#register-status-message")
	}

	statusMessage.textContent = message;

	if(error !== true){
		statusMessage.style.color  = "green";
	}

	// Display the popup
    statusMessage.style.visibility = "visible";

    // Remove the popup after the specified duration
    setTimeout(() => {
        statusMessage.style.visibility = "hidden";
    }, duration);
}
