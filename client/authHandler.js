document.addEventListener('DOMContentLoaded', () => {
	const token = sessionStorage.getItem('jwt-TravelDestination');
	const username = sessionStorage.getItem('logged-username');
	const _id = sessionStorage.getItem('logged-_id');

	let loggedIn = token ? true : false;

	console.log(loggedIn, username, _id);

	// Get the modal elements
	const loginModal = document.getElementById('modal');
	const registerModal = document.getElementById('registerModal');

	const authLinks = document.querySelectorAll('.authLink');

	const loginForm = document.getElementById('loginForm');
	const registerForm = document.getElementById('registerForm');

	const leftSidebar = document.querySelector('.left-sidebar');
	const mainContent = document.querySelector('.main-content');

	// Show the login modal if the user is not logged in
	if (!loggedIn) {
		loginModal.showModal();
		leftSidebar.classList.add('blur');
		mainContent.classList.add('blur');
	}

	// Handle closing of the login modal
	loginModal.addEventListener('close', function () {
		if (loggedIn) {
			leftSidebar.classList.remove('blur');
			mainContent.classList.remove('blur');
		}
	});

	// --> SWITCH BETWEEN LOGIN MODAL AND REGISTER MODAL <--
	authLinks.forEach((authLink) => {
		authLink.addEventListener('click', function (event) {
			event.preventDefault(); // Prevent default anchor link behavior

			if (loginModal.hasAttribute('open')) {
				loginModal.close();
				registerModal.showModal();
			} else {
				loginModal.showModal();
				registerModal.close();
			}
		});
	});

	// If the user presses "Escape" on the register modal, bring them back to the login modal
	registerModal.addEventListener('cancel', function () {
		loginModal.showModal();
	});

	// Handle the login form submission
	loginForm.addEventListener('submit', function (event) {
		event.preventDefault(); // Prevent the form from actually submitting
		const username = document.getElementById('username').value.trim();
		const password = document.getElementById('password').value.trim();

		login(username, password);
	});

	// Handle the register form submission
	registerForm.addEventListener('submit', function (event) {
		event.preventDefault(); // Prevent the form from actually submitting
		const username = document.getElementById('regUsername').value.trim();
		const password = document.getElementById('regPassword').value.trim();
		const email = document.getElementById('regEmail').value.trim();

		register(username, password, email);
	});

	const login = async (username, password) => {
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
				loggedIn = true;

				// Store JWT token in session storage
				sessionStorage.setItem('jwt-TravelDestination', data.token);
				sessionStorage.setItem('logged-username', data.username);
				sessionStorage.setItem('logged-_id', data._id);

				sessionStorage.setItem('selectedUser', data.username);
				sessionStorage.setItem('selectedUserId', data._id);

				window.location.reload();
				//loginModal.close();
			} else {
				alert(data.message);
			}
		} catch (error) {
			console.error('Error logging in:', error);
		}
	};

	const logout = () => {
		sessionStorage.removeItem('jwt-TravelDestination');
		loggedIn = false;
	};

	const register = async (username, password, email) => {
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
				console.log('User registered:', data);
				registerModal.close();
				loginModal.showModal();
			} else {
				alert(data.message);
			}
		} catch (error) {
			console.error('Error registering user:', error);
		}
	};
});
