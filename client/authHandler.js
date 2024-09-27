let loggedIn = false;

// Get the modal
const loginModal = document.getElementById('modal');
const registerModal = document.getElementById('registerModal');
const registerButton = document.getElementById('registerButton');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const leftSidebar = document.querySelector('.left-sidebar');
const mainContent = document.querySelector('.main-content');

// Show the modal if the user is not logged in
if (!loggedIn) {
    loginModal.showModal();
    leftSidebar.classList.add('blur');
    mainContent.classList.add('blur');
}

// When the modal is closed, set loggedIn to true and remove the blur effect
loginModal.addEventListener('close', function() {
    if(loggedIn) {
        leftSidebar.classList.remove('blur');
        mainContent.classList.remove('blur');
    }
});

// Handle the register button click to show the register modal and hide the login modal
registerButton.addEventListener('click', function() {
    loginModal.close();
    registerModal.showModal();
});

// Handle the login form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('User logged in:', { username, password, });
    loggedIn = true;
    loginModal.close();
});

// Handle the register form submission and log user input
registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value;
    console.log('User registered with:', { username, password, email });
    registerModal.close();
    loginModal.showModal();
});