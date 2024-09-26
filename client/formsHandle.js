 // Simulating login status (replace with actual login logic)
let isLoggedIn = false;

 // Check login status and display appropriate content
        const mainContent = document.querySelector(".main-content");
        const loginMessage = document.getElementById("login-message");
        const userButtons = document.getElementById("user-buttons");

// DEBUG: Ensure we see what's happening in the console
        console.log("Login status:", isLoggedIn);

        if (isLoggedIn) {
          console.log("User is logged in, showing content");
          mainContent.classList.remove("hidden");
          userButtons.classList.remove("hidden");
          loginMessage.classList.add("hidden");
        } else {
          console.log("User is NOT logged in, showing login message");
          mainContent.classList.add("hidden");
          userButtons.classList.add("hidden");
          loginMessage.classList.remove("hidden");
        }

// Login
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    isLoggedIn = true;
    console.log('User is logged in:', isLoggedIn);
    // Additional login logic here
    if (isLoggedIn) {
        console.log("User is logged in, showing content");
        mainContent.classList.remove("hidden");
        userButtons.classList.remove("hidden");
        loginMessage.classList.add("hidden");
      } else {
        console.log("User is NOT logged in, showing login message");
        mainContent.classList.add("hidden");
        userButtons.classList.add("hidden");
        loginMessage.classList.remove("hidden");
      }
  });
  
// Modal handling
const signupModal = document.getElementById('signupModal');
const openSignupModal = document.getElementById('openSignupModal');
const closeModal = document.getElementById('closeModal');

openSignupModal.onclick = () => {
    signupModal.style.display = 'block';
};

closeModal.onclick = () => {
    signupModal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
};

// Handle sign-up form submission
document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Successful sign-up
            alert('Sign up successful! Please log in.');
            signupModal.style.display = 'none';
            document.getElementById('signupForm').reset();
        } else {
            // Display error message
            const signupErrorMessage = document.getElementById('signupErrorMessage');
            signupErrorMessage.textContent = result.error || 'Sign up failed. Please try again.';
            signupErrorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        const signupErrorMessage = document.getElementById('signupErrorMessage');
        signupErrorMessage.textContent = 'An error occurred. Please try again.';
        signupErrorMessage.style.display = 'block';
    }
});


