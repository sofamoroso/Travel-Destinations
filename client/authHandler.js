document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('jwt-TravelDestination');
    const username = sessionStorage.getItem('logged-username');
    const _id = sessionStorage.getItem('logged-_id');
  
    let loggedIn = token ? true : false;

    console.log("Logged in: ", loggedIn, username, _id);
    

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
        
        login(username, password);
    });

    // Handle the register form submission and log user input
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const email = document.getElementById('regEmail').value;
        
        register(username, password, email);
        
    });

    const login = async (username, password) => {
        try{
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
    
            if(response.ok){
                loggedIn = true;
                
                // Store JWT token in session storage
                sessionStorage.setItem('jwt-TravelDestination', data.token);
                sessionStorage.setItem('logged-username', data.username);
                sessionStorage.setItem('logged-_id', data._id);
                
                window.location.reload();
                //loginModal.close();
            } else {
                alert(data.message);   
            }
        } catch(error){
            console.error('Error logging in:', error);
        }
    }

    const logout = () => {
        sessionStorage.removeItem('jwt-TravelDestination');
        loggedIn = false;
    }

    const register = async (username, password, email) => {
        try{
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });
            const data = await response.json();
    
            if(response.ok){
                console.log('User registered:', data);
                registerModal.close();
                loginModal.showModal();
            } else {
                alert(data.message);   
            }
            
        } catch(error){
            console.error('Error registering user:', error);
        }
    }
});


