let loggedIn = false;

// Get the modal elements
const loginModal = document.getElementById('modal');
const registerModal = document.getElementById('registerModal');
const registerLink = document.getElementById('registerLink');

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
loginModal.addEventListener('close', function() {
    if (loggedIn) {
        leftSidebar.classList.remove('blur');
        mainContent.classList.remove('blur');
    }
});

// Handle the register link click to show the register modal and hide the login modal
registerLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor link behavior
    loginModal.close();
    registerModal.showModal();
});

// Handle the login form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from actually submitting
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Basic validation check
    if (username && password) {
        console.log('User logged in:', { username, password });
        loggedIn = true;
        loginModal.close();
    } else {
        alert("Please fill in both fields.");
    }
});

// Handle the register form submission
registerForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from actually submitting
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    
    // Basic validation check
    if (username && password && email) {
        console.log('User registered with:', { username, password, email });
        registerModal.close();
        loginModal.showModal(); // Return to the login modal after successful registration
    } else {
        alert("Please fill in all fields.");
    }
});

// If the user presses "Escape" on the register modal, bring them back to the login modal
registerModal.addEventListener('cancel', function() {
    loginModal.showModal();
});

// Optional: Persist the loggedIn state using localStorage
if (localStorage.getItem('loggedIn') === 'true') {
    loggedIn = true;
    loginModal.close();
    leftSidebar.classList.remove('blur');
    mainContent.classList.remove('blur');
}

if (loggedIn) {
    leftSidebar.classList.remove('blur');
    mainContent.classList.remove('blur');
}

// Save the state when user logs in
loginForm.addEventListener('submit', () => {
    localStorage.setItem('loggedIn', 'true');
});

